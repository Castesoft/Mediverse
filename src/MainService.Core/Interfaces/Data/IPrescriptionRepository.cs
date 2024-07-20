using MainService.Core.DTOs.Prescription;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IPrescriptionRepository
{
    void Add(Prescription item);
    Task<PrescriptionDto> GetDtoByIdAsync(int id);
}