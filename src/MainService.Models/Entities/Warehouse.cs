namespace MainService.Models.Entities;

public class Warehouse : BaseEntity
{
    public int AddressId { get; set; }
    public Address Address { get; set; } = null!;

    public List<WarehouseProduct> WarehouseProducts { get; set; } = [];
}