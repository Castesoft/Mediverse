using MainService.Models.Entities;

namespace MainService.Models.Helpers;

public static class SeedData
{
    public static readonly IEnumerable<string> roles =
    [
        "Admin",
        "Staff",
        "Patient",
        "Doctor",
        "Nurse",
    ];

    public static IEnumerable<AppRole> getRolesWithPermissions()
    {
        List<AppRole> rolesWithPermissions =
        [
            new("Admin", new()
            {
                { "View Users", "Can view user details" },
                { "Manage Users", "Can create, update, and delete users" },
                { "View Roles", "Can view role details" },
                { "Manage Roles", "Can create, update, and delete roles" },
                { "View Permissions", "Can view permission details" },
                { "Manage Permissions", "Can create, update, and delete permissions" }
            }),
            new("Staff", new()
            {
                { "View orders", "Este permiso habilita al usuario para ver los pedidos" },
                { "Manage orders", "Este permiso habilita al usuario para gestionar los pedidos" },
                { "View products", "Este permiso habilita al usuario para ver los productos" },
                { "Manage products", "Este permiso habilita al usuario para gestionar los productos" },
                { "View billing", "Este permiso habilita al usuario para ver la facturación" },
                { "Manage billing", "Este permiso habilita al usuario para gestionar la facturación" },
            }),
            new("Patient", new()
            {
                { "View appointments", "Este permiso habilita al usuario para ver las citas" },
                { "Manage appointments", "Este permiso habilita al usuario para gestionar las citas" },
                { "View medical records", "Este permiso habilita al usuario para ver los registros médicos" },
                { "Manage medical records", "Este permiso habilita al usuario para gestionar los registros médicos" },
            }),
            new("Doctor", new()
            {
                { "View appointments", "Este permiso habilita al usuario para ver las citas" },
                { "Manage appointments", "Este permiso habilita al usuario para gestionar las citas" },
                { "View patients", "Este permiso habilita al usuario para ver los pacientes" },
                { "Manage patients", "Este permiso habilita al usuario para gestionar los pacientes" },
                { "View medical records", "Este permiso habilita al usuario para ver los registros médicos" },
                { "Manage medical records", "Este permiso habilita al usuario para gestionar los registros médicos" },
            }),
            new("Nurse", new()
            {
                { "View appointments", "Este permiso habilita al usuario para ver las citas" },
                { "Manage appointments", "Este permiso habilita al usuario para gestionar las citas" },
                { "View patients", "Este permiso habilita al usuario para ver los pacientes" },
                { "Manage patients", "Este permiso habilita al usuario para gestionar los pacientes" },
                { "View medical records", "Este permiso habilita al usuario para ver los registros médicos" },
                { "Manage medical records", "Este permiso habilita al usuario para gestionar los registros médicos" },
            }),
        ];

        return rolesWithPermissions;
    }

