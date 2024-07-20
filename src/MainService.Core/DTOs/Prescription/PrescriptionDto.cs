using MainService.Core.DTOs.Addresses;
using MainService.Core.DTOs.Events;
using MainService.Core.DTOs.Products;
using MainService.Core.DTOs.User;

namespace MainService.Core.DTOs.Prescription;

public class PrescriptionDto
{
    public int Id { get; set; }
    public int ExchangeAmount { get; set; }
    public AddressDto Clinic { get; set; }
    public UserDto Patient { get; set; }
    public UserDto Doctor { get; set; }
    public EventDto Event { get; set; }
    public List<PrescriptionItemDto> Items { get; set; } = [];
}

public class PrescriptionItemDto
{
    public int? ItemId { get; set; }
    public int Quantity { get; set; }
    public string Dosage { get; set; }
    public string Instructions { get; set; }
    public string Notes { get; set; }
    public string Unit { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public double Discount { get; set; }
    public string Manufacturer { get; set; }
    public string LotNumber { get; set; }
    public DateTime CreatedAt { get; set; }
}