using AutoMapper;
using MainService.Core.DTOs.MedicalRecord;
using MainService.Core.Interfaces.Services;
using MainService.Infrastructure.QueryExtensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Services;

public class MedicalRecordsService(UserManager<AppUser> userManager, IUnitOfWork uow) : IMedicalRecordsService
{
    public async Task<ActionResult<MedicalRecordDto>> UpdateMedicalRecordAsync(int userId,
        MedicalRecordUpdateDto request)
    {
        var user = await userManager.Users.AddMedicalRecordIncludes().SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return new NotFoundObjectResult($"El usuario con id {userId} no existe.");

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

        var companionProcessed = await ProcessCompanion(request.Companion, request.HasCompanion, itemToCreate);
        if (companionProcessed is BadRequestObjectResult) return companionProcessed;

        var familyMembersProcessed = await ProcessFamilyMembers(request.FamilyMembers, itemToCreate);
        if (familyMembersProcessed is BadRequestObjectResult) return familyMembersProcessed;

        var personalMedicalHistoryProcessed = await ProcessPersonalMedicalHistory(request, itemToCreate);
        if (personalMedicalHistoryProcessed is BadRequestObjectResult) return personalMedicalHistoryProcessed;

        var personalDrugHistoryProcessed = await ProcessPersonalDrugHistory(request, itemToCreate);
        if (personalDrugHistoryProcessed is BadRequestObjectResult) return personalDrugHistoryProcessed;

        // var familyMedicalHistoryProcessed = await ProcessFamilyMedicalHistory(request, itemToCreate);
        // if (familyMedicalHistoryProcessed is BadRequestObjectResult) return familyMedicalHistoryProcessed;

        if (user.UserMedicalRecord != null)
        {
            var existingUserMedicalRecord = user.UserMedicalRecord;
            await uow.UserRepository.DeleteMedicalRecordAsync(existingUserMedicalRecord);
        }
        
        user.UserMedicalRecord = new UserMedicalRecord(user, itemToCreate);

        if (uow.HasChanges() && !await uow.Complete())
            return new BadRequestObjectResult("Error actualizando el historial clínico.");

        var medicalRecordDto = await uow.UserRepository.GetMedicalRecordDtoAsync(userId);
        if (medicalRecordDto == null)
            return new BadRequestObjectResult("Error obteniendo el historial actualizado");

        return medicalRecordDto;
    }

    private async Task<ActionResult> ProcessCompanion(MedicalRecordUpdateCompanionDto? companionDto, bool? hasCompanion,
        MedicalRecord itemToCreate)
    {
        if (hasCompanion.HasValue && hasCompanion.Value && companionDto == null)
            return new BadRequestObjectResult(
                "Si el paciente asiste solo, debe proporcionar información del acompañante.");

        if (companionDto == null || !hasCompanion.HasValue || !hasCompanion.Value) return new OkResult();

        var companion = new Companion
        {
            Name = companionDto.Name,
            Age = companionDto.Age,
            Sex = companionDto.Sex?.Code,
            Address = companionDto.Address,
            HomePhone = companionDto.HomeNumber,
            PhoneNumber = companionDto.PhoneNumber,
            Email = companionDto.Email
        };

        if (companionDto.Occupation != null && companionDto.Occupation.Id.HasValue)
        {
            var occupation = await uow.OccupationRepository.GetByIdAsync(companionDto.Occupation.Id.Value);
            if (occupation == null)
                return new BadRequestObjectResult(
                    $"No se encontró la ocupación del acompañante con id {companionDto.Occupation.Id.Value}");

            companion.CompanionOccupation = new CompanionOccupation(occupation);
        }

        if (companionDto.RelativeType != null && companionDto.RelativeType.Id.HasValue)
        {
            var relativeType =
                await uow.RelativeTypeRepository.GetByIdAsync(companionDto.RelativeType.Id.Value);
            if (relativeType == null)
                return new BadRequestObjectResult(
                    $"No se encontró el tipo de relación del acompañante con id {companionDto.RelativeType.Id.Value}");

            companion.CompanionRelativeType = new CompanionRelativeType(relativeType);
        }

        itemToCreate.MedicalRecordCompanion = new MedicalRecordCompanion(companion);

        return new OkResult();
    }

    private async Task<ActionResult> ProcessFamilyMembers(List<MedicalRecordUpdateFamilyMemberDto> familyMembers,
        MedicalRecord itemToCreate)
    {
        if (familyMembers.Count == 0) return new OkResult();

        var medicalRecordFamilyMembers = new List<MedicalRecordFamilyMember>();

        foreach (var fm in familyMembers)
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

        return new OkResult();
    }

