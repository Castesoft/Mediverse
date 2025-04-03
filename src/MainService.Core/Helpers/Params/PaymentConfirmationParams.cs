using System.ComponentModel.DataAnnotations;

namespace MainService.Core.Helpers.Params;

public class PaymentConfirmationParams
{
    [Required(ErrorMessage = "El tipo de pago es requerido.")]
    public int SelectedPaymentMethodTypeId { get; set; }

    public string? ReferenceNumber { get; set; }
    public string? Notes { get; set; }

    /// <summary>
    /// Optional amount for partial payments. If not provided or zero, the full amount will be assumed.
    /// Value must be greater than 0 and less than the total amount due for the event.
    /// </summary>
    public decimal? PartialPaymentAmount { get; set; }
}