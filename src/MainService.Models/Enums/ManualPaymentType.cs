namespace MainService.Models.Enums;

public enum ManualPaymentType
{
    Unknown = 0,
    Cash = 1,
    BankTransfer = 2,
    CreditCardTerminal = 3,
    DebitCardTerminal = 4,
    Other = 99
}