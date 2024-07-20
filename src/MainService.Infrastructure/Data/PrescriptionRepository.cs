using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;

namespace MainService.Infrastructure.Data;

public class PrescriptionRepository(DataContext context, IMapper mapper) : IPrescriptionRepository
{
    public void Add(Prescription item)
    {
        context.Prescriptions.Add(item);
    }
}