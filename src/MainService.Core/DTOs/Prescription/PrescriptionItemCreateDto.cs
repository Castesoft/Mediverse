namespace MainService.Core.DTOs.Prescription;

public class PrescriptionItemCreateDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public string Dosage { get; set; }
    public string Notes { get; set; }
    public string Instructions { get; set; }
}