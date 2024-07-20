namespace MainService.Models.Entities
{
    public class PrescriptionItem : BaseEntity
    {
        public int PrescriptionId { get; set; }
        public int? ItemId { get; set; }
        public int Quantity { get; set; }
        public string Dosage { get; set; }
        public string Instructions { get; set; }
        public string Notes { get; set; }
        public string Unit { get; set; }

        // Navigation Properties
        public Prescription Prescription { get; set; }
        public Product Item { get; set; }
    }
}