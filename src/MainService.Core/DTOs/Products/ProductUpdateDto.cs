using Microsoft.AspNetCore.Http;

namespace MainService.Core.DTOs.Products
{
    public class ProductUpdateDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public string? LotNumber { get; set; }
        public string? Unit { get; set; }
        public double? Dosage { get; set; }
        public string? Manufacturer { get; set; }
        public int MainImageIndex { get; set; }
        public int? Quantity { get; set; }
        public bool? IsInternal { get; set; }
        public bool? IsEnabled { get; set; }
        public bool? IsVisible { get; set; }
        public double? Discount { get; set; }
        public ICollection<IFormFile>? Files { get; set; }
        public List<string>? RemovedImageIds { get; set; }
    }
}