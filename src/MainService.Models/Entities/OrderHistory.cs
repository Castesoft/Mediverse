namespace MainService.Models.Entities;

public class OrderHistory : BaseEntity
{
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    // Who initiated the change
    public int? UserId { get; set; }
    public AppUser? User { get; set; }

    // What changed
    public OrderChangeType ChangeType { get; set; }
    public OrderProperty Property { get; set; }

    // Values
    public string? OldValue { get; set; } // Serialized previous state
    public string? NewValue { get; set; } // Serialized new state
}

public enum OrderChangeType
{
    Created,
    Updated,
    StatusChanged,
    DeliveryStatusChanged,
    PaymentProcessed,
    ItemsModified,
    AddressUpdated,
    Cancelled,
    NoteAdded,
    PrescriptionLinked
}

public enum OrderProperty
{
    OrderStatus,
    DeliveryStatus,
    PaymentStatus,
    Items,
    Address,
    Note,
    Prescription
}