namespace MainService.Models.Entities;

public class PatientOrder
{
    public PatientOrder() {}
    public PatientOrder(int patientId) => PatientId = patientId;
    public PatientOrder(int patientId, int orderId)
    {
        PatientId = patientId;
        OrderId = orderId;
    }
    
    public int PatientId { get; set; }
    public int OrderId { get; set; }
    public AppUser Patient { get; set; }
    public Order Order { get; set; }
}