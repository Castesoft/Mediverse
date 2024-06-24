namespace MainService.Models.Entities
{
    public class PrescriptionMedicine : BaseEntity
    {
        public int PrescriptionId { get; set; }
        public int? MedicineId { get; set; }
        public int Quantity { get; set; }
        public string Dosage { get; set; }
        public string Instructions { get; set; }
        public string Unit { get; set; }

        // Navigation Properties
        public Prescription Prescription { get; set; }
        public Product Medicine { get; set; }
    }
}