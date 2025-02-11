using AutoMapper;
using Google.Apis.Auth;
using MainService.Core.DTOs;
using MainService.Core.DTOs.Nurses;
using MainService.Core.DTOs.Patients;
using MainService.Core.DTOs.Search;
using MainService.Core.DTOs.User;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Resolvers;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Helpers.MappingProfiles;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        // Map AppUser to OptionDto.
        CreateMap<AppUser, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Options, opt => opt.MapFrom(src => new Options
            {
                Id = src.Id,
                PhotoUrl = (src.UserPhoto != null && src.UserPhoto.Photo != null && src.UserPhoto.Photo.Url != null)
                    ? src.UserPhoto.Photo.Url.AbsoluteUri
                    : null,
                Sex = src.Sex
            }));

        // Map AppUser to DoctorSearchResultDto.
        CreateMap<AppUser, DoctorSearchResultDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.GetPhotoUrl()))
            .ForMember(dest => dest.Specialties, opt => opt.MapFrom(src =>
                src.UserMedicalLicenses.Select(x => x.MedicalLicense.MedicalLicenseSpecialty.Specialty)))
            .ForMember(dest => dest.Addresses, opt => opt.MapFrom(src => src.DoctorClinics.Select(x => x.Clinic)))
            .ForMember(dest => dest.PaymentMethods,
                opt => opt.MapFrom(src => src.DoctorPaymentMethodTypes.Select(x => x.PaymentMethodType)))
            .ForMember(dest => dest.Services, opt => opt.MapFrom(src => src.DoctorServices.Select(x => x.Service)))
            .ForMember(dest => dest.MedicalInsuranceCompanies,
                opt => opt.MapFrom(src => src.UserMedicalInsuranceCompanies.Select(x => x.MedicalInsuranceCompany)))
            .ForMember(dest => dest.WorkSchedules,
                opt => opt.MapFrom(src => src.DoctorWorkSchedules.Select(x => x.WorkSchedule)))
            .ForMember(dest => dest.DoctorEvents, opt => opt.MapFrom(src => src.DoctorEvents.Select(x => x.Event)))
            .ForMember(dest => dest.Reviews, opt => opt.MapFrom(src => src.DoctorReviews.Select(x => x.Review)))
            .ForMember(dest => dest.MedicalInsuranceCompanies,
                opt => opt.MapFrom(
                    src => src.DoctorMedicalInsuranceCompanies.Select(x => x.MedicalInsuranceCompany)));

        // Map Review to DoctorReviewDto.
        CreateMap<Review, DoctorReviewDto>()
            .ForMember(dest => dest.UserName,
                opt => opt.MapFrom(src => src.UserReview.User.FirstName + " " + src.UserReview.User.LastName))
            .ForMember(dest => dest.UserPhotoUrl, opt => opt.MapFrom(src =>
                (src.UserReview.User.UserPhoto != null && src.UserReview.User.UserPhoto.Photo != null &&
                 src.UserReview.User.UserPhoto.Photo.Url != null)
                    ? src.UserReview.User.UserPhoto.Photo.Url.AbsoluteUri
                    : null))
            .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Content))
            .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));

        // Map PatientCreateDto to AppUser.
        CreateMap<PatientCreateDto, AppUser>()
            .ForMember(dest => dest.DateOfBirth, opt => opt.Ignore())
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Sex, opt => opt.MapFrom(src => src.Sex != null ? null : src.Sex!.Name));

        // Map AppUser to AccountDto.
        CreateMap<AppUser, AccountDto>()
            .ForMember(dest => dest.Sex, opt => opt.MapFrom(src => src.GetSex()))
            .ForMember(dest => dest.MedicalLicenses, opt => opt.MapFrom(src => src.UserMedicalLicenses))
            .ForMember(dest => dest.IsEmailVerified, opt => opt.MapFrom(src => src.EmailConfirmed))
            .ForMember(dest => dest.IsPhoneNumberVerified, opt => opt.MapFrom(src => src.PhoneNumberConfirmed))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom<PhotoUrlResolver>())
            .ForMember(dest => dest.BannerUrl, opt => opt.MapFrom<BannerUrlResolver>())
            .ForMember(dest => dest.MainSpecialty, opt => opt.MapFrom(src =>
                (src.UserMedicalLicenses.FirstOrDefault(x => x.IsMain) != null &&
                 src.UserMedicalLicenses.FirstOrDefault(x => x.IsMain).MedicalLicense != null &&
                 src.UserMedicalLicenses.FirstOrDefault(x => x.IsMain).MedicalLicense.MedicalLicenseSpecialty !=
                 null)
                    ? src.UserMedicalLicenses.FirstOrDefault(x => x.IsMain).MedicalLicense.MedicalLicenseSpecialty
                        .Specialty.Name
                    : string.Empty))
            .ForMember(dest => dest.SpecialtyId, opt => opt.MapFrom(src =>
                (src.UserMedicalLicenses.FirstOrDefault(x => x.IsMain) != null &&
                 src.UserMedicalLicenses.FirstOrDefault(x => x.IsMain).MedicalLicense != null &&
                 src.UserMedicalLicenses.FirstOrDefault(x => x.IsMain).MedicalLicense.MedicalLicenseSpecialty !=
                 null)
                    ? src.UserMedicalLicenses.FirstOrDefault(x => x.IsMain).MedicalLicense.MedicalLicenseSpecialty
                        .Specialty.Id
                    : 0))
            .ForMember(dest => dest.PaymentMethodTypes,
                opt => opt.MapFrom(src => src.DoctorPaymentMethodTypes.Select(x => x.PaymentMethodType)))
            .ForMember(dest => dest.State, opt => opt.MapFrom(src =>
                (src.UserAddresses.FirstOrDefault(x => x.IsMain) != null)
                    ? src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.State
                    : string.Empty))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src =>
                (src.UserAddresses.FirstOrDefault(x => x.IsMain) != null)
                    ? src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.City
                    : string.Empty))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src =>
                (src.UserAddresses.FirstOrDefault(x => x.IsMain) != null)
                    ? src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.Street
                    : string.Empty))
            .ForMember(dest => dest.WorkSchedules,
                opt => opt.MapFrom(src => src.DoctorWorkSchedules.Select(x => x.WorkSchedule)))
            .ForMember(dest => dest.WorkScheduleSettings,
                opt => opt.MapFrom(src => src.DoctorWorkScheduleSettings.WorkScheduleSettings))
            .ForMember(dest => dest.DoctorClinics,
                opt => opt.MapFrom(src => src.DoctorClinics.Select(x => x.Clinic)))
            .ForMember(dest => dest.SharedDoctors,
                opt => opt.MapFrom(src => src.Doctors.Select(x => x.Doctor)))
            .ForMember(dest => dest.MedicalInsuranceCompanies,
                opt => opt.MapFrom(src => src.UserMedicalInsuranceCompanies))
            .ForMember(dest => dest.Specialty, opt => opt.MapFrom(src => src.DoctorSpecialty.Specialty))
            .ForMember(dest => dest.DoctorInsuranceCompanies,
                opt => opt.MapFrom(
                    src => src.DoctorMedicalInsuranceCompanies.Select(x => x.MedicalInsuranceCompany)));

        // Map Google JSON web signature payload to AppUser.
        CreateMap<GoogleJsonWebSignature.Payload, AppUser>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.GivenName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.FamilyName));

        // Map AppUser to BillingDetailsDto.
        CreateMap<AppUser, BillingDetailsDto>()
            .ForMember(dest => dest.UserAddresses,
                opt => opt.MapFrom(src => src.UserAddresses.Select(x => x.Address)))
            .ForMember(dest => dest.UserPaymentMethods,
                opt => opt.MapFrom(src => src.PaymentMethods));

        // Map AppUser to UserSummaryDto.
        CreateMap<AppUser, UserSummaryDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.Age,
                opt => opt.MapFrom(src => src.DateOfBirth.HasValue ? src.DateOfBirth.Value.CalculateAge() : 0))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom<PhotoUrlResolver>());

        // Map UserAddress to UserAddressDto.
        CreateMap<UserAddress, UserAddressDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Address.Id))
            .ForMember(dest => dest.IsMain, opt => opt.MapFrom(src => src.IsMain))
            .ForMember(dest => dest.IsBilling, opt => opt.MapFrom(src => src.IsBilling))
            .ForMember(dest => dest.Street, opt => opt.MapFrom(src => src.Address.Street))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.Address.City))
            .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.Address.State))
            .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Address.Country))
            .ForMember(dest => dest.Zipcode, opt => opt.MapFrom(src => src.Address.Zipcode))
            .ForMember(dest => dest.Neighborhood, opt => opt.MapFrom(src => src.Address.Neighborhood))
            .ForMember(dest => dest.ExteriorNumber, opt => opt.MapFrom(src => src.Address.ExteriorNumber))
            .ForMember(dest => dest.InteriorNumber, opt => opt.MapFrom(src => src.Address.InteriorNumber));

        // Registration mappings.
        CreateMap<RegisterDto, AppUser>()
            .ForMember(dest => dest.Sex, opt => opt.MapFrom(src => src.Gender));
        CreateMap<DoctorRegisterDto, AppUser>()
            .ForMember(dest => dest.Sex, opt => opt.MapFrom(src => src.Gender))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Phone));

        // Map Photo to PhotoDto.
        CreateMap<Photo, PhotoDto>()
            .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.Url.AbsoluteUri))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));

        // Account details update.
        CreateMap<AccountDetailsUpdateDto, AppUser>();

        // Map AppRole and AppPermission.
        CreateMap<AppRole, RoleDto>();
        CreateMap<AppRole, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Name));
        CreateMap<AppPermission, PermissionDto>();

        // Map DoctorPatient.
        CreateMap<DoctorPatient, DoctorPatientDto>();

        // Map AppUser to NurseDto.
        CreateMap<AppUser, NurseDto>()
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom<PhotoUrlResolver>())
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.Age,
                opt => opt.MapFrom(src => src.DateOfBirth.HasValue ? src.DateOfBirth.Value.CalculateAge() : 0))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth));

        // Map AppUser to PatientDto.
        CreateMap<AppUser, PatientDto>()
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom<PhotoUrlResolver>())
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.HasAccount, opt => opt.MapFrom(src => src.Doctors.Count > 0))
            .ForMember(dest => dest.Age,
                opt => opt.MapFrom(src => src.DateOfBirth.HasValue ? src.DateOfBirth.Value.CalculateAge() : 0))
            .ForMember(dest => dest.DoctorEvents, opt => opt.MapFrom(src => src.PatientEvents.Select(x => x.Event)))
            .ForMember(dest => dest.EventsCount, opt => opt.MapFrom(src => src.PatientEvents.Count))
            .ForMember(dest => dest.PrescriptionsCount, opt => opt.MapFrom(src => src.PatientPrescriptions.Count))
            .ForMember(dest => dest.OrdersCount, opt => opt.MapFrom(src => src.PatientOrders.Count));

        // Map AppUser to UserDto.
        CreateMap<AppUser, UserDto>()
            .ForMember(dest => dest.Street, opt => opt.MapFrom(src =>
                src.UserAddresses.FirstOrDefault(x => x.IsMain) != null
                    ? src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.Street
                    : string.Empty))
            .ForMember(dest => dest.InteriorNumber, opt => opt.MapFrom(src =>
                src.UserAddresses.FirstOrDefault(x => x.IsMain) != null
                    ? src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.InteriorNumber
                    : string.Empty))
            .ForMember(dest => dest.ExteriorNumber, opt => opt.MapFrom(src =>
                src.UserAddresses.FirstOrDefault(x => x.IsMain) != null
                    ? src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.ExteriorNumber
                    : string.Empty))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src =>
                src.UserAddresses.FirstOrDefault(x => x.IsMain) != null
                    ? src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.City
                    : string.Empty))
            .ForMember(dest => dest.State, opt => opt.MapFrom(src =>
                src.UserAddresses.FirstOrDefault(x => x.IsMain) != null
                    ? src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.State
                    : string.Empty))
            .ForMember(dest => dest.Country, opt => opt.MapFrom(src =>
                src.UserAddresses.FirstOrDefault(x => x.IsMain) != null
                    ? src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.Country
                    : string.Empty))
            .ForMember(dest => dest.Zipcode, opt => opt.MapFrom(src =>
                src.UserAddresses.FirstOrDefault(x => x.IsMain) != null
                    ? src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.Zipcode
                    : string.Empty))
            .ForMember(dest => dest.MedicalInsuranceCompanies,
                opt => opt.MapFrom(src => src.UserMedicalInsuranceCompanies))
            .ForMember(dest => dest.IsEmailVerified, opt => opt.MapFrom(src => src.EmailConfirmed))
            .ForMember(dest => dest.IsPhoneNumberVerified, opt => opt.MapFrom(src => src.PhoneNumberConfirmed))
            .ForMember(dest => dest.HasAccount, opt => opt.MapFrom(src => src.Doctors.Any()))
            .ForMember(dest => dest.Age,
                opt => opt.MapFrom(src => src.DateOfBirth.HasValue ? src.DateOfBirth.Value.CalculateAge() : 0))
            .ForMember(dest => dest.Permissions,
                opt => opt.MapFrom(src => src.UserPermissions.Select(x => x.Permission)))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src =>
                src.UserPhoto != null &&
                src.UserPhoto.Photo != null &&
                src.UserPhoto.Photo.Url != null
                    ? src.UserPhoto.Photo.Url.AbsoluteUri
                    : null))
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles.Select(x => x.Role)))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName));

        // Map AppUser to DoctorDto.
        CreateMap<AppUser, DoctorDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.Specialty,
                opt => opt.MapFrom(src =>
                    src.UserMedicalLicenses.FirstOrDefault().MedicalLicense.MedicalLicenseSpecialty.Specialty
                        .Name))
        ;

        CreateMap<WorkSchedule, WorkScheduleDto>();
        CreateMap<WorkScheduleSettings, WorkScheduleSettingsDto>();

        CreateMap<AppUser, BillingDetailsDto>()
            .ForMember(dest => dest.UserAddresses, opt => opt.MapFrom(src => src.UserAddresses.Select(x => x.Address)))
            .ForMember(dest => dest.UserPaymentMethods, opt => opt.MapFrom(src => src.PaymentMethods));
        ;

        CreateMap<Address, UserAddressDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.UserAddress.Address.Id))
            .ForMember(dest => dest.IsMain, opt => opt.MapFrom(src => src.UserAddress.IsMain))
            .ForMember(dest => dest.IsBilling, opt => opt.MapFrom(src => src.UserAddress.IsBilling))
        ;

        CreateMap<UserMedicalLicense, UserMedicalLicenseDto>()
            .ForMember(dest => dest.SpecialtyId, opt => opt.MapFrom(src => src.MedicalLicense.MedicalLicenseSpecialty.SpecialtyId))
            .ForMember(dest => dest.SpecialtyName, opt => opt.MapFrom(src => src.MedicalLicense.MedicalLicenseSpecialty.Specialty.Name))
            .ForMember(dest => dest.Document, opt => opt.MapFrom(src => src.MedicalLicense.MedicalLicenseDocument.Document))
            .ForMember(dest => dest.SpecialtyLicense, opt => opt.MapFrom(src => src.MedicalLicense.SpecialtyLicense))
            .ForMember(dest => dest.LicenseNumber, opt => opt.MapFrom(src => src.MedicalLicense.LicenseNumber))
            .ForMember(dest => dest.IsMain, opt => opt.MapFrom(src => src.IsMain))
        ;

    }
}