using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.Events
{
    public class EventCreateDto
    {
        [Required(ErrorMessage = "El paciente es requerido.")]
        public int PatientId { get; set; }

        [Required(ErrorMessage = "Las enfermeras son requeridas.")]
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

        public string TimeFrom { get; set; }
        public string TimeTo { get; set; }
    }
}