namespace MainService.Models.Entities
{
    public class PrescriptionClinic
    {
        public PrescriptionClinic()
        {
        }

        public PrescriptionClinic(int clinicId) => ClinicId = clinicId;

        public int ClinicId { get; set; }
        public int PrescriptionId { get; set; }
        public Address Clinic { get; set; } = null!;
        public Prescription Prescription { get; set; } = null!;
    }
}