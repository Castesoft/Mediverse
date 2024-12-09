namespace MainService.Models.Entities;
public class TaxRegime : BaseEntity
{
    public required int Code { get; set; }

    public UserTaxRegime UserTaxRegime { get; set; } = null!;
}