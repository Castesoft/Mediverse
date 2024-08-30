using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User
{
    public class UserAddressDto
    {
        public int Id { get; set; }
        public bool IsMain { get; set; }
        public bool IsBilling { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Zipcode { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class UserAddressCreateDto
    {
        public bool IsMain { get; set; }
        public bool IsBilling { get; set; }
        
        [Required(ErrorMessage = "La calle es requerida.")]
        public string Street { get; set; }

        public string InteriorNumber { get; set; }

        // [Required(ErrorMessage = "El número exterior es requerido.")]
        public string ExteriorNumber { get; set; }

        public string Neighborhood { get; set; }

        [Required(ErrorMessage = "La ciudad es requerida.")]
        public string City { get; set; }

        [Required(ErrorMessage = "El estado es requerido.")]
        public string State { get; set; }

        // [Required(ErrorMessage = "El país es requerido.")]
        public string Country { get; set; }

        [Required(ErrorMessage = "El código postal es requerido.")]
        public string Zipcode { get; set; }
    }

    public class UserAddressUpdateDto
    {
        public bool IsMain { get; set; }
        public bool IsBilling { get; set; }
        [Required(ErrorMessage = "La calle es requerida.")]
        public string Street { get; set; }

        public string InteriorNumber { get; set; }

        [Required(ErrorMessage = "El número exterior es requerido.")]
        public string ExteriorNumber { get; set; }

        public string Neighborhood { get; set; }

        [Required(ErrorMessage = "La ciudad es requerida.")]
        public string City { get; set; }

        [Required(ErrorMessage = "El estado es requerido.")]
        public string State { get; set; }

        [Required(ErrorMessage = "El país es requerido.")]
        public string Country { get; set; }

        [Required(ErrorMessage = "El código postal es requerido.")]
        public string Zipcode { get; set; }    }
}