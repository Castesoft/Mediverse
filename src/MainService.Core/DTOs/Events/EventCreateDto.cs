using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.Events
{
    public class EventCreateDto
    {
        [Required(ErrorMessage = "El paciente es requerido.")]
        public int PatientId { get; set; }

        [MaxLength(100, ErrorMessage = "Las enfermeras no pueden exceder de 100 caracteres.")]
        public string NursesIds { get; set; }

        [Required(ErrorMessage = "El servicio es requerido.")]
        public int ServiceId { get; set; }

        [Required(ErrorMessage = "La clínica es requerida.")]
        public int ClinicId { get; set; }

        [Required(ErrorMessage = "La duración es requerido.")] 
        public bool AllDay { get; set; }

        [Required(ErrorMessage = "La fecha de inicio es requerida.")]
        public DateTime DateFrom { get; set; }

        [Required(ErrorMessage = "La fecha de fin es requerida.")]
        public DateTime DateTo { get; set; }
        [Required(ErrorMessage = "El rol es requerido.")]
        public string Role { get; set; }
        public string TimeFrom { get; set; }
        public string TimeTo { get; set; }
        public int DoctorId { get; set; }
        public int PaymentMethodTypeId { get; set; }
        public int MedicalInsuranceCompanyId { get; set; }
        public string StripePaymentMethodId { get; set; }
        public bool HasPatientInformationAccess { get; set; }
    }
}