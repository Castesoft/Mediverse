using MainService.Models.Entities;

namespace MainService.Core.DTOs.User;
public class AccountDto
{
    public int Id { get; set; }
    public string Email { get; set; }
    public bool IsEmailVerified { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName { get; set; }
    public string Sex { get; set; }
    public string Username { get; set; }
    public string PhoneNumber { get; set; }
    public string PhoneNumberCountryCode { get; set; }
    public bool IsPhoneNumberVerified { get; set; }
    public string Token { get; set; }
    public string PhotoUrl { get; set; }
    public string MainSpecialty { get; set; }
    public bool LinkedEmail { get; set; }
    public bool LinkedGoogle { get; set; }
    public int SpecialtyId { get; set; }
    public ICollection<PaymentMethodTypeDto> PaymentMethodTypes { get; set; }
    public string Country { get; set; } = "México";
    public string State { get; set; }
    public string City { get; set; }
    public string Address { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public DateTime CreatedAt { get; set; }
}