namespace MainService.Models.Entities;
public class TaxRegime : BaseEntity
{
    public int Code { get; set; }

    public UserTaxRegime UserTaxRegime { get; set; }
}