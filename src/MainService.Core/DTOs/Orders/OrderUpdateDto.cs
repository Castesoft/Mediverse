using System.ComponentModel.DataAnnotations;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.Orders;

public class OrderUpdateDto
{
    [Required(ErrorMessage = "El estado de la orden es requerido.")]
    public OptionDto? Status { get; set; }
    [Required(ErrorMessage = "El estado de la entrega es requerido.")]
    public OptionDto? DeliveryStatus { get; set; }
}