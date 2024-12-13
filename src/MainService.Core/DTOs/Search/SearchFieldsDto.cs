using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.Search
{
    public class SearchFieldsDto
    {
        public int SpecialistsQuantity { get; set; }
        public List<OptionDto> Specialties { get; set; } = [];
    }
}