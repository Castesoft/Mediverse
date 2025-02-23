using MainService.Core.Helpers.Params;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.QueryExtensions;

public static class PrescriptionQueryExtensions
{
    public static IQueryable<Prescription> ApplyIncludes(this IQueryable<Prescription> query) =>
        query
            .Include(x => x.DoctorPrescription.Doctor)
            .Include(x => x.PrescriptionItems).ThenInclude(x => x.Product)
            .Include(x => x.EventPrescription.Event.EventClinic.Clinic.ClinicLogo.Photo)
            .Include(x => x.PatientPrescription.Patient.UserPhoto.Photo)
            .Include(x => x.PrescriptionOrder.Order)
            .Include(x => x.PrescriptionClinic)
            .Include(x => x.PrescriptionClinic).ThenInclude(x => x.Clinic).ThenInclude(x => x.ClinicLogo)
            .ThenInclude(x => x.Photo);

    public static IQueryable<Prescription> ApplyFilters(this IQueryable<Prescription> query, PrescriptionParams param)
    {
        if (param.UserId.HasValue)
        {
            query = query.Where(x => x.DoctorPrescription.Doctor.Id == param.UserId.Value);
        }

        if (param.EventId.HasValue)
        {
            query = query.Where(x => x.EventPrescription.EventId == param.EventId);
        }

        if (param.Sort != null && !string.IsNullOrEmpty(param.Sort))
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
                _ => query.OrderBy(x => x.Id),
            };
        }

        if (!string.IsNullOrEmpty(param.Search))
        {
            string term = param.Search.ToLower();

            query = query.Where(
                x =>
                    !string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term)
            );
        }

        if (param.ForTypeahead.HasValue)
        {
            if (param.ForTypeahead.Value)
            {
                query = query.Take(50);
            }
        }

        return query;
    }
}