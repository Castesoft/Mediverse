using MainService.Core.DTOs.Addresses;
using MainService.Core.DTOs.Events;
using MainService.Core.DTOs.User;

namespace MainService.Core.DTOs.Prescription;

public class PrescriptionDto
{
    public int Id { get; set; }
    public int ExchangeAmount { get; set; }
    public string? Notes { get; set; }
    public DateTime? Date { get; set; }
    public DateTime CreatedAt { get; set; }
    public AddressDto? Clinic { get; set; }
    public BaseUserDto? Patient { get; set; }
    public BaseUserDto? Doctor { get; set; }
    public EventSummaryDto? Event { get; set; }
    public List<PrescriptionItemDto> Items { get; set; } = [];
    public string? LogoUrl { get; set; }
    public int OrderId { get; set; }
}