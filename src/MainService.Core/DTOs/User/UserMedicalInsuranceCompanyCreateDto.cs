#nullable enable

using System.ComponentModel.DataAnnotations;
using MainService.Models.Entities.Aggregate;
using Microsoft.AspNetCore.Http;

namespace MainService.Core.DTOs.User
{
    public class UserMedicalInsuranceCompanyCreateDto
    {
        [Required(ErrorMessage = "El archivo es requerido.")]
        public IFormFile? File { get; set; } = null;

        [Required(ErrorMessage = "La compañía de seguro médico es requerida.")]
        public OptionDto? MedicalInsuranceCompany { get; set; } = null;

        [Required(ErrorMessage = "Es requerido indicar si es la principal.")]
        public bool? IsMain { get; set; } = null;

        [Required(ErrorMessage = "El número de póliza es requerido.")]
        public string? PolicyNumber { get; set; } = null;
    }
}