using AutoMapper;
using MainService.Core.DTOs.MedicalRecord;
using MainService.Core.Interfaces.Services;
using MainService.Infrastructure.QueryExtensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Services;

public class MedicalRecordsService(UserManager<AppUser> userManager, IUnitOfWork uow, IMapper mapper) : IMedicalRecordsService
{
    public async Task<ActionResult<MedicalRecordDto>> UpdateMedicalRecordAsync(int userId,
        MedicalRecordUpdateDto request)
    {
        var user = await userManager.Users.AddMedicalRecordIncludes().SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return new NotFoundObjectResult($"El usuario con id {userId} no existe.");
        if (user.UserMedicalRecord != null)
        {
            var existingUserMedicalRecord = user.UserMedicalRecord;
            await uow.UserRepository.DeleteMedicalRecordAsync(existingUserMedicalRecord);
        }

        var itemToCreate = new MedicalRecord
        {
            PatientName = request.PatientName!,
            Age = request.Age,
            Sex = request.Sex?.Code,
            BirthPlace = request.BirthPlace,
            BirthDate = request.BirthDate,
            YearsOfSchooling = request.YearsOfSchooling,
            HandDominance = request.HandDominance?.Code,
            CurrentLivingSituation = request.CurrentLivingSituation,
            CurrentAddress = request.CurrentAddress,
            HomePhone = request.HomePhone,
            MobilePhone = request.MobilePhone,
            Email = request.Email,
            HasCompanion = request.HasCompanion ?? false,
            EconomicDependence = request.EconomicDependence,
            UsesGlassesOrHearingAid = request.UsesGlassesOrHearingAid ?? false,
            Comments = request.Comments
        };

        if (request.EducationLevel != null && request.EducationLevel.Id.HasValue)
        {
            var educationLevel = await uow.EducationLevelRepository.GetByIdAsync(request.EducationLevel.Id.Value);
            if (educationLevel == null)
                return new BadRequestObjectResult(
                    $"No se encontró el nivel de educación con id {request.EducationLevel.Id.Value}");

            itemToCreate.MedicalRecordEducationLevel = new MedicalRecordEducationLevel(educationLevel);
        }

        if (request.ColorBlindness != null && request.ColorBlindness.Id.HasValue)
        {
            var colorBlindness = await uow.ColorBlindnessRepository.GetByIdAsync(request.ColorBlindness.Id.Value);
            if (colorBlindness == null)
                return new BadRequestObjectResult(
                    $"No se encontró el tipo de daltonismo con id {request.ColorBlindness.Id.Value}");

            itemToCreate.MedicalRecordColorBlindness = new MedicalRecordColorBlindness(colorBlindness);
        }

        if (request.Occupation != null && request.Occupation.Id.HasValue)
        {
            var occupation = await uow.OccupationRepository.GetByIdAsync(request.Occupation.Id.Value);
            if (occupation == null)
                return new BadRequestObjectResult($"No se encontró la ocupación con id {request.Occupation.Id.Value}");

            itemToCreate.MedicalRecordOccupation = new MedicalRecordOccupation(occupation);
        }

        if (request.MaritalStatus != null && request.MaritalStatus.Id.HasValue)
        {
            var maritalStatus = await uow.MaritalStatusRepository.GetByIdAsync(request.MaritalStatus.Id.Value);
            if (maritalStatus == null)
                return new BadRequestObjectResult(
                    $"No se encontró el estado civil con id {request.MaritalStatus.Id.Value}");

            itemToCreate.MedicalRecordMaritalStatus = new MedicalRecordMaritalStatus(maritalStatus);
        }

        if (request.HasCompanion.HasValue && request.HasCompanion.Value && request?.Companion == null)
            return new BadRequestObjectResult(
                "Si el paciente asiste solo, debe proporcionar información del acompañante.");

        if (request.Companion != null && request.HasCompanion.HasValue && request.HasCompanion.Value)
        {
            var companion = new Companion
            {
                Name = request.Companion.Name,
                Age = request.Companion.Age,
                Sex = request.Companion.Sex?.Code,
                Address = request.Companion.Address,
                HomePhone = request.Companion.HomePhone,
                PhoneNumber = request.Companion.PhoneNumber,
                Email = request.Companion.Email
            };

            if (request.Companion.Occupation != null && request.Companion.Occupation.Id.HasValue)
            {
                var occupation = await uow.OccupationRepository.GetByIdAsync(request.Companion.Occupation.Id.Value);
                if (occupation == null)
                    return new BadRequestObjectResult(
                        $"No se encontró la ocupación del acompañante con id {request.Companion.Occupation.Id.Value}");

                companion.CompanionOccupation = new CompanionOccupation(occupation);
            }

            if (request.Companion.RelativeType != null && request.Companion.RelativeType.Id.HasValue)
            {
                var relativeType =
                    await uow.RelativeTypeRepository.GetByIdAsync(request.Companion.RelativeType.Id.Value);
                if (relativeType == null)
                    return new BadRequestObjectResult(
                        $"No se encontró el tipo de relación del acompañante con id {request.Companion.RelativeType.Id.Value}");

                companion.CompanionRelativeType = new CompanionRelativeType(relativeType);
            }

            itemToCreate.MedicalRecordCompanion = new MedicalRecordCompanion(companion);
        }

        if (request.FamilyMembers.Count != 0)
        {
            var medicalRecordFamilyMembers = new List<MedicalRecordFamilyMember>();
            foreach (var fm in request.FamilyMembers)
            {
                var familyMember = new FamilyMember
                {
                    Name = fm.Name,
                    Age = fm.Age
                };

                if (fm.RelativeType != null && fm.RelativeType.Id.HasValue)
                {
                    var relativeType = await uow.RelativeTypeRepository.GetByIdAsync(fm.RelativeType.Id.Value);
                    if (relativeType == null)
                        return new BadRequestObjectResult(
                            $"No se encontró el tipo de relación del familiar con id {fm.RelativeType.Id.Value}");

                    familyMember.MedicalRecordFamilyMemberRelativeType =
                        new MedicalRecordFamilyMemberRelativeType(relativeType);
                }

                medicalRecordFamilyMembers.Add(new MedicalRecordFamilyMember(familyMember));
            }

            itemToCreate.MedicalRecordFamilyMembers = medicalRecordFamilyMembers;
        }

        //
        // if (
        //     request?.PersonalMedicalHistory.Count() > 0 &&
        //     request.PersonalMedicalHistory[0].Disease != null
        // )
        // {
        //     List<MedicalRecordPersonalDisease> medicalRecordPersonalDiseases = new();
        //     for (var i = 0; i < request.PersonalMedicalHistory.Count(); i++)
        //     {
        //         var pd = request.PersonalMedicalHistory[i];
        //         if (pd == null) continue;
        //
        //         MedicalRecordPersonalDisease medicalRecordPersonalDiseaseToCreate = new();
        //
        //         if (!string.IsNullOrEmpty(pd.Description))
        //             medicalRecordPersonalDiseaseToCreate.Description = pd.Description;
        //         if (pd.Disease != null && pd.Disease.Id.HasValue)
        //             medicalRecordPersonalDiseaseToCreate.DiseaseId = pd.Disease.Id.Value;
        //
        //         medicalRecordPersonalDiseases.Add(medicalRecordPersonalDiseaseToCreate);
        //     }
        //
        //     itemToCreate.MedicalRecordPersonalDiseases = medicalRecordPersonalDiseases;
        // }
        //
        //
        // if (
        //     request?.PersonalDrugHistory.Count() > 0 &&
        //     request.PersonalDrugHistory[0].Substance != null &&
        //     request.PersonalDrugHistory[0].ConsumptionLevel != null
        // )
        // {
        //     List<MedicalRecordSubstance> medicalRecordSubstances = [];
        //     for (var i = 0; i < request.PersonalDrugHistory.Count(); i++)
        //     {
        //         var ps = request.PersonalDrugHistory[i];
        //         if (ps.Substance == null) continue;
        //
        //         MedicalRecordSubstance medicalRecordSubstanceToCreate = new();
        //
        //         if (ps.Substance != null) medicalRecordSubstanceToCreate.SubstanceId = ps.Substance.Id;
        //         if (ps.ConsumptionLevel != null)
        //             medicalRecordSubstanceToCreate.ConsumptionLevelId = ps.ConsumptionLevel.Id;
        //         if (ps.StartAge.HasValue) medicalRecordSubstanceToCreate.StartAge = ps.StartAge.Value;
        //         if (ps.EndAge.HasValue) medicalRecordSubstanceToCreate.EndAge = ps.EndAge.Value;
        //         if (ps.IsCurrent.HasValue) medicalRecordSubstanceToCreate.IsCurrent = ps.IsCurrent.Value;
        //         if (!string.IsNullOrEmpty(ps.Other)) medicalRecordSubstanceToCreate.Other = ps.Other;
        //
        //         medicalRecordSubstances.Add(medicalRecordSubstanceToCreate);
        //     }
        //
        //     itemToCreate.MedicalRecordSubstances = medicalRecordSubstances;
        // }
        //
        // if (
        //     request?.FamilyMedicalHistory.Count() > 0 &&
        //     request.FamilyMedicalHistory[0].Disease != null &&
        //     request.FamilyMedicalHistory[0].RelativeType != null
        // )
        // {
        //     List<MedicalRecordFamilyDisease> medicalRecordFamilyDiseases = [];
        //     for (var i = 0; i < request.FamilyMedicalHistory.Count(); i++)
        //     {
        //         var fd = request.FamilyMedicalHistory[i];
        //         if (fd == null) continue;
        //
        //         MedicalRecordFamilyDisease medicalRecordFamilyDiseaseToCreate = new();
        //
        //         if (fd.Disease != null) medicalRecordFamilyDiseaseToCreate.DiseaseId = fd.Disease.Id;
        //         if (fd.RelativeType != null && fd.RelativeType.Id.HasValue)
        //             medicalRecordFamilyDiseaseToCreate.RelativeTypeId = fd.RelativeType.Id.Value;
        //
        //         medicalRecordFamilyDiseases.Add(medicalRecordFamilyDiseaseToCreate);
        //     }
        //
        //     itemToCreate.MedicalRecordFamilyDiseases = medicalRecordFamilyDiseases;
        // }

        user.UserMedicalRecord = new UserMedicalRecord(itemToCreate);

        if (uow.HasChanges() && !await uow.Complete())
            return new BadRequestObjectResult("Error actualizando el historial clínico.");

        var medicalRecordDto = await uow.UserRepository.GetMedicalRecordDtoAsync(userId);
        if (medicalRecordDto == null)
            return new BadRequestObjectResult("Error obteniendo el historial actualizado");
        
        return medicalRecordDto;
    }
}