using System.ComponentModel.DataAnnotations;
using MainService.Models.Entities.Aggregate;
using Microsoft.AspNetCore.Http;

namespace MainService.Core.DTOs.User
{
    public class UserMedicalInsuranceCompanyCreateDto
    {
        [Required(ErrorMessage = "El archivo es requerido.")]
        public IFormFile? File { get; set; }

        [Required(ErrorMessage = "La compañía de seguro médico es requerida.")]
        public OptionDto? MedicalInsuranceCompany { get; set; }

        [Required(ErrorMessage = "Es requerido indicar si es la principal.")]
        public bool? IsMain { get; set; }

        [Required(ErrorMessage = "El número de póliza es requerido.")]
        public string? PolicyNumber { get; set; }
    }
}//reportar con el director de monterrey, que lo van a contactar para ayudarle
// 