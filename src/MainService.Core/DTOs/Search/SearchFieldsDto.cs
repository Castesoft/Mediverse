using MainService.Core.DTOs.User;

namespace MainService.Core.DTOs.Search
{
    public class SearchFieldsDto
    {
        public int SpecialistsQuantity { get; set; }
        public List<SpecialtyDto> Specialties { get; set; }
    }
}