using System.Security.Cryptography.X509Certificates;
using System.Text.RegularExpressions;
using MainService.Models.Entities;

namespace MainService.Models.Helpers;

public static partial class SeedData
{
    private static readonly Random random = new();
    
    public static readonly IEnumerable<string> roles =
    [
        "Admin",
        "Staff",
        "Patient",
        "Doctor",
        "Nurse",
    ];

    public static readonly IEnumerable<MedicalInsuranceCompany> medicalInsuranceCompanies =
    [
        new MedicalInsuranceCompany { Name = "AXA Seguros", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "axa_seguros_ergezf" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/axa_seguros_ergezf.png" } }},
        new MedicalInsuranceCompany { Name = "GNP Seguros", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "gnp_seguros_xpttil" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/gnp_seguros_xpttil.png" } }},
        new MedicalInsuranceCompany { Name = "Aseguradora Interacciones", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "aseguradora_interacciones_drezf3" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/aseguradora_interacciones_drezf3.png" } }},
        new MedicalInsuranceCompany { Name = "Seguros Banorte", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "seguros_banorte_fsrra6" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/seguros_banorte_fsrra6.png" } }},
        new MedicalInsuranceCompany { Name = "Seguros Monterrey New York Life", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "seguros_monterrey_uzj3ui" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198863/seguros_monterrey_uzj3ui.png" } }},
        new MedicalInsuranceCompany { Name = "Mapfre México", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "mapfre_mexico_cmg4u2" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/mapfre_mexico_cmg4u2.png" } }},
        new MedicalInsuranceCompany { Name = "Metlife", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "metlife_hzbave" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/metlife_hzbave.png" } }},
        new MedicalInsuranceCompany { Name = "Seguros Atlas", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "seguros_atlas_jo69el" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/seguros_atlas_jo69el.png" } }},
        new MedicalInsuranceCompany { Name = "RSA", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "rsa_xfjykh" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/rsa_xfjykh.png" } }},
        new MedicalInsuranceCompany { Name = "Bupa Seguros", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "bupa_seguros_qru9sa" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/bupa_seguros_qru9sa.png" } }},
        new MedicalInsuranceCompany { Name = "Seguros Multiva", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "seguros_multiva_qmcj0e" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/seguros_multiva_qmcj0e.png" } }},
        new MedicalInsuranceCompany { Name = "Seguros Inbursa", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "seguros_inbursa_en5tbk" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/seguros_inbursa_en5tbk.png" } }},
        new MedicalInsuranceCompany { Name = "Allianz", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "allianz_azpevk" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/allianz_azpevk.png" } }},
        new MedicalInsuranceCompany { Name = "La Latino Seguros", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "la_latino_seguros_kxisgu" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/la_latino_seguros_kxisgu.png" } }},
        new MedicalInsuranceCompany { Name = "Seguros BX+", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "seguros_bx_vjbqpz" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/seguros_bx_vjbqpz.png" } }},
        new MedicalInsuranceCompany { Name = "Plan Seguro", MedicalInsuranceCompanyPhoto = new() { Photo = new() { PublicId = "plan_seguro_w6ehun" , Url = "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/plan_seguro_w6ehun.png" } }}
    ];

    public static readonly IEnumerable<PaymentMethodType> paymentMethodTypes =
    [
        new PaymentMethodType { Name = "Tarjeta de Crédito" },
        new PaymentMethodType { Name = "Tarjeta de Débito" },
        new PaymentMethodType { Name = "Transferencia Bancaria" },
        new PaymentMethodType { Name = "Efectivo" },
        new PaymentMethodType { Name = "Paypal" }
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
                { "View events", "Este permiso habilita al usuario para ver las citas" },
                { "Manage events", "Este permiso habilita al usuario para gestionar las citas" },
                { "View medical records", "Este permiso habilita al usuario para ver los registros médicos" },
                { "Manage medical records", "Este permiso habilita al usuario para gestionar los registros médicos" },
            }),
            new("Doctor", new()
            {
                { "View events", "Este permiso habilita al usuario para ver las citas" },
                { "Manage events", "Este permiso habilita al usuario para gestionar las citas" },
                { "View patients", "Este permiso habilita al usuario para ver los pacientes" },
                { "Manage patients", "Este permiso habilita al usuario para gestionar los pacientes" },
                { "View medical records", "Este permiso habilita al usuario para ver los registros médicos" },
                { "Manage medical records", "Este permiso habilita al usuario para gestionar los registros médicos" },
            }),
            new("Nurse", new()
            {
                { "View events", "Este permiso habilita al usuario para ver las citas" },
                { "Manage events", "Este permiso habilita al usuario para gestionar las citas" },
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
            Dosage = 850,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://chedrauimx.vtexassets.com/arquivos/ids/32138501-800-auto?v=638560236813070000&width=800&height=auto&aspect=true",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "Pharma Inc.",
            LotNumber = "A12345",
        },
        new Product()
        {
            Name = "Lisinopril",
            Description = "Tratamiento de la hipertensión.",
            Price = 150,
            Dosage = 10,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://i0.wp.com/prixz.com/salud/wp-content/uploads/2020/06/lisinopril.jpg?fit=720%2C440&ssl=1",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "Health Corp.",
            LotNumber = "B23456",
        },
        new Product()
        {
            Name = "Ibuprofeno",
            Description = "Antiinflamatorio y analgésico.",
            Price = 100,
            Dosage = 400,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://www.benavides.com.mx/media/catalog/product/cache/13134524bf2f7c32f6bea508eba7e730/2/0/20231002_1042110.jpg",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "Wellness Labs",
            LotNumber = "C34567",
        },
        new Product()
        {
            Name = "Paracetamol",
            Description = "Analgésico y antipirético.",
            Price = 50,
            Dosage = 500,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://www.soriana.com/on/demandware.static/-/Sites-soriana-grocery-master-catalog/default/dw83b430ea/images/product/7500093754574_A.jpg",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "Medicines Co.",
            LotNumber = "D45678",
        },
        new Product()
        {
            Name = "Atorvastatina",
            Description = "Reducción del colesterol.",
            Price = 180,
            Dosage = 20,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://heka.mx/wp-content/uploads/1970/01/atorvastatina-psicofarma-20mg-heka.jpg",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "CardioHealth",
            LotNumber = "E56789",
        },
        new Product()
        {
            Name = "Amoxicilina",
            Description = "Antibiótico de amplio espectro.",
            Price = 120,
            Dosage = 500,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://resources.sanborns.com.mx/imagenes-sanborns-ii/1200/7501349021570.jpg?scale=500&qlty=75",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "BioPharma",
            LotNumber = "F67890",
        },
        new Product()
        {
            Name = "Amlodipino",
            Description = "Tratamiento de la hipertensión y angina.",
            Price = 140,
            Dosage = 5,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://resources.sanborns.com.mx/imagenes-sanborns-ii/1200/7502216793378.jpg?scale=500&qlty=75",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "HeartMeds",
            LotNumber = "G78901",
        },
        new Product()
        {
            Name = "Omeprazol",
            Description = "Tratamiento de la acidez y úlceras gástricas.",
            Price = 90,
            Dosage = 20,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://resources.sanborns.com.mx/imagenes-sanborns-ii/1200/7501277093472.jpg?scale=500&qlty=75",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "DigestiveHealth",
            LotNumber = "H89012",
        },
        new Product()
        {
            Name = "Simvastatina",
            Description = "Reducción del colesterol.",
            Price = 170,
            Dosage = 20,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://www.movil.farmaciasguadalajara.com/wcsstore/FGCAS/wcs/products/1187074_A_1280_AL.jpg",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "CardioMeds",
            LotNumber = "I90123",
        },
        new Product()
        {
            Name = "Levotiroxina",
            Description = "Tratamiento del hipotiroidismo.",
            Price = 130,
            Dosage = 100,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/ifa_celtics_levotiroxina_tab_100mcg_c100.png",
                    }
                }
            ],
            Unit = "mcg",
            Manufacturer = "ThyroidCare",
            LotNumber = "J01234",
        },
        new Product()
        {
            Name = "Clopidogrel",
            Description = "Prevención de eventos trombóticos.",
            Price = 250,
            Dosage = 75,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://resources.sears.com.mx/medios-plazavip/s2/23552/3904489/62d92f55d4bce-03c29096-bcb9-45f2-b8d2-69637743f15d-1600x1600.jpg?scale=500&qlty=75",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "AntiClot",
            LotNumber = "K12345",
        },
        new Product()
        {
            Name = "Furosemida",
            Description = "Diurético para la hipertensión y edema.",
            Price = 110,
            Dosage = 40,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://i5.walmartimages.com.mx/gr/images/product-images/img_large/00750157390847L.jpg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "DiureticMeds",
            LotNumber = "L23456",
        },
        new Product()
        {
            Name = "Sertralina",
            Description = "Antidepresivo.",
            Price = 220,
            Dosage = 50,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://sanorim.mx/cdn/shop/files/Setralina.jpg?v=1686540790",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "MoodStabilizers",
            LotNumber = "M34567",
        },
        new Product()
        {
            Name = "Losartán",
            Description = "Tratamiento de la hipertensión.",
            Price = 160,
            Dosage = 50,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://chedrauimx.vtexassets.com/arquivos/ids/32159730-800-auto?v=638560300075600000&width=800&height=auto&aspect=true",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "BloodPressureInc",
            LotNumber = "N45678",
        },
        new Product()
        {
            Name = "Salbutamol",
            Description = "Broncodilatador para el asma.",
            Price = 130,
            Dosage = 100,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://www.fahorro.com/media/catalog/product/7/5/7501043100595.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=265&width=265&canvas=265:265",
                    }
                }
            ],
            Unit = "mcg",
            Manufacturer = "RespiraMeds",
            LotNumber = "O56789",
        },
        new Product()
        {
            Name = "Prednisona",
            Description = "Corticosteroide antiinflamatorio.",
            Price = 200,
            Dosage = 5,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_prednisona_tabs_5mg_20.png",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "AntiInflammatories",
            LotNumber = "P67890",
        },
        new Product()
        {
            Name = "Tramadol",
            Description = "Analgésico para el dolor moderado a severo.",
            Price = 300,
            Dosage = 150,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://i5.walmartimages.com.mx/gr/images/product-images/img_large/00750138454555L.jpg",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "PainRelief",
            LotNumber = "Q78901",
        },
        new Product()
        {
            Name = "Cetirizina",
            Description = "Antihistamínico para alergias.",
            Price = 80,
            Dosage = 10,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://www.fahorro.com/media/catalog/product/7/5/7502223706156.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg",
                    }
                }
            ],
            Unit = "mg",
            Manufacturer = "AllergyMeds",
            LotNumber = "R89012",
        },
        new Product()
        {
            Name = "Insulina Glargina",
            Description = "Tratamiento de la diabetes.",
            Price = 400,
            Dosage = 100,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://www.movil.farmaciasguadalajara.com/wcsstore/FGCAS/wcs/products/1234889_A_1280_AL.jpg",
                    }
                }
            ],
            Unit = "U/ml",
            Manufacturer = "DiabetesCare",
            LotNumber = "90123",
        },
        new Product()
        {
            Name = "Digoxina",
            Description = "Tratamiento de insuficiencia cardíaca.",
            Price = 210,
            Dosage = 1,
            ProductPhotos = [
                new ()
                {
                    Photo = new ()
                    {
                        Url = "https://representacionland.com/wp-content/uploads/2023/03/Digoxina-025mg-tab-estuche-x-10tag-LAND.jpg",
                    }
                }
            ],
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

        public static string GetRandomMedicalSpecialty()
        {
            Random random = new();

            string[] specialties = [
                "Cardiología", "Dermatología", "Endocrinología", "Gastroenterología", "Geriatría", "Ginecología", "Hematología", "Infectología",
                "Medicina deportiva", "Medicina interna", "Nefrología", "Neumología", "Neurología", "Nutriología", "Oftalmología", "Oncología",
                "Ortopedia", "Otorrinolaringología", "Pediatría", "Psiquiatría", "Reumatología", "Traumatología", "Urología",
            ];

            return specialties[random.Next(specialties.Length)];
        }

        public static string GetRandomMedicalJobPosts()
        {
            Random random = new();

            string[] jobPosts = [
                "Médico general", "Médico especialista en cardiología", "Médico especialista en dermatología", "Médico especialista en endocrinología",
                "Médico especialista en gastroenterología", "Médico especialista en geriatría", "Médico especialista en ginecología",
                "Médico especialista en hematología", "Médico especialista en infectología", "Médico especialista en medicina deportiva",
                "Médico especialista en medicina interna", "Médico especialista en nefrología", "Médico especialista en neumología",
                "Médico especialista en neurología", "Médico especialista en nutriología", "Médico especialista en oftalmología",
                "Médico especialista en oncología", "Médico especialista en ortopedia", "Médico especialista en otorrinolaringología",
                "Médico especialista en pediatría", "Médico especialista en psiquiatría", "Médico especialista en reumatología",
                "Médico especialista en traumatología", "Médico especialista en urología",
            ];

            return jobPosts[random.Next(jobPosts.Length)];
        }

        public static string ConstructFullEmailAddress(string firstName, string lastName, string emailDomain, int index)
        {
            return $@"{ReplaceSpecialChars(firstName)}.{ReplaceSpecialChars(lastName)}.demo{index}@{emailDomain}.com".ToLower();
        }

        public static List<AppUser> GenerateUsersForSeeding(int quantity, Roles role)
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
                    UserAddresses = GenerateUserAddresses(),
                };

                if (role == Roles.Nurse || role == Roles.Doctor)
                {
                    user.Post = GetRandomMedicalJobPosts();
                    user.Education = GetRandomMedicalSpecialty();
                }

                if (role == Roles.Doctor)
                {
                    user.DoctorClinics = GenerateDoctorClinics();
                }

                if (random.Next(2) == 0)
                    user.UserPhoto = new() { Photo = GetRandomProfilePicture(sex) };

                users.Add(user);
            }

            return users;
        }

        public static List<Address> GetAddresses() 
        {
            return [
                new() {
                    Zipcode = "64020",
                    ExteriorNumber = "702",
                    InteriorNumber = "",
                    Street = "Gonzalitos",
                    Neighborhood = "San Jerónimo",
                    City = "Monterrey",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Name = "",
                    Description = "",
                    Latitude = 25.6769758,
                    Longitude = -100.3531176,
                },
                new() {
                    Zipcode = "64630",
                    ExteriorNumber = "911",
                    InteriorNumber = "",
                    Street = "Blvd. Puerta del Sol",
                    Neighborhood = "Colinas de San Jerónimo",
                    City = "Monterrey",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6919463,
                    Longitude = -100.3686293,
                },
                new() {
                    Zipcode = "64640",
                    ExteriorNumber = "2000",
                    InteriorNumber = "",
                    Street = "Av Insurgentes",
                    Neighborhood = "La Escondida",
                    City = "Monterrey",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6761058,
                    Longitude = -100.3680975,
                },
                new() {
                    Zipcode = "64630",
                    ExteriorNumber = "705",
                    InteriorNumber = "",
                    Street = "P.º de Los Alamos",
                    Neighborhood = "Colinas de San Jerónimo 1o. Sector",
                    City = "Monterrey",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6868347,
                    Longitude = -100.3694059,
                },
                new() {
                    Zipcode = "64720",
                    ExteriorNumber = "837",
                    InteriorNumber = "",
                    Street = "Calz. Francisco I. Madero",
                    Neighborhood = "Centro",
                    City = "Monterrey",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6848204,
                    Longitude = -100.3212331,
                },
                new() {
                    Zipcode = "66226",
                    ExteriorNumber = "755-Pte.",
                    InteriorNumber = "",
                    Street = "Av. José Vasconcelos",
                    Neighborhood = "Del Valle",
                    City = "San Pedro Garza García",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6570637,
                    Longitude = -100.3892309,
                },
                new() {
                    Zipcode = "66259",
                    ExteriorNumber = "926",
                    InteriorNumber = "",
                    Street = "Av. Manuel Gómez Morín",
                    Neighborhood = "Comercial Gómez Morin",
                    City = "San Pedro Garza García",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6456461,
                    Longitude = -100.3612204,
                },
                new() {
                    Zipcode = "66290",
                    ExteriorNumber = "118 Sur",
                    InteriorNumber = "",
                    Street = "Av. San Angel",
                    Neighborhood = "Zona Residencial Chipinque",
                    City = "San Pedro Garza García",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6284384,
                    Longitude = -100.3628003,
                },
                new() {
                    Zipcode = "66267",
                    ExteriorNumber = "107",
                    InteriorNumber = "",
                    Street = "Av Alfonso Reyes",
                    Neighborhood = "Veredalta",
                    City = "San Pedro Garza García",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6454126,
                    Longitude = -100.3456511,
                },
                new() {
                    Zipcode = "66273",
                    ExteriorNumber = "660",
                    InteriorNumber = "",
                    Street = "Avenida del Roble",
                    Neighborhood = "Blvd. Arboleda, Valle del Campestre",
                    City = "San Pedro Garza García",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6487976,
                    Longitude = -100.3566376,
                },
                new() {
                    Zipcode = "67197",
                    ExteriorNumber = "1100",
                    InteriorNumber = "",
                    Street = "Av. Pablo Livas",
                    Neighborhood = "Gustavo Díaz Ordaz",
                    City = "Guadalupe",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6623974,
                    Longitude = -100.2041685,
                },
                new() {
                    Zipcode = "67190",
                    ExteriorNumber = "5500",
                    InteriorNumber = "",
                    Street = "Benito Juárez",
                    Neighborhood = "Las Huertas",
                    City = "Guadalupe",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6736607,
                    Longitude = -100.1899381,
                },
                new() {
                    Zipcode = "67167",
                    ExteriorNumber = "108",
                    InteriorNumber = "",
                    Street = "Durango",
                    Neighborhood = "Orizaba",
                    City = "Guadalupe",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6835315,
                    Longitude = -100.1956278,
                },
                new() {
                    Zipcode = "67163",
                    ExteriorNumber = "",
                    InteriorNumber = "",
                    Street = "Av. Gral. Lázaro Cárdenas",
                    Neighborhood = "Sin Nombre de Col 13",
                    City = "Guadalupe",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6832912,
                    Longitude = -100.2296492,
                },
                new() {
                    Zipcode = "67180",
                    ExteriorNumber = "600",
                    InteriorNumber = "",
                    Street = "Av 13 de Mayo",
                    Neighborhood = "Rafael Ramírez (U.c.)",
                    City = "Guadalupe",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6713915,
                    Longitude = -100.2205656,
                },
                new() {
                    Zipcode = "66430",
                    ExteriorNumber = "116",
                    InteriorNumber = "",
                    Street = "Av. Santo Domingo",
                    Neighborhood = "Sta Maria",
                    City = "San Nicolás de los Garza",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.754731,
                    Longitude = -100.2800626,
                },
                new() {
                    Zipcode = "66414",
                    ExteriorNumber = "200A",
                    InteriorNumber = "",
                    Street = "Av. Santo Domingo",
                    Neighborhood = "",
                    City = "San Nicolás de los Garza",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.7535107,
                    Longitude = -100.2729507,
                },
                new() {
                    Zipcode = "66460",
                    ExteriorNumber = "934",
                    InteriorNumber = "",
                    Street = "Av. Las Puentes",
                    Neighborhood = "Las Puentes 7o Sector",
                    City = "San Nicolás de los Garza",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.7458212,
                    Longitude = -100.2700866,
                },
                new() {
                    Zipcode = "66440",
                    ExteriorNumber = "S/n",
                    InteriorNumber = "",
                    Street = "Av. Aceros",
                    Neighborhood = "Col. Nuevo Mezquital",
                    City = "San Nicolás de los Garza",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.7477499,
                    Longitude = -100.2399072,
                },
                new() {
                    Zipcode = "66417",
                    ExteriorNumber = "528",
                    InteriorNumber = "",
                    Street = "Pedro F. Quintanilla",
                    Neighborhood = "La Nogalera 1er Sector",
                    City = "San Nicolás de los Garza",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.7640899,
                    Longitude = -100.2744481,
                },
                new() {
                    Zipcode = "66378",
                    ExteriorNumber = "233",
                    InteriorNumber = "",
                    Street = "Mar Rojo",
                    Neighborhood = "La Aurora",
                    City = "Santa Catarina",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.672975,
                    Longitude = -100.4543961,
                },
                new() {
                    Zipcode = "66350",
                    ExteriorNumber = "652",
                    InteriorNumber = "",
                    Street = "Calle Miguel Hidalgo",
                    Neighborhood = "",
                    City = "Santa Catarina",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6677318,
                    Longitude = -100.4601163,
                },
                new() {
                    Zipcode = "66358",
                    ExteriorNumber = "608",
                    InteriorNumber = "",
                    Street = "Araucaria",
                    Neighborhood = "Zimix Sector Leones",
                    City = "Santa Catarina",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6809399,
                    Longitude = -100.4686253,
                },
                new() {
                    Zipcode = "66358",
                    ExteriorNumber = "",
                    InteriorNumber = "",
                    Street = "Manuel Ordoñez",
                    Neighborhood = "Sin Nombre de Col 1",
                    City = "Santa Catarina",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6813412,
                    Longitude = -100.4836637,
                },
                new() {
                    Zipcode = "66358",
                    ExteriorNumber = "716",
                    InteriorNumber = "",
                    Street = "Popocatépetl",
                    Neighborhood = "Cordilleras del Virrey",
                    City = "Santa Catarina",
                    State = "Nuevo León",
                    Country = "México",
                    Notes = GetRandomHowToArriveNotes(),
                    Latitude = 25.6747344,
                    Longitude = -100.4888874,
                },
            ];
        }

        public static List<UserAddress> GenerateUserAddresses()
        {
            List<UserAddress> userAddresses = [];
            int numberOfAddresses = random.Next(1, 4);

            var addresses = GetAddresses();

            for (int i = 0; i < numberOfAddresses; i++)
            {
                if (addresses.Count == 0) break;
                int addressIndex = random.Next(addresses.Count);
                userAddresses.Add(new () { Address = addresses[addressIndex] });
                addresses.RemoveAt(addressIndex);
            }

            userAddresses.First().IsMain = true;

            return userAddresses;
        }

        public static List<DoctorClinic> GenerateDoctorClinics()
        {
            List<DoctorClinic> doctorClinics = [];
            int count = random.Next(1, 4);

            var clinics = GetAddresses();

            foreach (var item in clinics)
            {
                item.Name = GetRandomClinicName();
                item.Description = GetRandomClinicDescription();
            }

            for (int i = 0; i < count; i++)
            {
                if (clinics.Count == 0) break;
                int addressIndex = random.Next(clinics.Count);
                doctorClinics.Add(new () { Clinic = clinics[addressIndex] });
                clinics.RemoveAt(addressIndex);
            }


            doctorClinics.First().IsMain = true;

            return doctorClinics;
        }

        public static Address GenerateRandomAddress()
        {
            
            return new Address
            {
                Zipcode = random.Next(10000, 99999).ToString(),
                ExteriorNumber = random.Next(1, 1000).ToString(),
                Street = GetRandomStreet(),
                Neighborhood = GetRandomNeighborhood(),
                City = GetRandomCity(),
                State = "Nuevo León",
                Notes = GetRandomHowToArriveNotes(),
                Country = "Mexico",
            };
        }

        public static string GetRandomState()
        {
            string[] state = [
                "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", 
                "Ciudad de México", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", 
                "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos", "Nayarit", 
                "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", 
                "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
            ];

            return state[random.Next(state.Length)];
        }

        public static string GetRandomClinicName()
        {
            string[] data = [
                "Clínica Médica", "Hospital", "Centro de Salud", "Consultorio Médico", "Clínica de Especialidades", "Centro Médico",
                "Hospital General", "Hospital de Especialidades", "Hospital Pediátrico", "Hospital Materno Infantil", "Hospital de la Mujer",
                "Hospital de la Niñez", "Hospital de la Tercera Edad", "Hospital de la Mujer", "Hospital de la Tercera Edad", "Hospital de la Mujer",
                "Hospital de la Tercera Edad", "Hospital de la Mujer", "Hospital de la Tercera Edad", "Hospital de la Mujer", "Hospital de la Tercera Edad",
                "Hospital de la Mujer", "Hospital de la Tercera Edad", "Hospital de la Mujer", "Hospital de la Tercera Edad", "Hospital de la Mujer",
            ];

            return data[random.Next(data.Length)];
        }

        public static string GetRandomClinicDescription()
        {
            string[] data = [
                "Clínica especializada en medicina general y familiar. Atención de urgencias, consultas médicas y estudios de laboratorio.",
                "Hospital de especialidades médicas. Consultas con médicos especialistas en diversas áreas de la medicina.",
                "Centro de salud con atención médica integral. Consultas médicas, estudios de laboratorio y farmacia.",
                "Consultorio médico con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Clínica de especialidades médicas. Consultas con médicos especialistas en diversas áreas de la medicina.",
                "Centro médico con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Hospital general con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Hospital de especialidades médicas. Consultas con médicos especialistas en diversas áreas de la medicina.",
                "Hospital pediátrico con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Hospital materno infantil con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Hospital de la mujer con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Hospital de la niñez con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Hospital de la tercera edad con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Hospital de la mujer con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Hospital de la tercera edad con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Hospital de la mujer con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Hospital de la tercera edad con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Hospital de la mujer con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Hospital de la tercera edad con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
                "Hospital de la mujer con atención de urgencias y consultas médicas. Médicos generales y especialistas.",
            ];

            return data[random.Next(data.Length)];
        }

        public static string GetRandomNeighborhood()
        {
            string[] neightborhood = [
                "Condesa", "Polanco", "Santa Fe", "Coyoacán", "San Ángel", "Zona Rosa", 
                "Roma", "Del Valle", "Nápoles", "Juárez", "Tlatelolco", "Pedregal", 
                "Chapultepec", "Lomas de Chapultepec", "La Roma", "Lindavista", "Zapopan", "Tlaquepaque", 
                "Providencia", "Centro Histórico (CDMX)", "Centro Histórico (Puebla)", 
                "San Pedro Garza García", "Monterrey Centro", "Barrio Antiguo", "Guadalupe Inn", "Anzures", "Santa María la Ribera", 
                "San Rafael", "Escandón", "Narvarte", "Balcones de Galerías", "Miravalle", "Bosques de las Lomas",
                "San Jerónimo", "Aguacaliente", "Tecamachalco", "Hacienda del Valle", "San Nicolás", "Valle Oriente",
                "Fundadores", "Obispado", "Paseo de las Mitras", "Las Cumbres", "Vista Hermosa", "Jardines del Pedregal", 
                "Lomas Verdes", "Bosque Real", "Santa Úrsula", "Cuajimalpa", "Mixcoac", "Churubusco"
            ];

            return neightborhood[random.Next(neightborhood.Length)];
        }

        public static string GetRandomStreet()
        {
            string[] street = [
                "Avenida Revolución", "Calle Hidalgo", "Paseo de la Reforma",
                "Avenida Juárez", "Avenida Universidad", "Calle Independencia",
                "Avenida Insurgentes", "Calle Morelos", "Avenida Patriotismo",
                "Calle Zaragoza", "Avenida de los Insurgentes", "Calle Libertad",
                "Avenida Chapultepec", "Calle Allende", "Avenida Constituyentes",
                "Avenida Paseo de la Reforma", "Avenida Aquiles Serdán", "Calle Madero",
                "Avenida División del Norte", "Calle Guerrero", "Calle 5 de Mayo",
                "Avenida Balderas", "Calle Vicente Guerrero", "Avenida Cuauhtémoc",
                "Avenida Paseo de las Palmas", "Calle Ignacio Zaragoza", "Avenida Río Churubusco",
                "Avenida Paseo de Tláhuac", "Calle Álvaro Obregón", "Avenida Santa Fe",
                "Avenida Miguel Ángel de Quevedo", "Calle Francisco I. Madero", "Avenida Tlalpan",
                "Avenida Coyoacán", "Calle Emiliano Zapata", "Avenida de los Maestros",
                "Avenida Vasco de Quiroga", "Calle Mariano Escobedo", "Avenida San Jerónimo",
                "Avenida México", "Calle José María Pino Suárez", "Avenida Ferrocarril Hidalgo",
                "Avenida Canal de Miramontes", "Calle Dr. José María Vertiz", "Avenida Río Mixcoac",
                "Calle Miguel Hidalgo", "Avenida Periférico", "Calle Benito Juárez",
                "Avenida Ermita Iztapalapa", "Calle Venustiano Carranza"
            ];

            return street[random.Next(street.Length)];
        }

        public static string GetRandomHowToArriveNotes()
        {
            string[] notes = [
                "Ubicado cerca de la plaza central, fácilmente identificable por la gran fuente al frente. Accesible vía líneas de autobús 5, 12 y 21.",
                "Adyacente al parque de la ciudad. Busque un edificio azul con puerta roja. Estacionamiento disponible en la parte trasera.",
                "A tres cuadras de la estación principal de tren, gire a la izquierda en la librería y es el segundo edificio a la derecha.",
                "Frente a la antigua catedral. La dirección está en una casa amarilla con techo verde, al lado de un pequeño café.",
                "Cerca del centro comercial del centro. Accesible por metro (Línea Azul), salga en la estación 'Calle del Mercado'.",
                "Justo a la salida de la autopista, salida 14. Busque un edificio alto de vidrio con un letrero al frente. Amplio estacionamiento disponible.",
                "En el distrito universitario, al lado de la biblioteca. Un gran mural en el costado del edificio facilita su identificación.",
                "Tome la lanzadera desde la plaza principal y bájese en 'Callejón del Jardín'. La dirección es la tercera casa a la izquierda, con una cerca blanca.",
                "Cerca del frente fluvial. El edificio tiene un gran cartel en la parte superior y está frente a un popular restaurante de mariscos.",
                "En la esquina de la Quinta y la Principal, justo arriba de la panadería. La entrada está en la calle Principal, marcada con un toldo verde.",
                "A dos cuadras del monumento histórico, junto a la farmacia grande. Visible por el mural de arte callejero en la fachada.",
                "Detrás del hospital central, cerca de la parada del autobús número 30. La entrada está por la calle lateral, junto a una papelería.",
                "En la zona comercial, sobre la avenida principal. Frente a la tienda de ropa, al lado de un cajero automático.",
                "Cerca de la estación de bomberos, en la esquina con un semáforo. Hay un quiosco de revistas justo enfrente.",
                "Al final de la calle de adoquines, pasando el puente pequeño. Reconocible por un gran árbol de jacarandas al frente.",
                "Junto a la escuela primaria, en una calle con adoquines. Hay un mural de la Virgen de Guadalupe en la pared del costado.",
                "Frente al supermercado, en una calle tranquila. Busque la casa con la puerta de hierro forjado y un pequeño jardín delantero.",
                "Al lado de la plaza de mercado, donde se celebra el tianguis los fines de semana. Es la casa con tejas rojas.",
                "En la colonia industrial, cerca de la fábrica de textiles. Siga la calle hasta ver un edificio de ladrillo rojo.",
                "Cerca del museo de arte local, en una calle estrecha. La dirección tiene una pequeña fuente en el jardín delantero.",
                "A una cuadra del parque ecológico, rodeado de árboles. Hay una panadería en la esquina con olor a pan recién horneado.",
                "Al final de la avenida, pasando el centro comercial. Busque el edificio con un letrero luminoso en el techo.",
                "Cerca de la terminal de autobuses, en una calle con varios cafés. El edificio tiene balcones con flores.",
                "En la zona residencial, al lado de un parque con cancha de fútbol. La casa tiene una reja negra y un buzón azul.",
                "Frente a la clínica, en una calle con muchos árboles. Hay un estacionamiento público justo al lado.",
                "En el barrio antiguo, cerca de la iglesia de San Juan. Busque la calle empedrada con faroles antiguos.",
                "Al lado del gimnasio, en una calle ancha. La dirección está marcada con un número grande sobre la puerta.",
                "En la colonia moderna, cerca de la torre de oficinas. Busque un edificio con una entrada de vidrio y un lobby amplio.",
                "A tres cuadras del cine, en una zona con muchas tiendas. La dirección está al lado de una heladería famosa.",
                "Cerca del centro de convenciones, en una calle con palmeras. El edificio tiene una fachada de piedra y balcones de hierro."
            ];

            return notes[random.Next(notes.Length)];
        }

        public static string GetRandomCity()
        {
            string[] cities = [
                "Mexico City", "Guadalajara", "Monterrey", "Puebla", "Toluca", "Tijuana", "León", "Ciudad Juárez", "Torreón", 
                "San Luis Potosí", "Querétaro", "Mérida", "Mexicali", "Aguascalientes", "Tampico", "Cuernavaca", "Acapulco", "Chihuahua", 
                "Morelia", "Saltillo", "Veracruz", "Villahermosa", "Reynosa", "Hermosillo", "Culiacán", "Guanajuato", "Durango", 
                "Oaxaca", "Zacatecas", "Tuxtla Gutiérrez", "Ensenada", "Valle de Bravo", "Nuevo Laredo", "Campeche", "La Paz", "Cancún", 
                "Playa del Carmen", "Cozumel", "Puerto Vallarta", "Los Cabos", "Mazatlán", "Irapuato", "Tlaxcala", "Xalapa", "Celaya", 
                "Pachuca", "Orizaba", "Matamoros", "San Cristóbal de las Casas", "Loreto", "San Miguel de Allende"
            ];

            return cities[random.Next(cities.Length)];
        }

        public static readonly MedicalLicenseDocument medicalLicenseDocument = new()
        {
            Document = new() {
                Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1724262123/Mediverse/C%C3%A9dula%20Profesional%20%28Desarrollo%29/Formato_C%C3%A9dula_Profesional_M%C3%A9dica_falso_r3igrb.pdf",
                Size = 350000,
                PublicId = "Formato_Cédula_Profesional_Médica_falso_r3igrb"
            }
        };

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