    public static readonly List<Product> products = new()
    {
        new Product
        {
            Name = "Metformina",
            Description = "Tratamiento de la diabetes tipo 2.",
            Price = 200,
            Quantity = 100,
            Unit = "mg",
            Manufacturer = "Pharma Inc.",
            LotNumber = "A12345",
        },
        new Product()
        {
            Name = "Lisinopril",
            Description = "Tratamiento de la hipertensión.",
            Price = 150,
            Quantity = 200,
            Unit = "mg",
            Manufacturer = "Health Corp.",
            LotNumber = "B23456",
        },
        new Product()
        {
            Name = "Ibuprofeno",
            Description = "Antiinflamatorio y analgésico.",
            Price = 100,
            Quantity = 300,
            Unit = "mg",
            Manufacturer = "Wellness Labs",
            LotNumber = "C34567",
        },
        new Product()
        {
            Name = "Paracetamol",
            Description = "Analgésico y antipirético.",
            Price = 50,
            Quantity = 400,
            Unit = "mg",
            Manufacturer = "Medicines Co.",
            LotNumber = "D45678",
        },
        new Product()
        {
            Name = "Atorvastatina",
            Description = "Reducción del colesterol.",
            Price = 180,
            Quantity = 150,
            Unit = "mg",
            Manufacturer = "CardioHealth",
            LotNumber = "E56789",
        },
        new Product()
        {
            Name = "Amoxicilina",
            Description = "Antibiótico de amplio espectro.",
            Price = 120,
            Quantity = 250,
            Unit = "mg",
            Manufacturer = "BioPharma",
            LotNumber = "F67890",
        },
        new Product()
        {
            Name = "Amlodipino",
            Description = "Tratamiento de la hipertensión y angina.",
            Price = 140,
            Quantity = 180,
            Unit = "mg",
            Manufacturer = "HeartMeds",
            LotNumber = "G78901",
        },
        new Product()
        {
            Name = "Omeprazol",
            Description = "Tratamiento de la acidez y úlceras gástricas.",
            Price = 90,
            Quantity = 220,
            Unit = "mg",
            Manufacturer = "DigestiveHealth",
            LotNumber = "H89012",
        },
        new Product()
        {
            Name = "Simvastatina",
            Description = "Reducción del colesterol.",
            Price = 170,
            Quantity = 160,
            Unit = "mg",
            Manufacturer = "CardioMeds",
            LotNumber = "I90123",
        },
        new Product()
        {
            Name = "Levotiroxina",
            Description = "Tratamiento del hipotiroidismo.",
            Price = 130,
            Quantity = 350,
            Unit = "mcg",
            Manufacturer = "ThyroidCare",
            LotNumber = "J01234",
        },
        new Product()
        {
            Name = "Clopidogrel",
            Description = "Prevención de eventos trombóticos.",
            Price = 250,
            Quantity = 140,
            Unit = "mg",
            Manufacturer = "AntiClot",
            LotNumber = "K12345",
        },
        new Product()
        {
            Name = "Furosemida",
            Description = "Diurético para la hipertensión y edema.",
            Price = 110,
            Quantity = 270,
            Unit = "mg",
            Manufacturer = "DiureticMeds",
            LotNumber = "L23456",
        },
        new Product()
        {
            Name = "Sertralina",
            Description = "Antidepresivo.",
            Price = 220,
            Quantity = 190,
            Unit = "mg",
            Manufacturer = "MoodStabilizers",
            LotNumber = "M34567",
        },
        new Product()
        {
            Name = "Losartán",
            Description = "Tratamiento de la hipertensión.",
            Price = 160,
            Quantity = 210,
            Unit = "mg",
            Manufacturer = "BloodPressureInc",
            LotNumber = "N45678",
        },
        new Product()
        {
            Name = "Salbutamol",
            Description = "Broncodilatador para el asma.",
            Price = 130,
            Quantity = 300,
            Unit = "mcg",
            Manufacturer = "RespiraMeds",
            LotNumber = "O56789",
        },
        new Product()
        {
            Name = "Prednisona",
            Description = "Corticosteroide antiinflamatorio.",
            Price = 200,
            Quantity = 280,
            Unit = "mg",
            Manufacturer = "AntiInflammatories",
            LotNumber = "P67890",
        },
        new Product()
        {
            Name = "Tramadol",
            Description = "Analgésico para el dolor moderado a severo.",
            Price = 300,
            Quantity = 230,
            Unit = "mg",
            Manufacturer = "PainRelief",
            LotNumber = "Q78901",
        },
        new Product()
        {
            Name = "Cetirizina",
            Description = "Antihistamínico para alergias.",
            Price = 80,
            Quantity = 240,
            Unit = "mg",
            Manufacturer = "AllergyMeds",
            LotNumber = "R89012",
        },
        new Product()
        {
            Name = "Insulina Glargina",
            Description = "Tratamiento de la diabetes.",
            Price = 400,
            Quantity = 100,
            Unit = "U/ml",
            Manufacturer = "DiabetesCare",
            LotNumber = "90123",
        },
        new Product()
        {
            Name = "Digoxina",
            Description = "Tratamiento de insuficiencia cardíaca.",
            Price = 210,
            Quantity = 150,
            Unit = "mg",
            Manufacturer = "HeartMeds",
            LotNumber = "T01234",
        },
    };
    
