namespace MainService.Models.Entities;

public enum PaymentStatus
{
    RequiresPaymentMethod,
    RequiresConfirmation,
    RequiresAction,
    Processing,
    RequiresCapture,
    Succeeded,
    Canceled,
    Refunded
}