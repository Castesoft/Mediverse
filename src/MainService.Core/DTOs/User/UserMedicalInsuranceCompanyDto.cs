namespace MainService.Core.DTOs.User
{
    public class UserMedicalInsuranceCompanyDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsMain { get; set; }
        public string PolicyNumber { get; set; }
        public string PhotoUrl { get; set; }
        public DocumentDto Document { get; set; }
        
    }
}