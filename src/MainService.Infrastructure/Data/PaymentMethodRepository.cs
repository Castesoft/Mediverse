using AutoMapper;
using MainService.Core.DTOs.User;
using MainService.Core.Interfaces.Data;
using MainService.Infrastructure.QueryExtensions;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class PaymentMethodRepository(DataContext context, IMapper mapper) : IPaymentMethodRepository
{
    public void Add(PaymentMethod item) => context.PaymentMethods.Add(item);
    public void Delete(PaymentMethod item) => context.PaymentMethods.Remove(item);

    public async Task<PaymentMethod?> GetByIdAsync(int id) =>
        await context.PaymentMethods.Includes().SingleOrDefaultAsync(x => x.Id == id);

    public async Task<List<UserPaymentMethodDto>> GetAllByUserIdAsync(int userId) =>
        await context.PaymentMethods
            .Includes()
            .Where(x => x.UserId == userId)
            .Select(x => mapper.Map<UserPaymentMethodDto>(x))
            .ToListAsync();

    public async Task<PaymentMethod?> GetByIdAsNoTrackingAsync(int id) =>
        await context.PaymentMethods
            .Includes()
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<List<PaymentMethod>> GetAllAsync() => await context.PaymentMethods.ToListAsync();
}