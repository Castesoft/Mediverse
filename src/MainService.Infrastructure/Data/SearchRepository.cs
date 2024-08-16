using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Search;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Core.Interfaces.Services;
using MainService.Models;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data
{
    public class SearchRepository(DataContext context, IMapper mapper, IGoogleService googleService) : ISearchRepository
    {
        public async Task<PagedList<DoctorSearchResultDto>> GetPagedListAsync(SearchParams param)
        {
            var query = context.Users
                .Include(x => x.UserMedicalLicenses)
                    .ThenInclude(x => x.MedicalLicense)
                    .ThenInclude(x => x.MedicalLicenseSpecialty)
                    .ThenInclude(x => x.Specialty)
                .Include(x => x.UserAddresses)
                    .ThenInclude(x => x.Address)
                .AsQueryable();

            query = query.Where(x => x.UserMedicalLicenses.Count != 0);

            if (!string.IsNullOrEmpty(param.Specialty))
            {
                query = query.Where(x => x.UserMedicalLicenses.Any(y => y.MedicalLicense.MedicalLicenseSpecialty.Specialty.Name == param.Specialty));
            }

            if (!string.IsNullOrEmpty(param.Location))
            {
                var location = await googleService.GetLocationByPlaceIdAsync(param.Location);
                double latitude = location.Geometry.Location.Lat;
                param.Latitude = latitude;
                double longitude = location.Geometry.Location.Lng;
                param.Longitude = longitude;
                double radiusInKm = 50.0;

                query = query.Where(x => x.UserAddresses.Any(a => 
                    6371 * Math.Acos(
                        Math.Cos(Math.PI * latitude / 180) * Math.Cos(Math.PI * (double)a.Address.Latitude / 180) *
                        Math.Cos(Math.PI * (double)a.Address.Longitude / 180 - Math.PI * longitude / 180) +
                        Math.Sin(Math.PI * latitude / 180) * Math.Sin(Math.PI * (double)a.Address.Latitude / 180)
                    ) <= radiusInKm
                ));
            }

            return await PagedList<DoctorSearchResultDto>.CreateAsync(
                query.AsNoTracking().ProjectTo<DoctorSearchResultDto>(mapper.ConfigurationProvider),
                param.PageNumber, param.PageSize);
        }
    }
}