    public static readonly IEnumerable<Service> services =
    [
        new("Consulta general para diagnóstico y tratamiento de enfermedades comunes",
            "Esta consulta general ofrece un diagnóstico y tratamiento para una variedad de enfermedades comunes. Incluye una revisión completa del historial médico del paciente y exámenes físicos básicos para determinar el mejor curso de acción."),

        new("Examen físico completo anual con análisis de laboratorio",
            "El examen físico completo anual incluye una revisión detallada de todos los sistemas del cuerpo y análisis de laboratorio para evaluar el estado general de salud. Este servicio es esencial para la prevención y detección temprana de enfermedades."),

        new("Consulta especializada en cardiología para evaluación y manejo de enfermedades del corazón",
            "La consulta especializada en cardiología ofrece una evaluación exhaustiva del sistema cardiovascular. Incluye pruebas específicas como electrocardiogramas y ecocardiogramas para detectar y manejar enfermedades del corazón."),

        new("Terapia física y rehabilitación para recuperación de lesiones musculoesqueléticas",
            "La terapia física y rehabilitación ayudan en la recuperación de lesiones musculoesqueléticas mediante ejercicios personalizados y técnicas de fisioterapia. Este servicio es ideal para pacientes con lesiones deportivas o postquirúrgicas."),

        new("Consulta ginecológica para revisión y cuidado de la salud femenina",
            "La consulta ginecológica proporciona cuidado integral de la salud femenina, incluyendo exámenes de rutina como Papanicolaou, mamografías y asesoramiento sobre salud reproductiva y planificación familiar."),

        new("Sesión de asesoramiento nutricional y planificación de dietas personalizadas",
            "La sesión de asesoramiento nutricional ofrece orientación sobre hábitos alimenticios saludables y la planificación de dietas personalizadas para mejorar la salud y bienestar general. Este servicio es adecuado para pacientes con necesidades dietéticas específicas."),

        new("Consulta pediátrica para el cuidado y seguimiento de la salud infantil",
            "La consulta pediátrica se enfoca en el cuidado y seguimiento de la salud infantil, ofreciendo revisiones regulares, vacunaciones y tratamiento de enfermedades comunes en niños."),

        new("Consulta dermatológica para diagnóstico y tratamiento de enfermedades de la piel",
            "La consulta dermatológica ofrece diagnóstico y tratamiento para diversas enfermedades de la piel, incluyendo acné, dermatitis, psoriasis y otros trastornos cutáneos. Incluye opciones de tratamiento como medicamentos tópicos y terapias avanzadas."),

        new("Consulta de endocrinología para manejo de trastornos hormonales",
            "La consulta de endocrinología se especializa en el manejo de trastornos hormonales, como diabetes, tiroides y problemas metabólicos. Incluye pruebas específicas y tratamientos personalizados para cada condición."),

        new("Terapia ocupacional para mejorar habilidades motoras y funcionales",
            "La terapia ocupacional ayuda a mejorar las habilidades motoras y funcionales de los pacientes, facilitando su independencia en las actividades diarias. Este servicio es ideal para personas con discapacidades físicas o cognitivas."),

        new("Consulta de salud mental para evaluación y tratamiento de trastornos psicológicos",
            "La consulta de salud mental ofrece evaluación y tratamiento de trastornos psicológicos como ansiedad, depresión y estrés postraumático. Incluye terapias individuales y de grupo, así como asesoramiento psiquiátrico."),

        new("Servicios de odontología general para limpieza, revisión y tratamiento dental",
            "Los servicios de odontología general incluyen limpieza, revisión y tratamiento de problemas dentales comunes como caries, gingivitis y otros trastornos bucales. Este servicio es fundamental para mantener una buena salud dental."),

        new("Consulta de oftalmología para evaluación y tratamiento de problemas de la vista",
            "La consulta de oftalmología ofrece evaluación y tratamiento de problemas de la vista como miopía, hipermetropía, astigmatismo y cataratas. Incluye exámenes de la vista y opciones de tratamiento como lentes de contacto y cirugías correctivas."),

        new("Terapia de salud mental en línea para apoyo psicológico remoto",
            "La terapia de salud mental en línea proporciona apoyo psicológico remoto a través de videollamadas. Este servicio es conveniente para pacientes que prefieren recibir terapia desde la comodidad de su hogar."),

        new("Consulta de medicina interna para manejo de enfermedades crónicas",
            "La consulta de medicina interna se enfoca en el manejo integral de enfermedades crónicas como hipertensión, diabetes y enfermedades respiratorias. Incluye monitoreo regular y ajuste de tratamientos."),

        new("Examen de audiología para evaluación de la audición y problemas auditivos",
            "El examen de audiología evalúa la audición y detecta problemas auditivos. Incluye pruebas de audición y opciones de tratamiento como audífonos y terapias auditivas."),

        new("Consulta de alergología para diagnóstico y tratamiento de alergias",
            "La consulta de alergología ofrece diagnóstico y tratamiento de alergias, incluyendo pruebas de alergias y opciones de tratamiento como inmunoterapia y medicamentos antihistamínicos."),

        new("Consulta de urología para el tratamiento de problemas del tracto urinario",
            "La consulta de urología se especializa en el tratamiento de problemas del tracto urinario y sistema reproductor masculino. Incluye pruebas diagnósticas y tratamientos médicos y quirúrgicos."),

        new("Servicios de podología para cuidado y tratamiento de los pies",
            "Los servicios de podología incluyen el cuidado y tratamiento de problemas de los pies como uñas encarnadas, callos y trastornos podales. Este servicio es esencial para personas con condiciones que afectan los pies."),

        new("Consulta de medicina deportiva para evaluación y tratamiento de lesiones deportivas",
            "La consulta de medicina deportiva ofrece evaluación y tratamiento de lesiones deportivas. Incluye diagnóstico, tratamiento y rehabilitación de lesiones, así como asesoramiento para prevenir futuras lesiones.")
    ];
}