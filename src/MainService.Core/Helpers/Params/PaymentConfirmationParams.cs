using System.ComponentModel.DataAnnotations;
using MainService.Models.Enums;

namespace MainService.Core.Helpers.Params;

public class PaymentConfirmationParams
{
    [Required(ErrorMessage = "El tipo de pago es requerido.")]
    public int SelectedPaymentMethodTypeId { get; set; }

    public string? ReferenceNumber { get; set; }
    public string? Notes { get; set; }
}