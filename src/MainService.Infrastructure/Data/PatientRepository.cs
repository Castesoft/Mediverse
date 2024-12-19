using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Patients;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;
public class PatientRepository(DataContext context, IMapper mapper) : IPatientRepository
{
    public async Task<bool> ExistsAsync(int id, int doctorId) =>
        await context.Users
            .Include(x => x.Doctors)
            .AnyAsync(x => x.Id == id && x.Doctors.Any(x => x.DoctorId == doctorId))
        ;

    public async Task<List<PatientDto>> GetAllDtoAsync(PatientParams param)
    {
        // TODO: Implement filtering

        var query = context.Users
            .AsNoTracking()
            .ProjectTo<PatientDto>(mapper.ConfigurationProvider);

        return await query.ToListAsync();
    }

    public async Task<PatientDto?> GetDtoByIdAsync(int id) =>
        await context.Users
            .AsNoTracking()
            .ProjectTo<PatientDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<PagedList<PatientDto>> GetPagedListAsync(PatientParams param, ClaimsPrincipal user)
    {
        IQueryable<AppUser> query = context.Users
            .Include(x => x.Patients)
            .Include(x => x.Doctors)
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Include(x => x.DoctorNurses)
            .Include(x => x.UserAddresses)
            .ThenInclude(x => x.Address)
            .AsQueryable()
        ;

        IEnumerable<string> roles = user.GetRoles();
        int userId = user.GetUserId();

        query = query.Where(x => x.Id != userId);

        switch (param.Role)
        {
            case Roles.Admin:
                // if (!roles.Contains("Admin")) return null;
                break;
            case Roles.Doctor:
                // if (!roles.Contains("Admin") || !roles.Contains("Patient")) return null;
                break;
            case Roles.Patient:
                // if (!roles.Contains("Doctor") && !roles.Contains("Nurse")) return null;
                if (roles.Contains("Doctor"))
                {
                    query = query.Where(x => x.UserRoles.Any(x => x.Role.Name == "Patient"));
                    query = query.Where(x => x.Doctors.Any(x => x.DoctorId == userId));
                }

                break;
            case Roles.Nurse:
                // if (!roles.Contains("Doctor")) return null;
                if (roles.Contains("Doctor"))
                {
                    int doctorId = userId;

                    query = query.Where(x => x.UserRoles.Any(x => x.Role.Name == "Nurse"));
                    query = query.Where(x => x.NursesDoctor.Any(x => x.DoctorId == doctorId));
                }

                break;
            case Roles.Staff:
                // if (!roles.Contains("Admin")) return null;
                break;
            default:
                break;
        }

        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                "id" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Id) : query.OrderByDescending(x => x.Id),
                "email" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Email) : query.OrderByDescending(x => x.Email),
                "username" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.UserName) : query.OrderByDescending(x => x.UserName),
                "firstname" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.FirstName) : query.OrderByDescending(x => x.FirstName),
                "lastname" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.LastName) : query.OrderByDescending(x => x.LastName),
                "sex" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Sex) : query.OrderByDescending(x => x.Sex),
                "dateofbirth" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.DateOfBirth) : query.OrderByDescending(x => x.DateOfBirth),
                "lastactive" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.LastActive) : query.OrderByDescending(x => x.LastActive),
                "phonenumbercountrycode" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.PhoneNumberCountryCode) : query.OrderByDescending(x => x.PhoneNumberCountryCode),
                "phonenumber" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.PhoneNumber) : query.OrderByDescending(x => x.PhoneNumber),
                "emailverificationexpirytime" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.EmailVerificationExpiryTime) : query.OrderByDescending(x => x.EmailVerificationExpiryTime),
                "phonenumberverificationexpirytime" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.PhoneNumberVerificationExpiryTime) : query.OrderByDescending(x => x.PhoneNumberVerificationExpiryTime),
                "stripecustomerid" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.StripeCustomerId) : query.OrderByDescending(x => x.StripeCustomerId),
                "recommendedby" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.RecommendedBy) : query.OrderByDescending(x => x.RecommendedBy),
                "rfc" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.RFC) : query.OrderByDescending(x => x.RFC),
                "curp" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.CURP) : query.OrderByDescending(x => x.CURP),
                "legalname" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.LegalName) : query.OrderByDescending(x => x.LegalName),
                "education" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Education) : query.OrderByDescending(x => x.Education),
                "post" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Post) : query.OrderByDescending(x => x.Post),
                "stripeconnectaccountid" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.StripeConnectAccountId) : query.OrderByDescending(x => x.StripeConnectAccountId),
                "requireanticipatedcardpayments" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.RequireAnticipatedCardPayments) : query.OrderByDescending(x => x.RequireAnticipatedCardPayments),
                "createdat" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.CreatedAt) : query.OrderByDescending(x => x.CreatedAt),
                _ => query.OrderByDescending(x => x.CreatedAt),
            };
        } else {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        if (!string.IsNullOrEmpty(param.Search))
        {
            string term = param.Search.ToLower();
            
            query = query.Where(
                x =>
                    !string.IsNullOrEmpty(x.FirstName) && x.FirstName.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.LastName) && x.LastName.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Sex) && x.Sex.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.PhoneNumberCountryCode) && x.PhoneNumberCountryCode.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.RecommendedBy) && x.RecommendedBy.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.RFC) && x.RFC.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.CURP) && x.CURP.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.CommercialName) && x.CommercialName.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.LegalName) && x.LegalName.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Education) && x.Education.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Post) && x.Post.ToLower().Contains(term)
            );
        }

        return await PagedList<PatientDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<PatientDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync(PatientParams param)
    {
        IQueryable<AppUser> query = context.Users
            .Include(x => x.Patients)
            .Include(x => x.Doctors)
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Include(x => x.DoctorNurses)
            .Include(x => x.UserAddresses)
            .ThenInclude(x => x.Address)
            .AsQueryable()
        ;

        if (param.DoctorId.HasValue) {
            query = query.Where(x => x.Doctors.Any(x => x.DoctorId == param.DoctorId.Value));
        }

        return await query
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync()
        ;
    }
}