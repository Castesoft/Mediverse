using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace MainService.Core.DTOs.Products;

public class ProductCreateDto
{
    [Required(ErrorMessage = "El nombre es requerido.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres.")]
    public string? Name { get; set; }
    
    [Required(ErrorMessage = "La descripción es requerida.")]
    [StringLength(500, MinimumLength = 3, ErrorMessage = "La descripción debe tener entre 3 y 500 caracteres.")]
    public string? Description { get; set; }
    
    [Required(ErrorMessage = "El precio es requerido.")]
    [Range(1, 1000000, ErrorMessage = "El precio debe estar entre 1 y 1000000.")]
    public decimal Price { get; set; }
    
    [Required(ErrorMessage = "El número de lote es requerido.")]
    public string? LotNumber { get; set; }
    
    [Required(ErrorMessage = "La unidad es requerida.")]
    public string? Unit { get; set; }
    
    [Required(ErrorMessage = "La dosis es requerida.")]
    [Range(0, 100000, ErrorMessage = "La dosis debe estar entre 0 y 100000.")]
    public double? Dosage { get; set; }
    
    [Required(ErrorMessage = "El fabricante es requerido.")]
    public string? Manufacturer { get; set; }
    
    public int? Quantity { get; set; }
    
    public bool? IsInternal { get; set; }
    public bool? IsEnabled { get; set; }
    public bool? IsVisible { get; set; }
    
    [Range(0, 100, ErrorMessage = "El descuento debe estar entre 0 y 100.")]
    public double? Discount { get; set; }
    public int MainImageIndex { get; set; }
    public ICollection<IFormFile>? Files { get; set; }
    public string? SKU { get; set; }
    public string? Barcode { get; set; }
    public string? Category { get; set; }
    public decimal? CostPrice { get; set; }
}