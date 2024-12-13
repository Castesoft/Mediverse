namespace MainService.Core.DTOs.User;
public class UserMedicalLicenseDto
{
    public bool IsMain { get; set; }
    /// <summary>
    /// Cédula Profesional
    /// </summary>
    /// <remarks>
    /// <para><strong>Longitud:</strong> Generalmente consta de 7 u 8 dígitos numéricos.</para>
    /// <para><strong>Composición:</strong> Secuencia de dígitos sin letras ni caracteres especiales.</para>
    /// <para><strong>Emisión:</strong> Otorgada al concluir los estudios de licenciatura en medicina y cumplir con los requisitos de titulación.</para>
    /// <para><strong>Función:</strong> Autoriza al médico para ejercer la medicina en general en todo México.</para>
    /// </remarks>
    public string? LicenseNumber { get; set; }
    /// <summary>
    /// Cédula de Especialidad
    /// </summary>
    /// <remarks>
    /// <para><strong>Longitud:</strong> Consta de 7 u 8 dígitos, similar a la cédula profesional.</para>
    /// <para><strong>Composición:</strong> Número único sin letras ni caracteres especiales, asignado a quienes han completado su especialidad.</para>
    /// <para><strong>Emisión:</strong> Se otorga tras completar un programa de especialización acreditado y cumplir con los requisitos de titulación de la especialidad.</para>
    /// <para><strong>Función:</strong> Permite al médico ejercer su especialidad en todo el país. Es requerido para validar la especialización del médico en actividades específicas.</para>
    /// <para><strong>Nota:</strong> Cada médico tiene una cédula de especialidad única, incluso si comparten la misma área de especialización, como psiquiatría.</para>
    /// </remarks>
    public string? SpecialtyLicense { get; set; }
    /// <summary>
    /// Documento asociado a la cédula profesional o de especialidad.
    /// </summary>
    /// <remarks>
    /// <para>
    /// La propiedad <c>MedicalLicenseDocument</c> almacena la información del documento oficial que respalda la cédula profesional o la cédula de especialidad de un médico.
    /// Este documento puede incluir el identificador público del archivo y la URL donde se puede acceder al mismo.
    /// </para>
    /// <para>
    /// La existencia de este documento es crucial para validar la autenticidad de la cédula y para proporcionar una referencia tangible
    /// que pueda ser verificada por instituciones y organizaciones que necesiten confirmar la validez de la licencia médica.
    /// </para>
    /// </remarks>
    public DocumentDto? Document { get; set; }
    public int SpecialtyId { get; set; }
    public string? SpecialtyName { get; set; }
}