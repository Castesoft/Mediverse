#nullable enable

using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Search;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Core.Interfaces.Services;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data
{
    public class SearchRepository(DataContext context, IMapper mapper, IGoogleService googleService) : ISearchRepository
    {
        public async Task<PagedList<DoctorSearchResultDto>> GetPagedListAsync(SearchParams param)
        {
            var query = Includes(context.Users).AsQueryable();

            query = query.Where(x => x.UserMedicalLicenses.Count != 0);

            if (!string.IsNullOrEmpty(param.Specialty))
            {
                query = query.Where(x => 
                    x.UserMedicalLicenses.Any(y => y.MedicalLicense.MedicalLicenseSpecialty.Specialty.Name == param.Specialty) ||
                    EF.Functions.ILike(x.FirstName + " " + x.LastName, $"%{param.Specialty}%")
                );
            }

            if (param.SpecialtyId.HasValue)
            {
                query = query.Where(x => x.UserMedicalLicenses.Any(y => y.MedicalLicense.MedicalLicenseSpecialty.SpecialtyId == param.SpecialtyId));
            }

            if (param.GetSpecialtyIds().Count() > 0) {
                query = query.Where(x => x.UserMedicalLicenses.Any(y => param.GetSpecialtyIds().Contains(y.MedicalLicense.MedicalLicenseSpecialty.SpecialtyId)));
            }

            if (!string.IsNullOrEmpty(param.Location))
            {
                var location = await googleService.GetLocationByPlaceIdAsync(param.Location);
                double latitude = location.Geometry.Location.Lat;
                param.Latitude = latitude;
                double longitude = location.Geometry.Location.Lng;
                param.Longitude = longitude;
                double radiusInKm = 50.0;

                query = query.Where(x => x.DoctorClinics.Any(a => 
                    6371 * Math.Acos(
                        Math.Cos(Math.PI * latitude / 180) * Math.Cos(Math.PI * (double)a.Clinic.Latitude / 180) *
                        Math.Cos(Math.PI * (double)a.Clinic.Longitude / 180 - Math.PI * longitude / 180) +
                        Math.Sin(Math.PI * latitude / 180) * Math.Sin(Math.PI * (double)a.Clinic.Latitude / 180)
                    ) <= radiusInKm
                ));

                query = query.OrderBy(x => x.DoctorClinics
                    .Min(a => 6371 * Math.Acos(
                        Math.Cos(Math.PI * latitude / 180) * Math.Cos(Math.PI * (double)a.Clinic.Latitude / 180) *
                        Math.Cos(Math.PI * (double)a.Clinic.Longitude / 180 - Math.PI * longitude / 180) +
                        Math.Sin(Math.PI * latitude / 180) * Math.Sin(Math.PI * (double)a.Clinic.Latitude / 180)
                    ))
                );
            }

            return await PagedList<DoctorSearchResultDto>.CreateAsync(
                query.AsNoTracking().ProjectTo<DoctorSearchResultDto>(mapper.ConfigurationProvider),
                param.PageNumber, param.PageSize);
        }
        public async Task<DoctorSearchResultDto> GetDoctorByIdAsync(int id)
        {
            var query = context.Users
                .Include(x => x.UserMedicalLicenses)
                    .ThenInclude(x => x.MedicalLicense)
                    .ThenInclude(x => x.MedicalLicenseSpecialty)
                    .ThenInclude(x => x.Specialty)
                .Include(x => x.DoctorClinics)
                    .ThenInclude(x => x.Clinic)
                .Include(x => x.DoctorWorkSchedules)
                    .ThenInclude(x => x.WorkSchedule)
                .Include(x => x.DoctorEvents)
                    .ThenInclude(x => x.Event)
                .Include(x => x.DoctorReviews)
                    .ThenInclude(x => x.Review)
                    .ThenInclude(x => x.UserReview)
                    .ThenInclude(x => x.User)
                .Include(x => x.DoctorMedicalInsuranceCompanies)
                    .ThenInclude(x => x.MedicalInsuranceCompany)
                .Include(x => x.Patients)
                    .ThenInclude(x => x.Patient)
                .Where(x => x.Id == id)
                .AsQueryable();

            return await query.AsNoTracking().ProjectTo<DoctorSearchResultDto>(mapper.ConfigurationProvider).FirstOrDefaultAsync();
        }

        private static IQueryable<AppUser> Includes(IQueryable<AppUser> query) =>
            query
                .AsSplitQuery()
                .Include(x => x.UserMedicalLicenses)
                    .ThenInclude(x => x.MedicalLicense.MedicalLicenseSpecialty.Specialty)
                .Include(x => x.DoctorClinics)
                    .ThenInclude(x => x.Clinic)
                .Include(x => x.DoctorWorkSchedules)
                    .ThenInclude(x => x.WorkSchedule)
                .Include(x => x.DoctorEvents)
                    .ThenInclude(x => x.Event)
                .Include(x => x.DoctorReviews)
                    .ThenInclude(x => x.Review.UserReview.User)
                .Include(x => x.DoctorMedicalInsuranceCompanies)
                    .ThenInclude(x => x.MedicalInsuranceCompany)
                .Include(x => x.Patients)
                    .ThenInclude(x => x.Patient)
                .AsQueryable()
            ;
    }

}