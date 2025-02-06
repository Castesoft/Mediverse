using AutoMapper;
using MainService.Core.DTOs.WarehouseProduct;
using MainService.Core.DTOs.Warehouses;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Helpers.MappingProfiles;

public class WarehouseProfile : Profile
{
    public WarehouseProfile()
    {
        CreateMap<Warehouse, WarehouseUpdateDto>().ReverseMap();
        CreateMap<WarehouseProduct, WarehouseProductUpdateDto>().ReverseMap();
        CreateMap<Warehouse, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Description));
    }
}