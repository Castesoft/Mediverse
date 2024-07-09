using System.Text.RegularExpressions;
using MainService.Models.Entities;

namespace MainService.Models.Helpers;

public static partial class SeedData
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

    public static string GenerateMexicanPhoneNumber()
        {
            Random random = new();
            string areaCode = GenerateMexicanAreaCode();
            string phoneNumber = areaCode;

            int remainingLength = 10 - phoneNumber.Length;

            for (int i = 0; i < remainingLength; i++)
            {
                phoneNumber += random.Next(0, 10).ToString();
            }

            return phoneNumber;
        }

        public static string GenerateMexicanAreaCode()
        {
            Random random = new();

            string[] areaCodes = [
                /* Monterrey */ "81", /* Guadalajara */ "33", /* Ciudad de México */ "55", /* Puebla */ "222", /* Tijuana */ "664",
                /* León */ "477", /* Juárez */ "656", /* Torreón */ "871", /* Querétaro */ "442", /* Mérida */ "999", /* Mexicali */ "686",
                /* Aguascalientes */ "449", /* Cuernavaca */ "777", /* Saltillo */ "844", /* Chihuahua */ "614", /* Morelia */ "443",
                /* Veracruz */ "229", /* Tampico */ "833", /* Tuxtla Gutiérrez */ "961", /* Oaxaca */ "951", /* Culiacán */ "667",
                /* Durango */ "618", /* Matamoros */ "868", /* Tepic */ "311", /* Campeche */ "981", /* Colima */ "312", /* Zacatecas */ "492",
                /* La Paz */ "612",
            ];

            return areaCodes[random.Next(areaCodes.Length)];
        }

        public static string ReplaceSpecialChars(string input)
        {
            input = MyRegex1().Replace(input, "n");
            input = MyRegex().Replace(input, "a");
            input = MyRegex2().Replace(input, "e");
            input = MyRegex3().Replace(input, "i");
            input = MyRegex4().Replace(input, "o");
            input = MyRegex5().Replace(input, "u");
            input = MyRegex6().Replace(input, "c");
            return input;
        }

        public static Photo GetRandomProfilePicture(string sex)
        {
            List<Photo> malePhotos = [
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730539/TraceTrust/SeedData/Profile%20pictures/R_az6eso.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730500/TraceTrust/SeedData/Profile%20pictures/aNWjR7MB_400x400_dmxq0i.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730491/TraceTrust/SeedData/Profile%20pictures/312e53eb2c71a023b7de3d1ea989a2c8_wgc0yu.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730486/TraceTrust/SeedData/Profile%20pictures/OIP_zb9ytk.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730473/TraceTrust/SeedData/Profile%20pictures/628ba018745087.5603efd91665d_b1djcp.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730469/TraceTrust/SeedData/Profile%20pictures/dBRXFFE_xnmhjz.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730463/TraceTrust/SeedData/Profile%20pictures/1071625_ibstgs.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730455/TraceTrust/SeedData/Profile%20pictures/a2de3954697c636276192afea0a6f661_tb2mln.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730440/TraceTrust/SeedData/Profile%20pictures/aeecc22a67dac7987a80ac0724658493_jnsgit.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730426/TraceTrust/SeedData/Profile%20pictures/avatar_be2hdh.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803500/TraceTrust/SeedData/Profile%20pictures/d8a01e34926bdb7eb9e1fb506d0aea1b_gpy8sx.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803591/TraceTrust/SeedData/Profile%20pictures/1eea135a4738f2a0c06813788620e055_wki0ea.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803615/TraceTrust/SeedData/Profile%20pictures/R_stwpdc.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803659/TraceTrust/SeedData/Profile%20pictures/unnamed_h0wdih.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803694/TraceTrust/SeedData/Profile%20pictures/7910485066_10a1e5e586_b_eqvtjw.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803754/TraceTrust/SeedData/Profile%20pictures/R_f5nggp.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803830/TraceTrust/SeedData/Profile%20pictures/b32c9c4854abc5925c2d64ee046f02f7_mtaurl.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803860/TraceTrust/SeedData/Profile%20pictures/OIP_zowcac.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803888/TraceTrust/SeedData/Profile%20pictures/sean-headshot-img_dlpwwj.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803905/TraceTrust/SeedData/Profile%20pictures/unnamed_uaq37l.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803935/TraceTrust/SeedData/Profile%20pictures/CharlieKryzinski_mvhbgo.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804012/TraceTrust/SeedData/Profile%20pictures/unnamed_njppnj.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804090/TraceTrust/SeedData/Profile%20pictures/R_v6vs9l.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804122/TraceTrust/SeedData/Profile%20pictures/1541016168011_rfqkkn.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804193/TraceTrust/SeedData/Profile%20pictures/unnamed_gd52u0.jpg", Name = "Male photo", PublicId = "public id", Size = 1 },
            ];

            List<Photo> femalePhotos = [
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730527/TraceTrust/SeedData/Profile%20pictures/de64801f0275c1ab2ea5a9e2bb3ce7bc_h3ayls.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730510/TraceTrust/SeedData/Profile%20pictures/ukxi7n1rojh21_y76zhr.webp", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730503/TraceTrust/SeedData/Profile%20pictures/sarah-parmenter_fxwaf5.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730483/TraceTrust/SeedData/Profile%20pictures/b3c9dfa78c7a93bbd84f9c8fcbcc2a0e_jmdg8j.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730480/TraceTrust/SeedData/Profile%20pictures/R_wnx3tp.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730435/TraceTrust/SeedData/Profile%20pictures/e8b271169214323595f5155a649884d2_jursx3.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804271/TraceTrust/SeedData/Profile%20pictures/OIP_fofq6a.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804396/TraceTrust/SeedData/Profile%20pictures/random_cute_girls_44_aghdvf.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804474/TraceTrust/SeedData/Profile%20pictures/3f234bb3dd39909c65f17a7e90ed89e1--legs_g5oevf.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804557/TraceTrust/SeedData/Profile%20pictures/1578203e47c1b4b660ba9d285f2bb04c_pwfl8b.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804574/TraceTrust/SeedData/Profile%20pictures/ali-brustofski-389394_bbwnmc.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804600/TraceTrust/SeedData/Profile%20pictures/00414ea5f11bf8702420c53465d21a97_hyc7kr.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804629/TraceTrust/SeedData/Profile%20pictures/485cff16aa860056913312a72f6929ee_400x400_fw55rn.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804681/TraceTrust/SeedData/Profile%20pictures/43702d5333b8c3d9ddf6cc4bb3c94347_vldhf5.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804704/TraceTrust/SeedData/Profile%20pictures/961dd1d383fde2983fd7299241b63390_gtg8lq.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804721/TraceTrust/SeedData/Profile%20pictures/7553dbe1a813ac534a1d88ec3ac07c2e_yni6cu.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804742/TraceTrust/SeedData/Profile%20pictures/93334e95100fc3ff057b725a79a5cd35_nvn0qx.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804765/TraceTrust/SeedData/Profile%20pictures/Katie-Johnson-340_rsjeiq.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804788/TraceTrust/SeedData/Profile%20pictures/9cc4f9f6-a21a-43c7-af8b-8612bc3a507c_b8sstb.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804881/TraceTrust/SeedData/Profile%20pictures/d6aa977a680777bdc1a11a757f98cda2_l9zzaq.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804945/TraceTrust/SeedData/Profile%20pictures/09cd873240bdd728ba2fb70696b6ffcc_iosjtz.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804989/TraceTrust/SeedData/Profile%20pictures/10414496_10207078099334972_7467359939825351730_n_wexpdo.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689805028/TraceTrust/SeedData/Profile%20pictures/vMLq2EWw_400x400_mnxcpy.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689805065/TraceTrust/SeedData/Profile%20pictures/photo-47510-75216_lygx3w.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
                new() { Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689805086/TraceTrust/SeedData/Profile%20pictures/R_b08yyj.jpg", Name = "Female photo", PublicId = "public id", Size = 1 },
            ];

            Random random = new();

            if (sex == "Masculino")
            {
                int randomIndex = random.Next(malePhotos.Count);
                return malePhotos[randomIndex];
            }
            else if (sex == "Femenino")
            {
                int randomIndex = random.Next(femalePhotos.Count);
                return femalePhotos[randomIndex];
            }

            return null;
        }

        public static string GetRandomFirstName(string sex)
        {
            Random random = new();

            string[] maleNames = [
                "Juan", "José", "Antonio", "Francisco", "Jesús", "Manuel", "Miguel", "Pedro", "Alejandro", "Jorge", "Rafael",
                "Fernando", "Roberto", "Sergio", "Eduardo", "Julio", "Ricardo", "Carlos", "Raúl", "Enrique", "Ramón", "Gabriel",
                "Mario", "Luis", "Alberto", "Arturo", "Hugo", "Gerardo", "Guillermo", "Oscar", "Felipe", "Mauricio", "Rubén",
                "Alfredo", "Ignacio", "Cesar", "Gustavo", "Salvador", "Victor", "Adrian", "Ernesto", "Isaac", "Diego", "Javier", "Rodrigo",
                "Pablo", "Daniel", "Armando",
            ];

            string[] femaleNames = [
                "María", "Carmen", "Josefa", "Ana", "Isabel", "Francisca", "Dolores", "Teresa", "Pilar", "Laura", "Juana",
                "Lucía", "Elena", "Sofía", "Paula", "Marina", "Irene", "Inés", "Patricia", "Rosa", "Marta", "Beatriz",
                "Sara", "Lourdes", "Cristina", "Susana", "Alicia", "Luisa", "Silvia", "Rocio", "Gloria", "Alejandra", "Gabriela",
                "Guadalupe", "Adriana", "Graciela", "Fernanda", "Cecilia", "Alma", "Clara", "Martha", "Yolanda", "Estela", "Miriam", "Olga",
                "Verónica", "Magdalena", "Angélica", "Mónica", "Elisa",
            ];

            if (sex == "Masculino")
            {
                return maleNames[random.Next(maleNames.Length)];
            }
            return femaleNames[random.Next(femaleNames.Length)];
        }

        public static DateOnly GenerateRandomDateOfBirth(int minYear, int maxYear)
        {
            Random random = new();

            int year = random.Next(minYear, maxYear + 1);
            int month = random.Next(1, 13);
            int day = random.Next(1, DateTime.DaysInMonth(year, month) + 1);

            return new DateOnly(year, month, day);
        }

        public static DateTime GenerateRandomDateTime(int minYear)
        {
            Random random = new();

            DateTime yesterday = DateTime.UtcNow.AddDays(-1);
            int maxYear = yesterday.Year;

            int year = random.Next(minYear, maxYear + 1);

            int month = (year == maxYear) ? random.Next(1, yesterday.Month + 1) : random.Next(1, 13);
            int day;
            if (year == maxYear && month == yesterday.Month)
            {
                day = random.Next(1, yesterday.Day + 1);
            }
            else
            {
                int daysInMonth = DateTime.DaysInMonth(year, month);
                day = random.Next(1, daysInMonth + 1);
            }

            int hour = random.Next(0, 24);
            int minute = random.Next(0, 60);
            int second = random.Next(0, 60);

            return new DateTime(year, month, day, hour, minute, second, DateTimeKind.Utc);
        }

        public static string GetRandomSex()
        {
            Random random = new();
            string[] sexes = ["Masculino", "Femenino"];

            return sexes[random.Next(sexes.Length)];
        }

        public static string GetRandomLastName()
        {
            Random random = new();

            string[] lastNames = [
                "García", "Martínez", "Rodríguez", "Hernández", "López", "González", "Pérez", "Sánchez", "Ramírez", "Torres", "Flores",
                "Rivera", "Gómez", "Díaz", "Reyes", "Morales", "Cruz", "Ortiz", "Gutiérrez", "Chávez", "Ramos", "Guzmán", "Ruiz",
                "Alvarez", "Moreno", "Mendoza", "Castillo", "Jiménez", "Rojas", "Vargas", "Romero", "Silva", "Muñoz", "Aguilar", "Paredes",
                "Cervantes", "Luna", "Medina", "Navarro", "Campos", "Arias", "Juárez", "Mireles", "Escobar", "Ponce", "Carrillo", "Castañeda",
                "Aguirre", "Núñez", "Vega", "Rangel", "Salazar", "Zamora", "Solís", "Peña",
            ];

            return lastNames[random.Next(lastNames.Length)];
        }

        public static string GetRandomEmailDomain()
        {
            var random = new Random();

            string[] emailDomains = [
                "gmail", "hotmail", "yahoo", "outlook", "icloud", "aol", "protonmail", "zoho", "yandex", "tutanota", "mail", "gmx",
                "mailfence", "fastmail", "mail", "mail2world", "hushmail", "runbox", "countermail", "mailbox", "mailinator", "guerrillamail", "temp-mail", "10minutemail",
                "maildrop", "mailnesia", "mailinator",
            ];

            return emailDomains[random.Next(emailDomains.Length)];
        }

        public static string ConstructFullEmailAddress(string firstName, string lastName, string emailDomain, int index)
        {
            return $@"{ReplaceSpecialChars(firstName)}.{ReplaceSpecialChars(lastName)}.demo{index}@{emailDomain}.com".ToLower();
        }

        public static List<AppUser> GenerateUsersForSeeding(int quantity)
        {
            Random random = new();
            List<AppUser> users = [];

            for (int i = 0; i < quantity; i++)
            {
                string sex = GetRandomSex();
                string firstName = GetRandomFirstName(sex);
                string lastName = GetRandomLastName();
                string email = ConstructFullEmailAddress(firstName, lastName, GetRandomEmailDomain(), i);
                string userName = email;

                AppUser user = new()
                {
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    UserName = userName,
                    PhoneNumber = GenerateMexicanPhoneNumber(),
                    PhoneNumberCountryCode = "+52",
                    CreatedAt = GenerateRandomDateTime(2013),
                    DateOfBirth = GenerateRandomDateOfBirth(1960, 2005),
                    Sex = sex,
                };

                if (random.Next(2) == 0)
                    user.UserPhoto = new() { Photo = GetRandomProfilePicture(sex) };

                users.Add(user);
            }

            return users;
        }

    [GeneratedRegex("[áàâä]")]
    private static partial Regex MyRegex();
    [GeneratedRegex("[ñ]")]
    private static partial Regex MyRegex1();
    [GeneratedRegex("[éèêë]")]
    private static partial Regex MyRegex2();
    [GeneratedRegex("[íìîï]")]
    private static partial Regex MyRegex3();
    [GeneratedRegex("[óòôö]")]
    private static partial Regex MyRegex4();
    [GeneratedRegex("[úùûü]")]
    private static partial Regex MyRegex5();
    [GeneratedRegex("[ç]")]
    private static partial Regex MyRegex6();

}