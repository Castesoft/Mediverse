namespace MainService.Core.DTOs.Addresses;
public class BaseAddressDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Street { get; set; }
    public string InteriorNumber { get; set; }
    public string ExteriorNumber { get; set; }
    public string Neighborhood { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Country { get; set; }
    public string Zipcode { get; set; }
    public DateTime CreatedAt { get; set; }
}