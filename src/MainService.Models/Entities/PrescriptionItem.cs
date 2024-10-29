namespace MainService.Models.Entities
{
    public class PrescriptionItem : BaseEntity
    {
        public int PrescriptionId { get; set; } public Prescription Prescription { get; set; }
        public int? ItemId { get; set; } public Product Item { get; set; }

        public int Quantity { get; set; }
        public double Dosage { get; set; }
        public string Instructions { get; set; }
        public string Unit { get; set; }
    }
}