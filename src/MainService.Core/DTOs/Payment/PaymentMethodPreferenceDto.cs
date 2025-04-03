namespace MainService.Core.DTOs.Payment;

public class PaymentMethodPreferenceDto
{
    public int UserId { get; set; }
    public int PaymentMethodTypeId { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsDefault { get; set; }
    public bool IsActive { get; set; } = true;
    public string? PaymentMethodTypeName { get; set; }
    public string? PaymentMethodTypeIconName { get; set; }
    public string? PaymentMethodTypeIconPrefix { get; set; }
}

public class PaymentMethodPreferenceCreateDto
{
    public int UserId { get; set; }
    public int PaymentMethodTypeId { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsDefault { get; set; }
    public bool IsActive { get; set; } = true;
}

public class PaymentMethodPreferenceUpdateDto
{
    public int? DisplayOrder { get; set; }
    public bool? IsDefault { get; set; }
    public bool? IsActive { get; set; }
}