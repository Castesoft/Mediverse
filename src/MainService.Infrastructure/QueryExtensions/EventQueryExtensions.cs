using MainService.Models.Entities;
using MainService.Core.Helpers.Params;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.QueryExtensions
{
    public static class EventQueryExtensions
    {
        /// <summary>
        /// Includes related navigation properties for Event.
        /// </summary>
        public static IQueryable<Event> Includes(this IQueryable<Event> query)
        {
            return query
                .Include(x => x.EventService).ThenInclude(x => x.Service)
                .Include(x => x.EventClinic)
                .Include(x => x.DoctorEvent).ThenInclude(x => x.Doctor).ThenInclude(x => x.UserPhoto)
                .ThenInclude(x => x.Photo)
                .Include(x => x.PatientEvent)
                .Include(x => x.PatientEvent.Patient.UserPhoto.Photo)
                .Include(x => x.NurseEvents)
                .Include(x => x.EventPrescriptions).ThenInclude(x => x.Prescription)
                .Include(x => x.EventPaymentMethodType)
                .Include(x => x.EventMedicalInsuranceCompany)
                .Include(x => x.Payments)
                .AsSplitQuery();
        }

        /// <summary>
        /// Applies filtering to the event query based on the provided parameters.
        /// </summary>
        public static IQueryable<Event> ApplyFiltering(this IQueryable<Event> query, EventParams param)
        {
            if (param.DoctorId.HasValue)
            {
                query = query.Where(x => x.DoctorEvent.DoctorId == param.DoctorId.Value);
            }

            if (param.PatientId.HasValue)
            {
                query = query.Where(x => x.PatientEvent.PatientId == param.PatientId.Value);
            }

            if (param.ServiceId.HasValue)
            {
                query = query.Where(x => x.EventService.ServiceId == param.ServiceId.Value);
            }

            if (param.NurseId.HasValue)
            {
                query = query.Where(x => x.NurseEvents.Any(ne => ne.NurseId == param.NurseId.Value));
            }

            if (param.UserId.HasValue)
            {
                query = query.Where(x =>
                    x.PatientEvent.PatientId == param.UserId ||
                    x.DoctorEvent.DoctorId == param.UserId ||
                    x.NurseEvents.Any(ne => ne.NurseId == param.UserId));
            }

            if (param.DateFrom.HasValue)
            {
                query = query.Where(x => x.DateFrom >= param.DateFrom.Value || x.DateTo >= param.DateFrom.Value);
            }

            if (param.DateTo.HasValue)
            {
                query = query.Where(x => x.DateTo <= param.DateTo.Value || x.DateFrom <= param.DateTo.Value);
            }

            if (!string.IsNullOrEmpty(param.Search))
            {
                var term = param.Search.ToLower();
                query = query.Where(x =>
                    x.DoctorEvent.Doctor.FirstName.ToLower().Contains(term) ||
                    x.DoctorEvent.Doctor.LastName.ToLower().Contains(term)
                );
            }

            if (!string.IsNullOrEmpty(param.Patients))
            {
                var patients = param.GetPatients();
                if (patients.Count != 0)
                {
                    query = query.Where(x => x.PatientEvent != null && patients.Contains(x.PatientEvent.PatientId));
                }
            }

            if (!string.IsNullOrEmpty(param.Services))
            {
                var services = param.GetServices();
                if (services.Count != 0)
                {
                    query = query.Where(x => services.Contains(x.EventService.ServiceId));
                }
            }

            if (!string.IsNullOrEmpty(param.Nurses))
            {
                var nurses = param.GetNurses();
                if (nurses.Count != 0)
                {
                    query = query.Where(x => x.NurseEvents.Any(ne => nurses.Contains(ne.NurseId)));
                }
            }

            return query;
        }

        /// <summary>
        /// Applies sorting to the event query.
        /// If custom sorting parameters are added to EventParams, you can extend this method.
        /// Currently, it defaults to ordering by DateFrom ascending then by DateTo ascending.
        /// </summary>
        public static IQueryable<Event> ApplySorting(this IQueryable<Event> query, EventParams param)
        {
            return query.OrderBy(x => x.DateFrom).ThenBy(x => x.DateTo);
        }
    }
}