namespace MainService.Models.Entities;

public enum PaymentStatus
{
    AwaitingPayment,
    // Stripe specific
    RequiresPaymentMethod,
    RequiresConfirmation,
    RequiresAction,
    Processing,
    RequiresCapture,
    Succeeded,
    Canceled,
    Refunded,
}