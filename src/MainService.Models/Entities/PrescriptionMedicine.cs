namespace MainService.Models.Entities
{
    public class PrescriptionMedicine : BaseEntity
    {
        public int PrescriptionId { get; set; }
        public int MedicineId { get; set; }
        public int Quantity { get; set; }

        // Navigation Properties
        public Prescription Prescription { get; set; }
        public Product Medicine { get; set; }
    }
}