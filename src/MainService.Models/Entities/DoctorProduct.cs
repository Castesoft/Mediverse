namespace MainService.Models.Entities;
public class DoctorProduct
{
    public int DoctorId { get; set; }
    public AppUser Doctor { get; set; } = null!;
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    public DoctorProduct() {}
    
    public DoctorProduct(AppUser doctor, Product product)
    {
        Doctor = doctor;
        Product = product;
    }

    public DoctorProduct(Product product) => Product = product;

    public DoctorProduct(int doctorId, Product product)
    {
        DoctorId = doctorId;
        Product = new(product.Name, product.Description);
    }
}