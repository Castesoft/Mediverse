using AutoMapper;
using MainService.Core.DTOs.Payment;
using MainService.Core.Interfaces.Repositories;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MainService.Infrastructure.Data;

public class PaymentMethodPreferenceRepository(DataContext context, IMapper mapper) : IPaymentMethodPreferenceRepository
{
    public void Add(PaymentMethodPreference preference)
    {
        context.PaymentMethodPreferences.Add(preference);
    }

    public void Update(PaymentMethodPreference preference)
    {
        context.Entry(preference).State = EntityState.Modified;
    }

    public void Delete(PaymentMethodPreference preference)
    {
        context.PaymentMethodPreferences.Remove(preference);
    }

    public async Task<List<PaymentMethodPreferenceDto>> GetByUserIdAsync(int userId)
    {
        var preferences = await context.PaymentMethodPreferences
            .Include(p => p.PaymentMethodType)
            .Where(p => p.UserId == userId)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();

        return mapper.Map<List<PaymentMethodPreferenceDto>>(preferences);
    }

    public async Task<PaymentMethodPreferenceDto> GetByUserIdAndPaymentMethodTypeIdAsync(int userId, int paymentMethodTypeId)
    {
        var preference = await context.PaymentMethodPreferences
            .Include(p => p.PaymentMethodType)
            .FirstOrDefaultAsync(p => p.UserId == userId && p.PaymentMethodTypeId == paymentMethodTypeId);

        return mapper.Map<PaymentMethodPreferenceDto>(preference);
    }
    
    public async Task<PaymentMethodPreference> GetEntityByUserIdAndPaymentMethodTypeIdAsync(int userId, int paymentMethodTypeId)
    {
        return await context.PaymentMethodPreferences
            .FirstOrDefaultAsync(p => p.UserId == userId && p.PaymentMethodTypeId == paymentMethodTypeId);
    }

    public async Task UnsetDefaultForUserAsync(int userId)
    {
        var defaultPreferences = await context.PaymentMethodPreferences
            .Where(p => p.UserId == userId && p.IsDefault)
            .ToListAsync();

        foreach (var preference in defaultPreferences)
        {
            preference.IsDefault = false;
        }
    }
}