using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;
using Serilog;

namespace MainService.Infrastructure.Services
{
    public class PhotosService(IUnitOfWork uow, ICloudinaryService cloudinaryService) : IPhotosService
    {
        public async Task<bool> DeleteAsync(Photo item)
        {
            Photo? itemToDelete = await uow.PhotoRepository.GetByIdAsync(item.Id);

            if (itemToDelete == null) return false;

            if (!string.IsNullOrEmpty(itemToDelete.PublicId))
            {
                var deleteResult = await cloudinaryService.DeleteAsync(itemToDelete.PublicId);

                if (deleteResult.Result != "ok")
                    Log.Information($"La foto con ID {item.Id} no pudo ser eliminada de Cloudinary. Resultado: {deleteResult.Result}.");
            }

            uow.PhotoRepository.Delete(itemToDelete);

            if (!await uow.Complete()) return false;

            return true;
        }
    }

    public class MedicalInsuranceCompaniesService(IUnitOfWork uow) : IMedicalInsuranceCompaniesService {
        public async Task<bool> DeleteByIdAsync(int id)
        {
            MedicalInsuranceCompany? itemToDelete = await uow.MedicalInsuranceCompanyRepository.GetByIdAsync(id);

            if (itemToDelete == null) return false;

            uow.MedicalInsuranceCompanyRepository.Delete(itemToDelete);

            if (!await uow.Complete()) return false;

            return true;
        }
    }

    public class PaymentMethodTypesService(IUnitOfWork uow) : IPaymentMethodTypesService {
        public async Task<bool> DeleteByIdAsync(int id)
        {
            PaymentMethodType? itemToDelete = await uow.PaymentMethodTypeRepository.GetByIdAsync(id);

            if (itemToDelete == null) return false;

            uow.PaymentMethodTypeRepository.Delete(itemToDelete);

            if (!await uow.Complete()) return false;

            return true;
        }
    }

    public class SpecialtiesService(IUnitOfWork uow) : ISpecialtiesService {
        public async Task<bool> DeleteByIdAsync(int id)
        {
            Specialty? itemToDelete = await uow.SpecialtyRepository.GetByIdAsync(id);

            if (itemToDelete == null) return false;

            uow.SpecialtyRepository.Delete(itemToDelete);

            if (!await uow.Complete()) return false;

            return true;
        }
    }

    public class DiseasesService(IUnitOfWork uow) : IDiseasesService {
        public async Task<bool> DeleteByIdAsync(int id)
        {
            Disease? itemToDelete = await uow.DiseaseRepository.GetByIdAsync(id);

            if (itemToDelete == null) return false;

            uow.DiseaseRepository.Delete(itemToDelete);

            if (!await uow.Complete()) return false;

            return true;
        }
    }

    public class SubstancesService(IUnitOfWork uow) : ISubstancesService {
        public async Task<bool> DeleteByIdAsync(int id)
        {
            Substance? itemToDelete = await uow.SubstanceRepository.GetByIdAsync(id);

            if (itemToDelete == null) return false;

            uow.SubstanceRepository.Delete(itemToDelete);

            if (!await uow.Complete()) return false;

            return true;
        }
    }

    public class OccupationsService(IUnitOfWork uow) : IOccupationsService {
        public async Task<bool> DeleteByIdAsync(int id)
        {
            Occupation? itemToDelete = await uow.OccupationRepository.GetByIdAsync(id);

            if (itemToDelete == null) return false;

            uow.OccupationRepository.Delete(itemToDelete);

            if (!await uow.Complete()) return false;

            return true;
        }
    }

    public class MaritalStatusesService(IUnitOfWork uow) : IMaritalStatusesService {
        public async Task<bool> DeleteByIdAsync(int id)
        {
            MaritalStatus? itemToDelete = await uow.MaritalStatusRepository.GetByIdAsync(id);

            if (itemToDelete == null) return false;

            uow.MaritalStatusRepository.Delete(itemToDelete);

            if (!await uow.Complete()) return false;

            return true;
        }
    }

    public class EducationLevelsService(IUnitOfWork uow) : IEducationLevelsService {
        public async Task<bool> DeleteByIdAsync(int id)
        {
            EducationLevel? itemToDelete = await uow.EducationLevelRepository.GetByIdAsync(id);

            if (itemToDelete == null) return false;

            uow.EducationLevelRepository.Delete(itemToDelete);

            if (!await uow.Complete()) return false;

            return true;
        }
    }



    public class ColorBlindnessesService(IUnitOfWork uow) : IColorBlindnessesService {
        public async Task<bool> DeleteByIdAsync(int id)
        {
            ColorBlindness? itemToDelete = await uow.ColorBlindnessRepository.GetByIdAsync(id);

            if (itemToDelete == null) return false;

            uow.ColorBlindnessRepository.Delete(itemToDelete);

            if (!await uow.Complete()) return false;

            return true;
        }
    }

    public class RelativeTypesService(IUnitOfWork uow) : IRelativeTypesService {
        public async Task<bool> DeleteByIdAsync(int id)
        {
            RelativeType? itemToDelete = await uow.RelativeTypeRepository.GetByIdAsync(id);

            if (itemToDelete == null) return false;

            uow.RelativeTypeRepository.Delete(itemToDelete);

            if (!await uow.Complete()) return false;

            return true;
        }
    }

    public class ConsumptionLevelsService(IUnitOfWork uow) : IConsumptionLevelsService {
        public async Task<bool> DeleteByIdAsync(int id)
        {
            ConsumptionLevel? itemToDelete = await uow.ConsumptionLevelRepository.GetByIdAsync(id);

            if (itemToDelete == null) return false;

            uow.ConsumptionLevelRepository.Delete(itemToDelete);

            if (!await uow.Complete()) return false;

            return true;
        }
    }
}