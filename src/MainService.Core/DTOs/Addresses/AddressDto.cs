namespace MainService.Core.DTOs.Addresses;
public class AddressDto : BaseAddressDto
{
    public string Description { get; set; }

    public int NursesCount { get; set; }
    public bool IsMain { get; set; }
}