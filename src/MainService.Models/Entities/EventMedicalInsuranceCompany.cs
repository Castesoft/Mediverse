namespace MainService.Models.Entities;

public class EventMedicalInsuranceCompany
{
    public EventMedicalInsuranceCompany() {}
    
    public EventMedicalInsuranceCompany(int medicalInsuranceCompanyId) => MedicalInsuranceCompanyId = medicalInsuranceCompanyId;
    
    public int EventId { get; set; }
    public int MedicalInsuranceCompanyId { get; set; }
    public Event Event { get; set; } = null!;
    public MedicalInsuranceCompany MedicalInsuranceCompany { get; set; } = null!;
}