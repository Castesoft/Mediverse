namespace MainService.Models.Entities;
public class UserTaxRegime
{
    public int UserId { get; set; }
    public int TaxRegimeId { get; set; }
    public AppUser User { get; set; }
    public TaxRegime TaxRegime { get; set; }

    public bool IsMain { get; set; }
}