    private async Task<ActionResult> ProcessPersonalMedicalHistory(MedicalRecordUpdateDto request,
        MedicalRecord itemToCreate)
    {
        if (request.PersonalMedicalHistory.Count == 0 || request.PersonalMedicalHistory[0].Disease == null)
            return new OkResult();

        var medicalRecordPersonalDiseases = new List<MedicalRecordPersonalDisease>();

        foreach (var pd in request.PersonalMedicalHistory)
        {
            var medicalRecordPersonalDiseaseToCreate = new MedicalRecordPersonalDisease
            {
                Description = pd.Description
            };

            if (pd.Disease is { Id: not null })
            {
                var disease = await uow.DiseaseRepository.GetByIdAsync(pd.Disease.Id.Value);
                if (disease == null)
                    return new BadRequestObjectResult($"No se encontró la enfermedad con id {pd.Disease.Id.Value}");

                medicalRecordPersonalDiseaseToCreate = new MedicalRecordPersonalDisease(disease);
            }

            medicalRecordPersonalDiseases.Add(medicalRecordPersonalDiseaseToCreate);
        }

        itemToCreate.MedicalRecordPersonalDiseases = medicalRecordPersonalDiseases;

        return new OkResult();
    }

    private async Task<ActionResult> ProcessPersonalDrugHistory(MedicalRecordUpdateDto request,
        MedicalRecord itemToCreate)
    {
        if (request.PersonalDrugHistory.Count == 0) return new OkResult();

        var medicalRecordSubstances = new List<MedicalRecordSubstance>();
        foreach (var ps in request.PersonalDrugHistory)
        {
            if (ps.Substance == null) continue;

            var medicalRecordSubstanceToCreate = new MedicalRecordSubstance
            {
                StartAge = ps.StartAge,
                EndAge = ps.EndAge,
                IsCurrent = ps.IsCurrent ?? false,
                Other = ps.Other,
            };

            if (ps.Substance != null)
            {
                var substance = await uow.SubstanceRepository.GetByIdAsync(ps.Substance.Id);
                if (substance == null)
                    return new BadRequestObjectResult($"No se encontró la sustancia con id {ps.Substance.Id}");

                medicalRecordSubstanceToCreate.Substance = substance;
            }


            if (ps.ConsumptionLevel != null)
            {
                var consumptionLevel = await uow.ConsumptionLevelRepository.GetByIdAsync(ps.ConsumptionLevel.Id);
                if (consumptionLevel == null)
                    return new BadRequestObjectResult(
                        $"No se encontró el nivel de consumo con id {ps.ConsumptionLevel.Id}");

                medicalRecordSubstanceToCreate.ConsumptionLevel = consumptionLevel;
            }

            medicalRecordSubstances.Add(medicalRecordSubstanceToCreate);
        }

        itemToCreate.MedicalRecordSubstances = medicalRecordSubstances;

        return new OkResult();
    }

    private async Task<ActionResult> ProcessFamilyMedicalHistory(MedicalRecordUpdateDto request,
        MedicalRecord itemToCreate)
    {
        if (request.FamilyMedicalHistory.Count == 0) return new OkResult();

        var medicalRecordFamilyDiseases = new List<MedicalRecordFamilyDisease>();
        foreach (var fd in request.FamilyMedicalHistory)
        {
            var medicalRecordFamilyDiseaseToCreate = new MedicalRecordFamilyDisease();

            if (fd.Disease != null)
            {
                var disease = await uow.DiseaseRepository.GetByIdAsync(fd.Disease.Id);
                if (disease == null)
                    return new BadRequestObjectResult($"No se encontró la enfermedad con id {fd.Disease.Id}");

                medicalRecordFamilyDiseaseToCreate.Disease = disease;
            }

            if (fd.RelativeType != null && fd.RelativeType.Id.HasValue)
            {
                var relativeType = await uow.RelativeTypeRepository.GetByIdAsync(fd.RelativeType.Id.Value);
                if (relativeType == null)
                    return new BadRequestObjectResult(
                        $"No se encontró el tipo de relación con id {fd.RelativeType.Id}");

                medicalRecordFamilyDiseaseToCreate.RelativeType = relativeType;
            }

            medicalRecordFamilyDiseases.Add(medicalRecordFamilyDiseaseToCreate);
        }

        itemToCreate.MedicalRecordFamilyDiseases = medicalRecordFamilyDiseases;

        return new OkResult();
    }
}