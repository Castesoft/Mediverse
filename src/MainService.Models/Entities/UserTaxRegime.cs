namespace MainService.Models.Entities;
public class UserTaxRegime
{
    public int UserId { get; set; }
    public int TaxRegimeId { get; set; }
    public AppUser User { get; set; } = null!;
    public TaxRegime TaxRegime { get; set; } = null!;

    public bool IsMain { get; set; }
}