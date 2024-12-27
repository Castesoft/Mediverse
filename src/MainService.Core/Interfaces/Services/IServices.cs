namespace MainService.Core.Interfaces.Services
{
    public interface IDeliveryStatusesService
    {
        Task<bool> DeleteByIdAsync(int id);
    }

    public interface IOrderStatusesService
    {
        Task<bool> DeleteByIdAsync(int id);
    }

    public interface ISpecialtiesService
    {
        Task<bool> DeleteByIdAsync(int id);
    }

    public interface IMedicalInsuranceCompaniesService
    {
        Task<bool> DeleteByIdAsync(int id);
    }

    public interface IPaymentMethodTypesService
    {
        Task<bool> DeleteByIdAsync(int id);
    }

    public interface IColorBlindnessesService
    {
        Task<bool> DeleteByIdAsync(int id);
    }

    public interface IConsumptionLevelsService
    {
        Task<bool> DeleteByIdAsync(int id);
    }
    public interface IDiseasesService
    {
        Task<bool> DeleteByIdAsync(int id);
    }

    public interface IMaritalStatusesService
    {
        Task<bool> DeleteByIdAsync(int id);
    }

    public interface IEducationLevelsService
    {
        Task<bool> DeleteByIdAsync(int id);
    }

    public interface IOccupationsService
    {
        Task<bool> DeleteByIdAsync(int id);
    }

    public interface IRelativeTypesService
    {
        Task<bool> DeleteByIdAsync(int id);
    }

    public interface ISubstancesService
    {
        Task<bool> DeleteByIdAsync(int id);
    }
}