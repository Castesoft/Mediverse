using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface IPrescriptionsService
{
Task<bool> DeleteAsync(Prescription item);
}