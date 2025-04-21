namespace MainService.Models.Entities;

/// <summary>
/// Representa una licencia médica que incluye tanto la cédula profesional como la cédula de especialidad.
/// </summary>
/// <remarks>
/// <para>
/// La cédula profesional es un documento oficial emitido por la Secretaría de Educación Pública (SEP) que certifica que un médico ha completado sus estudios de licenciatura en medicina
/// y ha cumplido con todos los requisitos legales para ejercer la profesión en México. Este documento es necesario para que el médico pueda ejercer legalmente en todo el país.
/// </para>
/// <para>
/// Adicionalmente, la clase también maneja la cédula de especialidad, que es emitida para aquellos médicos que han completado un programa de especialización
/// y les permite ejercer en su área específica de especialización.
/// </para>
/// <para>
/// La clase MedicalLicense encapsula ambos tipos de cédulas (profesional y de especialidad) junto con la documentación relacionada, asegurando que
/// la información relevante sobre las licencias médicas se gestione de manera centralizada.
/// </para>
/// </remarks>
public class MedicalLicense : BaseCodeEntity
{
    public MedicalLicense()
    {
    }

    public MedicalLicense(int specialtyId) => MedicalLicenseSpecialty = new MedicalLicenseSpecialty(specialtyId);

    public MedicalLicense(int specialtyId, string documentPublicId, string documentUrl)
    {
        MedicalLicenseSpecialty = new MedicalLicenseSpecialty(specialtyId);
        MedicalLicenseDocument = new MedicalLicenseDocument(documentPublicId, documentUrl);
    }

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
    public MedicalLicenseDocument MedicalLicenseDocument { get; set; } = null!;
    public UserMedicalLicense UserMedicalLicense { get; set; } = null!;

    public MedicalLicenseSpecialty MedicalLicenseSpecialty { get; set; } = null!;
    public List<MedicalLicenseSubSpecialty> MedicalLicenseSubSpecialties { get; set; } = [];
}

public class MedicalLicenseParams : BaseCodeParams;