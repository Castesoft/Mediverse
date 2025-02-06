using AutoMapper;
using MainService.Core.DTOs;
using MainService.Core.DTOs.Products;
using MainService.Core.DTOs.Warehouses;
using MainService.Core.DTOs.Services;
using MainService.Core.DTOs.OrderStatuses;
using MainService.Core.DTOs.DeliveryStatuses;
using MainService.Core.DTOs.MedicalRecord;
using MainService.Core.DTOs.Orders;
using MainService.Core.DTOs.User;
using MainService.Core.Helpers.Resolvers;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Helpers.MappingProfiles
{
    public class MiscMappingProfile : Profile
    {
        public MiscMappingProfile()
        {
            // Map ServiceCreateDto to Service.
            CreateMap<ServiceCreateDto, Service>();

            // Map Document to DocumentDto.
            CreateMap<Document, DocumentDto>();

            // Map ProductCreateDto to Product.
            CreateMap<ProductCreateDto, Product>();

            // Map Product to ProductDto.
            CreateMap<Product, ProductDto>()
                // Use the custom resolver for PhotoUrl.
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom<ProductPhotoUrlResolver>())
                // For the collection of photos, we still build the PhotoDto objects.
                .ForMember(dest => dest.Photos, opt => opt.MapFrom(src =>
                    src.ProductPhotos.Select(x => new PhotoDto
                    {
                        Id = x.PhotoId,
                        Url = (x.Photo != null && x.Photo.Url != null) ? x.Photo.Url.AbsoluteUri : null,
                        PublicId = x.Photo.PublicId,
                        Name = x.Photo.Name,
                        IsMain = x.IsMain,
                        Size = x.Photo.Size ?? 0,
                    })))
                .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Unit))
                .ForMember(dest => dest.Dosage, opt => opt.MapFrom(src => src.Dosage))
                .ForMember(dest => dest.IsInternal, opt => opt.MapFrom(src => src.DoctorProduct == null));

            // Map Warehouse and WarehouseProduct.
            CreateMap<Warehouse, WarehouseDto>();
            CreateMap<WarehouseProduct, WarehouseProductDto>();

            // Map Product to ProductSummaryDto.
            CreateMap<Product, ProductSummaryDto>()
                .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Unit))
                .ForMember(dest => dest.Dosage, opt => opt.MapFrom(src => src.Dosage))
                .ForMember(dest => dest.IsInternal, opt => opt.MapFrom(src => src.DoctorProduct == null))
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom<ProductPhotoUrlResolver>());

            // Map ProductUpdateDto to Product.
            CreateMap<ProductUpdateDto, Product>();

            // Map Product to OptionDto.
            CreateMap<Product, OptionDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Options, opt => opt.MapFrom(src => new Options
                {
                    Description = src.Description,
                    Id = src.Id,
                    // Use the resolver logic to get the product photo URL.
                    PhotoUrl = (new ProductPhotoUrlResolver()).Resolve(src, null, null, null),
                    Price = src.Price,
                    Dosage = src.Dosage,
                    Unit = src.Unit,
                }));

            // Map Service to ServiceDto.
            CreateMap<Service, ServiceDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.GetPhotoUrl()))
            ;

            // Map PaymentMethodType.
            CreateMap<PaymentMethodType, PaymentMethodTypeDto>();
            CreateMap<PaymentMethodType, OptionDto>();

            // Map Specialty.
            CreateMap<Specialty, SpecialtyDto>();
            CreateMap<Specialty, OptionDto>();

            // Map DeliveryStatus and OrderStatus to OptionDto.
            CreateMap<DeliveryStatus, OptionDto>();
            CreateMap<OrderStatus, OptionDto>();

            // Map DeliveryStatus Create/Update.
            CreateMap<DeliveryStatusCreateDto, DeliveryStatus>();
            CreateMap<DeliveryStatusUpdateDto, DeliveryStatus>();

            // Map OrderStatus Create/Update.
            CreateMap<OrderStatusCreateDto, OrderStatus>();
            CreateMap<OrderStatusUpdateDto, OrderStatus>();
            
            // Map OrderHistory to OrderHistoryDto.
            CreateMap<OrderHistory, OrderHistoryDto>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));

            // Map MedicalInsuranceCompany.
            CreateMap<MedicalInsuranceCompany, MedicalInsuranceCompanyDto>();
            CreateMap<UserMedicalInsuranceCompany, UserMedicalInsuranceCompanyDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.MedicalInsuranceCompanyId))
                .ForMember(dest => dest.Document, opt => opt.MapFrom(src => src.Document))
                .ForMember(dest => dest.MedicalInsuranceCompany,
                    opt => opt.MapFrom(src => src.MedicalInsuranceCompany));

            // Map Disease, Substance, ConsumptionLevel, etc.
            CreateMap<Disease, DiseaseDto>();
            CreateMap<Substance, SubstanceDto>();
            CreateMap<ConsumptionLevel, ConsumptionLevelDto>();
            CreateMap<Occupation, OccupationDto>();
            CreateMap<MaritalStatus, MaritalStatusDto>();
            CreateMap<EducationLevel, EducationLevelDto>();
            CreateMap<ColorBlindness, ColorBlindnessDto>();
            CreateMap<RelativeType, RelativeTypeDto>();

            CreateMap<Disease, OptionDto>();
            CreateMap<Substance, OptionDto>();
            CreateMap<ConsumptionLevel, OptionDto>();
            CreateMap<Occupation, OptionDto>();
            CreateMap<MaritalStatus, OptionDto>();
            CreateMap<EducationLevel, OptionDto>();
            CreateMap<ColorBlindness, OptionDto>();
            CreateMap<RelativeType, OptionDto>();

            // Map Service to OptionDto.
            CreateMap<Service, OptionDto>()
                .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Options, opt => opt.MapFrom(src => new Options { Price = src.Price }));

            // Map MedicalInsuranceCompany to OptionDto.
            CreateMap<MedicalInsuranceCompany, OptionDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Options,
                    opt => opt.MapFrom(src => new Options { PhotoUrl = src.GetPhotoUrl() }));
        }
    }
}