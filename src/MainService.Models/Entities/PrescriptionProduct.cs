namespace MainService.Models.Entities
{
    public class PrescriptionProduct : BaseEntity
    {
        public PrescriptionProduct()
        {
        }


        public int PrescriptionId { get; set; } public Prescription Prescription { get; set; } = null!;
        public int? ProductId { get; set; } public Product Product { get; set; } = null!;

        public int? Quantity { get; set; }
        public double? Dosage { get; set; }
        public string? Instructions { get; set; }
        public string? Unit { get; set; }
        public string? Manufacturer { get; set; }
        public string? LotNumber { get; set; }
        public decimal? Price { get; set; }
        public double? Discount { get; set; }
        public string? PhotoUrl { get; set; }
    }
}