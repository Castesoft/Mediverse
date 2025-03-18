using System.ComponentModel.DataAnnotations;
using MainService.Models.Entities.Aggregate;
using Microsoft.AspNetCore.Http;

namespace MainService.Core.DTOs.User
{
    public class MedicalLicenseCreateDto
    {
        [Required(ErrorMessage = "El archivo es requerido.")]
        public IFormFile? File { get; set; }

        [Required(ErrorMessage = "La especialidad es requerida.")]
        public OptionDto? Specialty { get; set; }

        [Required(ErrorMessage = "La cédula profesional es requerida.")]
        [StringLength(7, ErrorMessage = "La cédula profesional debe tener 7 caracteres.")]
        public string? LicenseNumber { get; set; }

        [Required(ErrorMessage = "La cédula de especialidad es requerida.")]
        [StringLength(7, ErrorMessage = "La cédula de especialidad debe tener 7 caracteres.")]
        public string? SpecialtyLicense { get; set; }

        [Required(ErrorMessage = "Es requerido indicar si es la principal.")]
        public bool? IsMain { get; set; }
    }
}
