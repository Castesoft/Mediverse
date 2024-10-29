namespace MainService.Models.Entities;

public class PrescriptionOrder
{
    public PrescriptionOrder() {}
    public PrescriptionOrder(Order order) => Order = order;
    public PrescriptionOrder(int prescriptionId) => PrescriptionId = prescriptionId;
    public PrescriptionOrder(int prescriptionId, int orderId)
    {
        PrescriptionId = prescriptionId;
        OrderId = orderId;
    }
    
    public int PrescriptionId { get; set; }
    public int OrderId { get; set; }
    public Prescription Prescription { get; set; }
    public Order Order { get; set; }
}