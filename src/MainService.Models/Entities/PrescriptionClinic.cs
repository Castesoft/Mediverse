namespace MainService.Models.Entities
{
    public class PrescriptionClinic
    {
        public PrescriptionClinic() { }
        public PrescriptionClinic(int clinicId) => ClinicId = clinicId;

        public Address Clinic { get; set; } public int ClinicId { get; set; }
        public Prescription Prescription { get; set; } public int PrescriptionId { get; set; }
    }
}