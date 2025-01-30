namespace MainService.Models.Entities;

public class Order : BaseEntity
{
    public decimal? Total { get; set; } // DONE
    public decimal? Subtotal { get; set; } // DONE
    public double? Discount { get; set; } // DONE
    public decimal? Tax { get; set; } // DONE
    public decimal? AmountPaid { get; set; } // DONE
    public decimal? AmountDue { get; set; } // DONE

    public PrescriptionOrder PrescriptionOrder { get; set; } = null!; // DONE
    public PatientOrder PatientOrder { get; set; } = null!; // DONE
    public DoctorOrder DoctorOrder { get; set; } = null!; // DONE
    public OrderDeliveryAddress? OrderDeliveryAddress { get; set; }
    public OrderPickupAddress? OrderPickupAddress { get; set; }
    public List<OrderItem> OrderItems { get; set; } = []; // DONE
    
    public OrderOrderStatus OrderOrderStatus { get; set; } = null!; // DONE
    public OrderDeliveryStatus OrderDeliveryStatus { get; set; } = null!; // DONE
}
