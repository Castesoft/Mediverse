using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Payment;
using MainService.Core.DTOs.User;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
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

    public async Task<PagedList<PaymentDto>> GetPagedListAsync(PaymentParams param)
    {
        var query = context.Payments
            .Include(x => x.Event).ThenInclude(x => x.DoctorEvent)
            .Include(x => x.Event).ThenInclude(x => x.Payments).ThenInclude(x => x.PaymentMethod)
            .Include(x => x.PaymentMethod)
            .AsQueryable();

        if (param.DoctorId.HasValue)
        {
            query = query.Where(x => x.Event.DoctorEvent.DoctorId == param.DoctorId);
        }

        if (param.UserId.HasValue)
        {
            query = query.Where(x => x.Event.PatientEvent.PatientId == param.UserId);
        }

        if (param.EventId.HasValue)
        {
            query = query.Where(x => x.EventId == param.EventId);
        }

        if (!string.IsNullOrEmpty(param.Search))
        {
            var term = param.Search.ToLower();

            query = query.Where(
                x =>
                    !string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term)
            );
        }

        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                "id" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Id)
                    : query.OrderByDescending(x => x.Id),
                "name" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Name)
                    : query.OrderByDescending(x => x.Name),
                "description" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Description)
                    : query.OrderByDescending(x => x.Description),
            };
        }
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        return await PagedList<PaymentDto>.CreateAsync(
            query.ProjectTo<PaymentDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize
        );
    }

    public async Task<Payment?> GetByStripePaymentIntentAsync(string stripePaymentIntent)
    {
        return await context.Payments.FirstOrDefaultAsync(p => p.StripePaymentIntent == stripePaymentIntent);
    }

    public void Delete(Payment payment)
    {
        context.Payments.Remove(payment);
    }
}