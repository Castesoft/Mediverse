using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class PaymentRepository(DataContext context, IMapper mapper) : IPaymentRepository
{
    public void Add(Payment payment)
    {
        context.Payments.Add(payment);
    }

    public async Task<Payment?> GetByIdAsync(int id)
    {
        return await context.Payments
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Payment>> GetPaymentsByEventIdAsync(int eventId)
    {
        return await context.Payments
            .Where(p => p.EventId == eventId)
            .ToListAsync();
    }
}