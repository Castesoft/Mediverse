namespace MainService.Core.DTOs;

public class PrescriptionInformationDto
{
    public string ExteriorNumber { get; set; }
    public string InteriorNumber { get; set; }
    public string Street { get; set; }
    public string ZipCode { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Country { get; set; }
    public string Neighborhood { get; set; }
    public string PhotoUrl { get; set; }
    public List<string> Phones { get; set; } = [];
}