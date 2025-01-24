using System.Text.RegularExpressions;
using MainService.Models.Entities;

namespace MainService.Models.Helpers
{
    public static class StripePaymentMethods
    {
        private static readonly Random Random = new();

        private static readonly List<PaymentMethod> PaymentMethods =
        [
            new("Visa", "pm_card_visa"),
            new("Visa", "pm_card_visa_debit"),
            new("Mastercard", "pm_card_mastercard"),
            new("Mastercard", "pm_card_mastercard_debit"),
            new("Mastercard", "pm_card_mastercard_prepaid"),
            new("American Express", "pm_card_amex"),
        ];

        private static PaymentMethod GetRandomPaymentMethod() => PaymentMethods[Random.Next(PaymentMethods.Count)];

        public static List<UserPaymentMethod> GetUserPaymentMethods(AppUser user)
        {
            PaymentMethod paymentMethod = GetRandomPaymentMethod();

            List<UserPaymentMethod> userPaymentMethod = [];

            for (int i = 0; i < Random.Next(2, 6); i++)
            {
                userPaymentMethod.Add(new UserPaymentMethod
                {
                    PaymentMethod = new PaymentMethod
                    {
                        DisplayName = $"{user.FirstName} {user.LastName}".ToUpper(),
                        Brand = paymentMethod.Brand,
                        Country = "MX",
                        ExpirationMonth = Random.Next(1, 13),
                        ExpirationYear = Random.Next(2025, 2030),
                        Last4 = Random.Next(1000, 9999).ToString(),
                        StripePaymentMethodId = paymentMethod.StripePaymentMethodId,
                    }
                });
            }

            userPaymentMethod[Random.Next(userPaymentMethod.Count)].IsMain = true;

            return userPaymentMethod;
        }
    }

    public static partial class SeedEventPayments
    {
        private static readonly Random Random = new();

        private static PaymentMethodType GetRandomPaymentMethodType()
        {
            var paymentMethods = SeedData.paymentMethodTypes.ToList();
            return paymentMethods[Random.Next(paymentMethods.Count)];
        }

        // 50/50 que un servicio vaya a tener al menos un pago
        // si si fue pagado, 1-3 pagos
        // para cada uno de los pagos, seleccionar aleatoriamente el tipo de pago
        // 50/50 si el total de los pagos es igual al total del servicio/evento

        // code review
        // asignar el EventPaymentStatus adecuado

        // cuando el pago sea con tarjeta ..... en el seeding los usuarios ya tienen métodos de pago (crédito/débito)?

        public static List<EventPayment> GetEventPayments(Event @event, AppUser user)
        {
            var hasPayment = Random.Next(0, 2) > 0;

            if (!hasPayment) return [];

            int paymentCount = Random.Next(1, 4);
            decimal? totalAmount = @event.EventService.Service.Price;
            decimal? remainingAmount = totalAmount;
            List<EventPayment> payments = [];

            if (totalAmount.HasValue && remainingAmount.HasValue)
            {
                for (int i = 0; i < paymentCount; i++)
                {
                    bool isLastPayment = i == paymentCount - 1;
                    decimal? paymentAmount = isLastPayment
                        ? remainingAmount // En el último pago, asignar todo el monto restante
                        : Random.Next(1,
                            (int)remainingAmount); // Asegurarse de que el valor mínimo sea menor que el valor máximo

                    var paymentMethodType = GetRandomPaymentMethodType();

                    var payment = new EventPayment
                    {
                        Payment = new Payment
                        {
                            Amount = paymentAmount,
                            PaymentPaymentMethodType = new PaymentPaymentMethodType
                            {
                                PaymentMethodTypeId = paymentMethodType.Id
                            }
                        }
                    };

                    if (paymentMethodType.Name == "Tarjeta de Crédito" || paymentMethodType.Name == "Tarjeta de Débito")
                    {
                        if (user.UserPaymentMethods.Any()) // Verificar si hay métodos de pago disponibles
                        {
                            payment.Payment.PaymentPaymentMethod = new PaymentPaymentMethod
                            {
                                PaymentMethodId = user.UserPaymentMethods
                                    .ElementAt(Random.Next(user.UserPaymentMethods.Count)).PaymentMethodId
                            };
                        }
                        else
                        {
                            // Manejar el caso en el que no haya métodos de pago disponibles
                            payment.Payment.PaymentPaymentMethod = null!; // o alguna lógica alternativa
                        }
                    }

                    payments.Add(payment);
                    remainingAmount -= paymentAmount;
                }
            }

            return payments;
        }


        public static PaymentStatus GetPaymentStatus(Event @event)
        {
            if (@event.EventPayments.Count == 0) return SeedData.paymentStatuses.First(x => x.Name == "Pendiente");

            var totalPayments = @event.EventPayments.Sum(x => x.Payment.Amount);
            var totalService = @event.EventService.Service.Price;

            if (totalPayments == totalService) return SeedData.paymentStatuses.First(x => x.Name == "Pagado");
            if (totalPayments > 0) return SeedData.paymentStatuses.First(x => x.Name == "Parcialmente Pagado");

            return SeedData.paymentStatuses.First(x => x.Name == "Pendiente");
        }
    }

    public static partial class SeedData
    {
        private static readonly Random Random = new();

        public static readonly IEnumerable<string> roles =
        [
            "Admin",
            "Staff",
            "Patient",
            "Doctor",
            "Nurse",
        ];

        public static readonly List<OrderStatus> orderStatuses =
        [
            new("Pending", "Pendiente", "El pedido está pendiente de confirmación."),
            new("Completed", "Completado", "El pedido ha sido completado con éxito."),
            new("Cancelled", "Cancelado", "El pedido ha sido cancelado.")
        ];

        public static readonly List<DeliveryStatus> deliveryStatuses =
        [
            new("Pending", "Pendiente", "El pedido está pendiente de confirmación."),
            new("Processing", "Procesando", "El pedido está siendo procesado."),
            new("InProgress", "En Progreso", "El pedido está en progreso."),
            new("Delivered", "Entregado", "El pedido ha sido entregado."),
            new("Cancelled", "Cancelado", "El pedido ha sido cancelado.")
        ];

        public static readonly List<Substance> Substances =
        [
            new("tobacco", "Tabaco",
                "Sustancia comúnmente usada que puede causar adicción y afecta los pulmones y el sistema respiratorio."),
            new("alcohol", "Alcohol",
                "Sustancia legal en muchos países que puede causar dependencia y afecta el hígado y el sistema nervioso."),
            new("marijuana", "Marihuana",
                "Droga recreativa que afecta la percepción y la coordinación, legal en algunos países o estados."),
            new("cocaine", "Cocaína",
                "Droga ilegal que estimula el sistema nervioso central, creando dependencia y afectando la salud cardiovascular."),
            new("inhalants", "Inhalantes",
                "Sustancias químicas inhaladas que alteran el estado mental y pueden causar daño a los órganos internos."),
            new("caffeine", "Cafeína",
                "Sustancia estimulante que se encuentra en bebidas como café y refrescos, puede causar dependencia leve."),
            new("other", "Otros (anfetaminas, metanfetaminas, heroína, cristal)",
                "Sustancias ilegales y altamente adictivas que afectan el sistema nervioso central y la salud en general.")
        ];

        public static readonly List<ConsumptionLevel> ConsumptionLevels =
        [
            new("one_time", "Único", "El paciente ha consumido la sustancia solo una vez."),
            new("mild", "Leve",
                "El paciente consume la sustancia ocasionalmente, sin impacto significativo en la salud."),
            new("moderate", "Moderado",
                "El paciente consume la sustancia de forma regular, con algún impacto en la salud o comportamiento."),
            new("severe", "Severo",
                "El paciente consume la sustancia con frecuencia, afectando gravemente su salud o vida cotidiana."),
            new("dependent", "Dependencia",
                "El paciente es dependiente de la sustancia y tiene dificultad para controlar su uso.")
        ];

        public static readonly List<Disease> Diseases =
        [
            new("cancer", "Cáncer",
                "Enfermedad que implica el crecimiento incontrolado de células anormales en el cuerpo."),
            new("diabetes", "Diabetes", "Enfermedad que afecta la forma en que el cuerpo usa el azúcar en la sangre."),
            new("hypertension", "Hipertensión",
                "Presión arterial elevada, una afección común que puede aumentar el riesgo de problemas cardiacos."),
            new("cholesterol", "Colesterol",
                "Altos niveles de colesterol en la sangre, lo que puede llevar a problemas de salud, como enfermedades cardíacas."),
            new("heart_issues", "Problemas cardiacos (infartos)",
                "Condiciones que afectan al corazón, como ataques cardíacos."),
            new("major_surgeries", "Intervenciones quirúrgicas mayores",
                "Cirugías que involucran grandes procedimientos médicos."),
            new("allergies_asthma", "Alergias o asma",
                "Reacciones exageradas del sistema inmune a ciertos alérgenos o enfermedades respiratorias como el asma."),
            new("tremor", "Temblor", "Movimientos involuntarios, comúnmente en las manos u otras partes del cuerpo."),
            new("miscarriages", "Abortos (solo para mujeres)",
                "Pérdida del embarazo, puede ser espontánea o inducida."),
            new("eating_disorders", "Trastornos alimenticios",
                "Condiciones relacionadas con comportamientos alimenticios anormales, como anorexia o bulimia."),
            new("weight_issues", "Sobrepeso o desnutrición",
                "Condiciones donde el peso corporal está fuera de los rangos saludables, ya sea por exceso o por falta de nutrientes."),
            new("psychiatric_disorders", "Psiquiátricos (depresión, ansiedad, bipolar, etc.)",
                "Trastornos mentales que afectan el estado de ánimo, el comportamiento y el pensamiento."),
            new("dementias", "Demencias (Parkinson, Alzheimer)",
                "Enfermedades que implican la pérdida progresiva de la memoria y otras funciones cognitivas."),
            new("memory_issues", "Problemas de memoria", "Dificultades para recordar información y eventos."),
            new("attention_issues", "Problemas de atención",
                "Dificultad para concentrarse o mantener la atención en actividades."),
            new("intellectual_disabilities", "Retraso mental, Síndrome de Down",
                "Condiciones que causan discapacidades intelectuales y de desarrollo."),
            new("other", "Otros (tiroides, gastrointestinales, ginecológicas, hepáticas, respiratorias, renales, etc.)",
                "Otras enfermedades que incluyen el sistema endocrino, digestivo, reproductivo, hepático, respiratorio o renal.")
        ];

        public static readonly List<MaritalStatus> MaritalStatuses =
        [
            new("single", "Soltero",
                "El paciente no ha contraído matrimonio y no está en una relación de pareja formal."),
            new("domestic_partnership", "Unión libre", "El paciente vive en pareja sin un vínculo matrimonial legal."),
            new("married", "Casado", "El paciente ha contraído matrimonio legalmente."),
            new("remarried", "Segundas nupcias",
                "El paciente está casado nuevamente después de un matrimonio anterior."),
            new("separated", "Separado", "El paciente está separado de su cónyuge, pero no legalmente divorciado."),
            new("divorced", "Divorciado", "El paciente ha terminado legalmente un matrimonio anterior."),
            new("widowed", "Viudo", "El paciente ha perdido a su cónyuge por fallecimiento."),
            new("other", "Otro (especificar)", "El paciente tiene un estado civil distinto, que puede especificar.")
        ];

        public static readonly List<RelativeType> RelativeTypes =
        [
            new("partner", "Pareja", "La persona es la pareja sentimental del paciente."),
            new("husband", "Esposo", "La persona es el esposo del paciente."),
            new("wife", "Esposa", "La persona es la esposa del paciente."),
            new("son", "Hijo", "La persona es el hijo varón del paciente."),
            new("daughter", "Hija", "La persona es la hija del paciente."),
            new("father", "Padre", "La persona es el padre del paciente."),
            new("mother", "Madre", "La persona es la madre del paciente."),
            new("brother", "Hermano", "La persona es el hermano del paciente."),
            new("sister", "Hermana", "La persona es la hermana del paciente."),
            new("grandfather", "Abuelo", "La persona es el abuelo del paciente."),
            new("grandmother", "Abuela", "La persona es la abuela del paciente."),
            new("grandson", "Nieto", "La persona es el nieto del paciente."),
            new("granddaughter", "Nieta", "La persona es la nieta del paciente."),
            new("uncle", "Tío", "La persona es el tío del paciente."),
            new("aunt", "Tía", "La persona es la tía del paciente."),
            new("cousin_male", "Primo", "La persona es el primo del paciente."),
            new("cousin_female", "Prima", "La persona es la prima del paciente."),
            new("nephew", "Sobrino", "La persona es el sobrino del paciente."),
            new("niece", "Sobrina", "La persona es la sobrina del paciente."),
            new("brother_in_law", "Cuñado", "La persona es el cuñado del paciente."),
            new("sister_in_law", "Cuñada", "La persona es la cuñada del paciente."),
            new("father_in_law", "Suegro", "La persona es el suegro del paciente."),
            new("mother_in_law", "Suegra", "La persona es la suegra del paciente."),
            new("other", "Otro (especificar)",
                "La persona tiene una relación distinta con el paciente, y se puede especificar.")
        ];


        public static readonly List<Occupation> Occupations =
        [
            new("employee", "Empleado", "El paciente trabaja como empleado en una empresa u organización."),
            new("entrepreneur", "Empresario", "El paciente es dueño o dirige su propio negocio."),
            new("merchant", "Comerciante", "El paciente se dedica a la compra-venta de productos o servicios."),
            new("teacher", "Profesor", "El paciente trabaja en la docencia, en cualquier nivel educativo."),
            new("engineer", "Ingeniero", "El paciente es un profesional en alguna rama de la ingeniería."),
            new("doctor", "Médico", "El paciente ejerce como profesional de la salud en la medicina."),
            new("lawyer", "Abogado", "El paciente trabaja como profesional en el área del derecho."),
            new("nurse", "Enfermero", "El paciente se dedica a la atención de pacientes como enfermero."),
            new("architect", "Arquitecto", "El paciente trabaja como arquitecto en el diseño y construcción."),
            new("accountant", "Contador", "El paciente se dedica a la contabilidad y gestión financiera."),
            new("driver", "Chofer", "El paciente trabaja como conductor, transportando personas o mercancías."),
            new("worker", "Obrero", "El paciente realiza trabajos manuales o industriales."),
            new("farmer", "Agricultor", "El paciente se dedica a la producción agrícola."),
            new("housewife", "Ama de casa", "El paciente se dedica a las labores del hogar."),
            new("student", "Estudiante", "El paciente se encuentra estudiando de manera formal."),
            new("unemployed", "Desempleado", "El paciente actualmente no tiene un empleo."),
            new("retired", "Pensionado / Jubilado", "El paciente está retirado y recibe una pensión o jubilación."),
            new("other", "Otra (especificar)",
                "El paciente tiene una ocupación distinta a las listadas, y puede especificarla.")
        ];

        public static readonly List<EducationLevel> EducationLevels =
        [
            new("no_education", "Sin escolaridad", "El paciente no ha recibido educación formal."),
            new("primary_incomplete", "Primaria incompleta", "El paciente no ha terminado la educación primaria."),
            new("primary_complete", "Primaria completa", "El paciente ha completado la educación primaria."),
            new("secondary_incomplete", "Secundaria incompleta",
                "El paciente no ha terminado la educación secundaria."),
            new("secondary_complete", "Secundaria completa", "El paciente ha completado la educación secundaria."),
            new("highschool_incomplete", "Preparatoria incompleta",
                "El paciente no ha terminado la educación preparatoria o equivalente."),
            new("highschool_complete", "Preparatoria completa",
                "El paciente ha completado la educación preparatoria o equivalente."),
            new("technical_degree", "Técnico superior",
                "El paciente ha completado un nivel técnico superior, como una carrera técnica."),
            new("bachelor_incomplete", "Licenciatura incompleta",
                "El paciente no ha terminado la educación universitaria de nivel licenciatura."),
            new("bachelor_complete", "Licenciatura completa",
                "El paciente ha completado una licenciatura universitaria."),
            new("masters_incomplete", "Maestría incompleta",
                "El paciente no ha terminado estudios de posgrado a nivel de maestría."),
            new("masters_complete", "Maestría completa",
                "El paciente ha completado estudios de posgrado a nivel de maestría."),
            new("phd_incomplete", "Doctorado incompleto", "El paciente no ha terminado estudios de doctorado."),
            new("phd_complete", "Doctorado completo", "El paciente ha completado estudios de doctorado.")
        ];


        public static readonly List<ColorBlindness> ColorBlindnesses =
        [
            new("Acromatopsia", "El paciente no puede ver colores, solo escala de grises."),
            new("Monocromatismo", "El paciente solo puede ver un color o tonos de un solo color."),
            new("Dicromatismo - Protanopia", "El paciente no puede ver colores rojos."),
            new("Dicromatismo - Deuteranopia", "El paciente no puede ver colores verdes."),
            new("Dicromatismo - Tritanopia", "El paciente no puede ver colores azules."),
            new("Tricromatismo anómalo - Protanomalía", "El paciente tiene una percepción anormal del color rojo."),
            new("Tricromatismo anómalo - Deuteranomalía", "El paciente tiene una percepción anormal del color verde."),
            new("Tricromatismo anómalo - Tritanomalía", "El paciente tiene una percepción anormal del color azul."),
            new("Otro (especificar)",
                "El paciente tiene una alteración de la visión de los colores distinta a las listadas, y puede especificarla.")
        ];

        public static readonly IEnumerable<MedicalInsuranceCompany> medicalInsuranceCompanies =
        [
            new()
            {
                Name = "AXA Seguros",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "axa_seguros_ergezf",
                        Url = new Uri(
                            "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/axa_seguros_ergezf.png")
                    }
                }
            },
            new()
            {
                Name = "GNP Seguros",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "gnp_seguros_xpttil",
                        Url = new Uri(
                            "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/gnp_seguros_xpttil.png")
                    }
                }
            },
            new()
            {
                Name = "Aseguradora Interacciones",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "aseguradora_interacciones_drezf3",
                        Url =
                            new Uri(
                                "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/aseguradora_interacciones_drezf3.png")
                    }
                }
            },
            new()
            {
                Name = "Seguros Banorte",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "seguros_banorte_fsrra6",
                        Url = new Uri(
                            "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/seguros_banorte_fsrra6.png")
                    }
                }
            },
            new()
            {
                Name = "Seguros Monterrey New York Life",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "seguros_monterrey_uzj3ui",
                        Url =
                            new Uri(
                                "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198863/seguros_monterrey_uzj3ui.png")
                    }
                }
            },
            new()
            {
                Name = "Mapfre México",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "mapfre_mexico_cmg4u2",
                        Url = new Uri(
                            "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/mapfre_mexico_cmg4u2.png")
                    }
                }
            },
            new()
            {
                Name = "Metlife",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "metlife_hzbave",
                        Url = new Uri(
                            "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/metlife_hzbave.png")
                    }
                }
            },
            new()
            {
                Name = "Seguros Atlas",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "seguros_atlas_jo69el",
                        Url = new Uri(
                            "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/seguros_atlas_jo69el.png")
                    }
                }
            },
            new()
            {
                Name = "RSA",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "rsa_xfjykh",
                        Url = new Uri("https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/rsa_xfjykh.png")
                    }
                }
            },
            new()
            {
                Name = "Bupa Seguros",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "bupa_seguros_qru9sa",
                        Url = new Uri(
                            "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/bupa_seguros_qru9sa.png")
                    }
                }
            },
            new()
            {
                Name = "Seguros Multiva",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "seguros_multiva_qmcj0e",
                        Url = new Uri(
                            "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/seguros_multiva_qmcj0e.png")
                    }
                }
            },
            new()
            {
                Name = "Seguros Inbursa",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "seguros_inbursa_en5tbk",
                        Url = new Uri(
                            "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/seguros_inbursa_en5tbk.png")
                    }
                }
            },
            new()
            {
                Name = "Allianz",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "allianz_azpevk",
                        Url = new Uri(
                            "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/allianz_azpevk.png")
                    }
                }
            },
            new()
            {
                Name = "La Latino Seguros",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "la_latino_seguros_kxisgu",
                        Url =
                            new Uri(
                                "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/la_latino_seguros_kxisgu.png")
                    }
                }
            },
            new()
            {
                Name = "Seguros BX+",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "seguros_bx_vjbqpz",
                        Url = new Uri(
                            "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198862/seguros_bx_vjbqpz.png")
                    }
                }
            },
            new()
            {
                Name = "Plan Seguro",
                MedicalInsuranceCompanyPhoto = new MedicalInsuranceCompanyPhoto
                {
                    Photo = new Photo
                    {
                        PublicId = "plan_seguro_w6ehun",
                        Url = new Uri(
                            "https://res.cloudinary.com/dzzbpajio/image/upload/v1724198861/plan_seguro_w6ehun.png")
                    }
                }
            }
        ];

        public static readonly IEnumerable<PaymentStatus> paymentStatuses =
        [
            new("Pagado", "#28a745", "El pago ha sido completado con éxito."),
            new("Parcialmente Pagado", "#ffc107", "El pago ha sido parcialmente completado."),
            new("Reembolsado", "#dc3545", "El pago ha sido reembolsado."),
            new("Pendiente", "#007bff", "El pago está pendiente de confirmación."),
            new("Cancelado", "#6c757d", "El pago ha sido cancelado."),
            new("Fallido", "#dc3545", "El pago ha fallado."),
            new("Procesando", "#17a2b8", "El pago está siendo procesado."),
            new("Enviado", "#28a745", "El pago ha sido enviado."),
            new("Entregado", "#28a745", "El pago ha sido entregado."),
            new("Completado", "#28a745", "El pago ha sido completado."),
            new("En Espera", "#ffc107", "El pago está en espera."),
            new("En Proceso", "#17a2b8", "El pago está en proceso."),
        ];

        public static readonly IEnumerable<PaymentMethodType> paymentMethodTypes =
        [
            new() { Name = "Tarjeta de Crédito" },
            new() { Name = "Tarjeta de Débito" },
            new() { Name = "Transferencia Bancaria" },
            new() { Name = "Efectivo" },
            new() { Name = "Paypal" }
        ];

        public static IEnumerable<AppRole> GetRolesWithPermissions()
        {
            List<AppRole> rolesWithPermissions =
            [
                new("Admin", new Dictionary<string, string>
                {
                    { "View Users", "Can view user details" },
                    { "Manage Users", "Can create, update, and delete users" },
                    { "View Roles", "Can view role details" },
                    { "Manage Roles", "Can create, update, and delete roles" },
                    { "View Permissions", "Can view permission details" },
                    { "Manage Permissions", "Can create, update, and delete permissions" }
                }),
                new("Staff", new Dictionary<string, string>
                {
                    { "View orders", "Este permiso habilita al usuario para ver los pedidos" },
                    { "Manage orders", "Este permiso habilita al usuario para gestionar los pedidos" },
                    { "View products", "Este permiso habilita al usuario para ver los productos" },
                    { "Manage products", "Este permiso habilita al usuario para gestionar los productos" },
                    { "View billing", "Este permiso habilita al usuario para ver la facturación" },
                    { "Manage billing", "Este permiso habilita al usuario para gestionar la facturación" },
                }),
                new("Patient", new Dictionary<string, string>
                {
                    { "View events", "Este permiso habilita al usuario para ver las citas" },
                    { "Manage events", "Este permiso habilita al usuario para gestionar las citas" },
                    { "View medical records", "Este permiso habilita al usuario para ver los registros médicos" },
                    {
                        "Manage medical records",
                        "Este permiso habilita al usuario para gestionar los registros médicos"
                    },
                }),
                new("Doctor", new Dictionary<string, string>
                {
                    { "View events", "Este permiso habilita al usuario para ver las citas" },
                    { "Manage events", "Este permiso habilita al usuario para gestionar las citas" },
                    { "View patients", "Este permiso habilita al usuario para ver los pacientes" },
                    { "Manage patients", "Este permiso habilita al usuario para gestionar los pacientes" },
                    { "View medical records", "Este permiso habilita al usuario para ver los registros médicos" },
                    {
                        "Manage medical records",
                        "Este permiso habilita al usuario para gestionar los registros médicos"
                    },
                }),
                new("Nurse", new Dictionary<string, string>
                {
                    { "View events", "Este permiso habilita al usuario para ver las citas" },
                    { "Manage events", "Este permiso habilita al usuario para gestionar las citas" },
                    { "View patients", "Este permiso habilita al usuario para ver los pacientes" },
                    { "Manage patients", "Este permiso habilita al usuario para gestionar los pacientes" },
                    { "View medical records", "Este permiso habilita al usuario para ver los registros médicos" },
                    {
                        "Manage medical records",
                        "Este permiso habilita al usuario para gestionar los registros médicos"
                    },
                }),
            ];

            return rolesWithPermissions;
        }

        public static readonly List<Product> products =
        [
            new Product
            {
                Name = "Metformina",
                Description = "Tratamiento de la diabetes tipo 2.",
                Price = 200,
                Dosage = 850,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://chedrauimx.vtexassets.com/arquivos/ids/32138501-800-auto?v=638560236813070000&width=800&height=auto&aspect=true"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "Pharma Inc.",
                LotNumber = "A12345",
            },

            new Product
            {
                Name = "Lisinopril",
                Description = "Tratamiento de la hipertensión.",
                Price = 150,
                Dosage = 10,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://i0.wp.com/prixz.com/salud/wp-content/uploads/2020/06/lisinopril.jpg?fit=720%2C440&ssl=1"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "Health Corp.",
                LotNumber = "B23456",
            },

            new Product
            {
                Name = "Ibuprofeno",
                Description = "Antiinflamatorio y analgésico.",
                Price = 100,
                Dosage = 400,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://www.benavides.com.mx/media/catalog/product/cache/13134524bf2f7c32f6bea508eba7e730/2/0/20231002_1042110.jpg"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "Wellness Labs",
                LotNumber = "C34567",
            },

            new Product
            {
                Name = "Paracetamol",
                Description = "Analgésico y antipirético.",
                Price = 50,
                Dosage = 500,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://www.soriana.com/on/demandware.static/-/Sites-soriana-grocery-master-catalog/default/dw83b430ea/images/product/7500093754574_A.jpg"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "Medicines Co.",
                LotNumber = "D45678",
            },

            new Product
            {
                Name = "Atorvastatina",
                Description = "Reducción del colesterol.",
                Price = 180,
                Dosage = 20,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url = new Uri(
                                "https://heka.mx/wp-content/uploads/1970/01/atorvastatina-psicofarma-20mg-heka.jpg"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "CardioHealth",
                LotNumber = "E56789",
            },

            new Product
            {
                Name = "Amoxicilina",
                Description = "Antibiótico de amplio espectro.",
                Price = 120,
                Dosage = 500,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://resources.sanborns.com.mx/imagenes-sanborns-ii/1200/7501349021570.jpg?scale=500&qlty=75"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "BioPharma",
                LotNumber = "F67890",
            },

            new Product
            {
                Name = "Amlodipino",
                Description = "Tratamiento de la hipertensión y angina.",
                Price = 140,
                Dosage = 5,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://resources.sanborns.com.mx/imagenes-sanborns-ii/1200/7502216793378.jpg?scale=500&qlty=75"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "HeartMeds",
                LotNumber = "G78901",
            },

            new Product
            {
                Name = "Omeprazol",
                Description = "Tratamiento de la acidez y úlceras gástricas.",
                Price = 90,
                Dosage = 20,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://resources.sanborns.com.mx/imagenes-sanborns-ii/1200/7501277093472.jpg?scale=500&qlty=75"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "DigestiveHealth",
                LotNumber = "H89012",
            },

            new Product
            {
                Name = "Simvastatina",
                Description = "Reducción del colesterol.",
                Price = 170,
                Dosage = 20,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://www.movil.farmaciasguadalajara.com/wcsstore/FGCAS/wcs/products/1187074_A_1280_AL.jpg"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "CardioMeds",
                LotNumber = "I90123",
            },

            new Product
            {
                Name = "Levotiroxina",
                Description = "Tratamiento del hipotiroidismo.",
                Price = 130,
                Dosage = 100,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/ifa_celtics_levotiroxina_tab_100mcg_c100.png"),
                        }
                    }
                ],
                Unit = "mcg",
                Manufacturer = "ThyroidCare",
                LotNumber = "J01234",
            },

            new Product
            {
                Name = "Clopidogrel",
                Description = "Prevención de eventos trombóticos.",
                Price = 250,
                Dosage = 75,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://resources.sears.com.mx/medios-plazavip/s2/23552/3904489/62d92f55d4bce-03c29096-bcb9-45f2-b8d2-69637743f15d-1600x1600.jpg?scale=500&qlty=75"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "AntiClot",
                LotNumber = "K12345",
            },

            new Product
            {
                Name = "Furosemida",
                Description = "Diurético para la hipertensión y edema.",
                Price = 110,
                Dosage = 40,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://i5.walmartimages.com.mx/gr/images/product-images/img_large/00750157390847L.jpg?odnHeight=612&odnWidth=612&odnBg=FFFFFF"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "DiureticMeds",
                LotNumber = "L23456",
            },

            new Product
            {
                Name = "Sertralina",
                Description = "Antidepresivo.",
                Price = 220,
                Dosage = 50,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url = new Uri("https://sanorim.mx/cdn/shop/files/Setralina.jpg?v=1686540790"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "MoodStabilizers",
                LotNumber = "M34567",
            },

            new Product
            {
                Name = "Losartán",
                Description = "Tratamiento de la hipertensión.",
                Price = 160,
                Dosage = 50,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://chedrauimx.vtexassets.com/arquivos/ids/32159730-800-auto?v=638560300075600000&width=800&height=auto&aspect=true"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "BloodPressureInc",
                LotNumber = "N45678",
            },

            new Product
            {
                Name = "Salbutamol",
                Description = "Broncodilatador para el asma.",
                Price = 130,
                Dosage = 100,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://www.fahorro.com/media/catalog/product/7/5/7501043100595.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=265&width=265&canvas=265:265"),
                        }
                    }
                ],
                Unit = "mcg",
                Manufacturer = "RespiraMeds",
                LotNumber = "O56789",
            },

            new Product
            {
                Name = "Prednisona",
                Description = "Corticosteroide antiinflamatorio.",
                Price = 200,
                Dosage = 5,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_prednisona_tabs_5mg_20.png"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "AntiInflammatories",
                LotNumber = "P67890",
            },

            new Product
            {
                Name = "Tramadol",
                Description = "Analgésico para el dolor moderado a severo.",
                Price = 300,
                Dosage = 150,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://i5.walmartimages.com.mx/gr/images/product-images/img_large/00750138454555L.jpg"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "PainRelief",
                LotNumber = "Q78901",
            },

            new Product
            {
                Name = "Cetirizina",
                Description = "Antihistamínico para alergias.",
                Price = 80,
                Dosage = 10,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://www.fahorro.com/media/catalog/product/7/5/7502223706156.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "AllergyMeds",
                LotNumber = "R89012",
            },

            new Product
            {
                Name = "Insulina Glargina",
                Description = "Tratamiento de la diabetes.",
                Price = 400,
                Dosage = 100,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://www.movil.farmaciasguadalajara.com/wcsstore/FGCAS/wcs/products/1234889_A_1280_AL.jpg"),
                        }
                    }
                ],
                Unit = "U/ml",
                Manufacturer = "DiabetesCare",
                LotNumber = "90123",
            },

            new Product
            {
                Name = "Digoxina",
                Description = "Tratamiento de insuficiencia cardíaca.",
                Price = 210,
                Dosage = 1,
                ProductPhotos =
                [
                    new ProductPhoto
                    {
                        IsMain = true,
                        Photo = new Photo
                        {
                            Url =
                                new Uri(
                                    "https://representacionland.com/wp-content/uploads/2023/03/Digoxina-025mg-tab-estuche-x-10tag-LAND.jpg"),
                        }
                    }
                ],
                Unit = "mg",
                Manufacturer = "HeartMeds",
                LotNumber = "T01234",
            }

        ];

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

            string[] areaCodes =
            [
                /* Monterrey */ "81", /* Guadalajara */ "33", /* Ciudad de México */ "55", /* Puebla */
                "222", /* Tijuana */ "664",
                /* León */ "477", /* Juárez */ "656", /* Torreón */ "871", /* Querétaro */ "442", /* Mérida */
                "999", /* Mexicali */ "686",
                /* Aguascalientes */ "449", /* Cuernavaca */ "777", /* Saltillo */ "844", /* Chihuahua */
                "614", /* Morelia */ "443",
                /* Veracruz */ "229", /* Tampico */ "833", /* Tuxtla Gutiérrez */ "961", /* Oaxaca */
                "951", /* Culiacán */ "667",
                /* Durango */ "618", /* Matamoros */ "868", /* Tepic */ "311", /* Campeche */ "981", /* Colima */
                "312", /* Zacatecas */ "492",
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
            List<Photo> malePhotos =
            [
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730539/TraceTrust/SeedData/Profile%20pictures/R_az6eso.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730500/TraceTrust/SeedData/Profile%20pictures/aNWjR7MB_400x400_dmxq0i.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730491/TraceTrust/SeedData/Profile%20pictures/312e53eb2c71a023b7de3d1ea989a2c8_wgc0yu.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730486/TraceTrust/SeedData/Profile%20pictures/OIP_zb9ytk.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730473/TraceTrust/SeedData/Profile%20pictures/628ba018745087.5603efd91665d_b1djcp.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730469/TraceTrust/SeedData/Profile%20pictures/dBRXFFE_xnmhjz.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730463/TraceTrust/SeedData/Profile%20pictures/1071625_ibstgs.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730455/TraceTrust/SeedData/Profile%20pictures/a2de3954697c636276192afea0a6f661_tb2mln.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730440/TraceTrust/SeedData/Profile%20pictures/aeecc22a67dac7987a80ac0724658493_jnsgit.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730426/TraceTrust/SeedData/Profile%20pictures/avatar_be2hdh.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803500/TraceTrust/SeedData/Profile%20pictures/d8a01e34926bdb7eb9e1fb506d0aea1b_gpy8sx.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803591/TraceTrust/SeedData/Profile%20pictures/1eea135a4738f2a0c06813788620e055_wki0ea.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803615/TraceTrust/SeedData/Profile%20pictures/R_stwpdc.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803659/TraceTrust/SeedData/Profile%20pictures/unnamed_h0wdih.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803694/TraceTrust/SeedData/Profile%20pictures/7910485066_10a1e5e586_b_eqvtjw.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803754/TraceTrust/SeedData/Profile%20pictures/R_f5nggp.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803830/TraceTrust/SeedData/Profile%20pictures/b32c9c4854abc5925c2d64ee046f02f7_mtaurl.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803860/TraceTrust/SeedData/Profile%20pictures/OIP_zowcac.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803888/TraceTrust/SeedData/Profile%20pictures/sean-headshot-img_dlpwwj.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803905/TraceTrust/SeedData/Profile%20pictures/unnamed_uaq37l.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689803935/TraceTrust/SeedData/Profile%20pictures/CharlieKryzinski_mvhbgo.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804012/TraceTrust/SeedData/Profile%20pictures/unnamed_njppnj.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804090/TraceTrust/SeedData/Profile%20pictures/R_v6vs9l.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804122/TraceTrust/SeedData/Profile%20pictures/1541016168011_rfqkkn.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804193/TraceTrust/SeedData/Profile%20pictures/unnamed_gd52u0.jpg"),
                    Name = "Male photo", PublicId = "public id", Size = 1
                },
            ];

            List<Photo> femalePhotos =
            [
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730527/TraceTrust/SeedData/Profile%20pictures/de64801f0275c1ab2ea5a9e2bb3ce7bc_h3ayls.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730510/TraceTrust/SeedData/Profile%20pictures/ukxi7n1rojh21_y76zhr.webp"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730503/TraceTrust/SeedData/Profile%20pictures/sarah-parmenter_fxwaf5.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730483/TraceTrust/SeedData/Profile%20pictures/b3c9dfa78c7a93bbd84f9c8fcbcc2a0e_jmdg8j.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730480/TraceTrust/SeedData/Profile%20pictures/R_wnx3tp.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689730435/TraceTrust/SeedData/Profile%20pictures/e8b271169214323595f5155a649884d2_jursx3.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804271/TraceTrust/SeedData/Profile%20pictures/OIP_fofq6a.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804396/TraceTrust/SeedData/Profile%20pictures/random_cute_girls_44_aghdvf.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804474/TraceTrust/SeedData/Profile%20pictures/3f234bb3dd39909c65f17a7e90ed89e1--legs_g5oevf.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804557/TraceTrust/SeedData/Profile%20pictures/1578203e47c1b4b660ba9d285f2bb04c_pwfl8b.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804574/TraceTrust/SeedData/Profile%20pictures/ali-brustofski-389394_bbwnmc.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804600/TraceTrust/SeedData/Profile%20pictures/00414ea5f11bf8702420c53465d21a97_hyc7kr.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804629/TraceTrust/SeedData/Profile%20pictures/485cff16aa860056913312a72f6929ee_400x400_fw55rn.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804681/TraceTrust/SeedData/Profile%20pictures/43702d5333b8c3d9ddf6cc4bb3c94347_vldhf5.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804704/TraceTrust/SeedData/Profile%20pictures/961dd1d383fde2983fd7299241b63390_gtg8lq.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804721/TraceTrust/SeedData/Profile%20pictures/7553dbe1a813ac534a1d88ec3ac07c2e_yni6cu.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804742/TraceTrust/SeedData/Profile%20pictures/93334e95100fc3ff057b725a79a5cd35_nvn0qx.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804765/TraceTrust/SeedData/Profile%20pictures/Katie-Johnson-340_rsjeiq.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804788/TraceTrust/SeedData/Profile%20pictures/9cc4f9f6-a21a-43c7-af8b-8612bc3a507c_b8sstb.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804881/TraceTrust/SeedData/Profile%20pictures/d6aa977a680777bdc1a11a757f98cda2_l9zzaq.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804945/TraceTrust/SeedData/Profile%20pictures/09cd873240bdd728ba2fb70696b6ffcc_iosjtz.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689804989/TraceTrust/SeedData/Profile%20pictures/10414496_10207078099334972_7467359939825351730_n_wexpdo.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689805028/TraceTrust/SeedData/Profile%20pictures/vMLq2EWw_400x400_mnxcpy.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689805065/TraceTrust/SeedData/Profile%20pictures/photo-47510-75216_lygx3w.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
                new()
                {
                    Url = new Uri(
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1689805086/TraceTrust/SeedData/Profile%20pictures/R_b08yyj.jpg"),
                    Name = "Female photo", PublicId = "public id", Size = 1
                },
            ];

            Random random = new();

            if (sex == "Masculino")
            {
                return malePhotos[random.Next(malePhotos.Count)];
            }

            int randomIndex = random.Next(femalePhotos.Count);
            return femalePhotos[randomIndex];
        }

        public static string GetRandomFirstName(string sex)
        {
            Random random = new();

            string[] maleNames =
            [
                "Juan", "José", "Antonio", "Francisco", "Jesús", "Manuel", "Miguel", "Pedro", "Alejandro", "Jorge",
                "Rafael",
                "Fernando", "Roberto", "Sergio", "Eduardo", "Julio", "Ricardo", "Carlos", "Raúl", "Enrique", "Ramón",
                "Gabriel",
                "Mario", "Luis", "Alberto", "Arturo", "Hugo", "Gerardo", "Guillermo", "Oscar", "Felipe", "Mauricio",
                "Rubén",
                "Alfredo", "Ignacio", "Cesar", "Gustavo", "Salvador", "Victor", "Adrian", "Ernesto", "Isaac", "Diego",
                "Javier", "Rodrigo",
                "Pablo", "Daniel", "Armando",
            ];

            string[] femaleNames =
            [
                "María", "Carmen", "Josefa", "Ana", "Isabel", "Francisca", "Dolores", "Teresa", "Pilar", "Laura",
                "Juana",
                "Lucía", "Elena", "Sofía", "Paula", "Marina", "Irene", "Inés", "Patricia", "Rosa", "Marta", "Beatriz",
                "Sara", "Lourdes", "Cristina", "Susana", "Alicia", "Luisa", "Silvia", "Rocio", "Gloria", "Alejandra",
                "Gabriela",
                "Guadalupe", "Adriana", "Graciela", "Fernanda", "Cecilia", "Alma", "Clara", "Martha", "Yolanda",
                "Estela", "Miriam", "Olga",
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

            string[] lastNames =
            [
                "García", "Martínez", "Rodríguez", "Hernández", "López", "González", "Pérez", "Sánchez", "Ramírez",
                "Torres", "Flores",
                "Rivera", "Gómez", "Díaz", "Reyes", "Morales", "Cruz", "Ortiz", "Gutiérrez", "Chávez", "Ramos",
                "Guzmán", "Ruiz",
                "Alvarez", "Moreno", "Mendoza", "Castillo", "Jiménez", "Rojas", "Vargas", "Romero", "Silva", "Muñoz",
                "Aguilar", "Paredes",
                "Cervantes", "Luna", "Medina", "Navarro", "Campos", "Arias", "Juárez", "Mireles", "Escobar", "Ponce",
                "Carrillo", "Castañeda",
                "Aguirre", "Núñez", "Vega", "Rangel", "Salazar", "Zamora", "Solís", "Peña",
            ];

            return lastNames[random.Next(lastNames.Length)];
        }

        public static string GetRandomEmailDomain()
        {
            var random = new Random();

            string[] emailDomains =
            [
                "gmail", "hotmail", "yahoo", "outlook", "icloud", "aol", "protonmail", "zoho", "yandex", "tutanota",
                "mail", "gmx",
                "mailfence", "fastmail", "mail", "mail2world", "hushmail", "runbox", "countermail", "mailbox",
                "mailinator", "guerrillamail", "temp-mail", "10minutemail",
                "maildrop", "mailnesia", "mailinator",
            ];

            return emailDomains[random.Next(emailDomains.Length)];
        }

        public static string GetRandomMedicalSpecialty()
        {
            Random random = new();

            string[] specialties =
            [
                "Cardiología", "Dermatología", "Endocrinología", "Gastroenterología", "Geriatría", "Ginecología",
                "Hematología", "Infectología",
                "Medicina deportiva", "Medicina interna", "Nefrología", "Neumología", "Neurología", "Nutriología",
                "Oftalmología", "Oncología",
                "Ortopedia", "Otorrinolaringología", "Pediatría", "Psiquiatría", "Reumatología", "Traumatología",
                "Urología",
            ];

            return specialties[random.Next(specialties.Length)];
        }

        public static string GetRandomMedicalJobPosts()
        {
            Random random = new();

            string[] jobPosts =
            [
                "Médico general", "Médico especialista en cardiología", "Médico especialista en dermatología",
                "Médico especialista en endocrinología",
                "Médico especialista en gastroenterología", "Médico especialista en geriatría",
                "Médico especialista en ginecología",
                "Médico especialista en hematología", "Médico especialista en infectología",
                "Médico especialista en medicina deportiva",
                "Médico especialista en medicina interna", "Médico especialista en nefrología",
                "Médico especialista en neumología",
                "Médico especialista en neurología", "Médico especialista en nutriología",
                "Médico especialista en oftalmología",
                "Médico especialista en oncología", "Médico especialista en ortopedia",
                "Médico especialista en otorrinolaringología",
                "Médico especialista en pediatría", "Médico especialista en psiquiatría",
                "Médico especialista en reumatología",
                "Médico especialista en traumatología", "Médico especialista en urología",
            ];

            return jobPosts[random.Next(jobPosts.Length)];
        }

        public static string ConstructFullEmailAddress(string firstName, string lastName, string emailDomain, int index)
        {
            return $@"{ReplaceSpecialChars(firstName)}.{ReplaceSpecialChars(lastName)}.demo{index}@{emailDomain}.com"
                .ToLower();
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

                user.UserPaymentMethods.AddRange(StripePaymentMethods.GetUserPaymentMethods(user));

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
                    user.UserPhoto = new UserPhoto { Photo = GetRandomProfilePicture(sex) };

                users.Add(user);
            }

            return users;
        }

        public static List<Address> GetAddresses()
        {
            return
            [
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
                new Address
                {
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
            int numberOfAddresses = Random.Next(1, 4);

            var addresses = GetAddresses();

            for (int i = 0; i < numberOfAddresses; i++)
            {
                if (addresses.Count == 0) break;
                int addressIndex = Random.Next(addresses.Count);
                userAddresses.Add(new UserAddress { Address = addresses[addressIndex] });
                addresses.RemoveAt(addressIndex);
            }

            userAddresses.First().IsMain = true;

            return userAddresses;
        }

        public static List<DoctorClinic> GenerateDoctorClinics()
        {
            List<DoctorClinic> doctorClinics = [];
            int count = Random.Next(1, 4);

            var clinics = GetAddresses();

            foreach (var item in clinics)
            {
                item.Name = GetRandomClinicName();
                item.Description = GetRandomClinicDescription();
                item.ClinicLogo = new ClinicLogo
                {
                    Photo = new Photo
                    {
                        Url = GetRandomClinicLogo(),
                    }
                };
            }

            for (int i = 0; i < count; i++)
            {
                if (clinics.Count == 0) break;
                int addressIndex = Random.Next(clinics.Count);
                doctorClinics.Add(new DoctorClinic { Clinic = clinics[addressIndex] });
                clinics.RemoveAt(addressIndex);
            }


            doctorClinics.First().IsMain = true;

            return doctorClinics;
        }

        public static Address GenerateRandomAddress()
        {
            return new Address
            {
                Zipcode = Random.Next(10000, 99999).ToString(),
                ExteriorNumber = Random.Next(1, 1000).ToString(),
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
            string[] state =
            [
                "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua",
                "Ciudad de México", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero",
                "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos", "Nayarit",
                "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
                "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
            ];

            return state[Random.Next(state.Length)];
        }

        public static string GetRandomClinicName()
        {
            string[] data =
            [
                "Clínica Médica", "Hospital", "Centro de Salud", "Consultorio Médico", "Clínica de Especialidades",
                "Centro Médico",
                "Hospital General", "Hospital de Especialidades", "Hospital Pediátrico", "Hospital Materno Infantil",
                "Hospital de la Mujer",
                "Hospital de la Niñez", "Hospital de la Tercera Edad", "Hospital de la Mujer",
                "Hospital de la Tercera Edad", "Hospital de la Mujer",
                "Hospital de la Tercera Edad", "Hospital de la Mujer", "Hospital de la Tercera Edad",
                "Hospital de la Mujer", "Hospital de la Tercera Edad",
                "Hospital de la Mujer", "Hospital de la Tercera Edad", "Hospital de la Mujer",
                "Hospital de la Tercera Edad", "Hospital de la Mujer",
            ];

            return data[Random.Next(data.Length)];
        }

        public static Uri GetRandomClinicLogo()
        {
            Uri[] data =
            [
                new("https://upload.wikimedia.org/wikipedia/commons/0/02/LogoClinicaFirma.jpg"),
                new("https://upload.wikimedia.org/wikipedia/commons/3/3e/Logo-Medway.jpg"),
                new(
                    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a61fcb2f-59fb-4c77-bdc1-3aaf3b16ac6a/d26f8p5-c468201e-d69b-4bab-bd5a-c988b35d1b73.jpg/v1/fill/w_600,h_621,q_75,strp/logo_clinica_veterinaria_by_rvr03_d26f8p5-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2E2MWZjYjJmLTU5ZmItNGM3Ny1iZGMxLTNhYWYzYjE2YWM2YVwvZDI2ZjhwNS1jNDY4MjAxZS1kNjliLTRiYWItYmQ1YS1jOTg4YjM1ZDFiNzMuanBnIiwiaGVpZ2h0IjoiPD02MjEiLCJ3aWR0aCI6Ijw9NjAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLndhdGVybWFyayJdLCJ3bWsiOnsicGF0aCI6Ilwvd21cL2E2MWZjYjJmLTU5ZmItNGM3Ny1iZGMxLTNhYWYzYjE2YWM2YVwvcnZyMDMtNC5wbmciLCJvcGFjaXR5Ijo5NSwicHJvcG9ydGlvbnMiOjAuNDUsImdyYXZpdHkiOiJjZW50ZXIifX0.ouPtKJlISqnzpfObqeYdbjnmfj-Gv2uBLiKsOmpPAKc"),
                new("https://upload.wikimedia.org/wikipedia/commons/4/4a/Cl%C3%ADnica_Foios.jpg"),
                new("https://upload.wikimedia.org/wikipedia/commons/a/a0/LOGO_clinica_holistica.jpg"),
            ];

            return data[Random.Next(data.Length)];
        }

        public static string GetRandomClinicDescription()
        {
            string[] data =
            [
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

            return data[Random.Next(data.Length)];
        }

        public static string GetRandomNeighborhood()
        {
            string[] neightborhood =
            [
                "Condesa", "Polanco", "Santa Fe", "Coyoacán", "San Ángel", "Zona Rosa",
                "Roma", "Del Valle", "Nápoles", "Juárez", "Tlatelolco", "Pedregal",
                "Chapultepec", "Lomas de Chapultepec", "La Roma", "Lindavista", "Zapopan", "Tlaquepaque",
                "Providencia", "Centro Histórico (CDMX)", "Centro Histórico (Puebla)",
                "San Pedro Garza García", "Monterrey Centro", "Barrio Antiguo", "Guadalupe Inn", "Anzures",
                "Santa María la Ribera",
                "San Rafael", "Escandón", "Narvarte", "Balcones de Galerías", "Miravalle", "Bosques de las Lomas",
                "San Jerónimo", "Aguacaliente", "Tecamachalco", "Hacienda del Valle", "San Nicolás", "Valle Oriente",
                "Fundadores", "Obispado", "Paseo de las Mitras", "Las Cumbres", "Vista Hermosa",
                "Jardines del Pedregal",
                "Lomas Verdes", "Bosque Real", "Santa Úrsula", "Cuajimalpa", "Mixcoac", "Churubusco"
            ];

            return neightborhood[Random.Next(neightborhood.Length)];
        }

        public static string GetRandomStreet()
        {
            string[] street =
            [
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

            return street[Random.Next(street.Length)];
        }

        public static string GetRandomHowToArriveNotes()
        {
            string[] notes =
            [
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

            return notes[Random.Next(notes.Length)];
        }

        public static string GetRandomCity()
        {
            string[] cities =
            [
                "Mexico City", "Guadalajara", "Monterrey", "Puebla", "Toluca", "Tijuana", "León", "Ciudad Juárez",
                "Torreón",
                "San Luis Potosí", "Querétaro", "Mérida", "Mexicali", "Aguascalientes", "Tampico", "Cuernavaca",
                "Acapulco", "Chihuahua",
                "Morelia", "Saltillo", "Veracruz", "Villahermosa", "Reynosa", "Hermosillo", "Culiacán", "Guanajuato",
                "Durango",
                "Oaxaca", "Zacatecas", "Tuxtla Gutiérrez", "Ensenada", "Valle de Bravo", "Nuevo Laredo", "Campeche",
                "La Paz", "Cancún",
                "Playa del Carmen", "Cozumel", "Puerto Vallarta", "Los Cabos", "Mazatlán", "Irapuato", "Tlaxcala",
                "Xalapa", "Celaya",
                "Pachuca", "Orizaba", "Matamoros", "San Cristóbal de las Casas", "Loreto", "San Miguel de Allende"
            ];

            return cities[Random.Next(cities.Length)];
        }

        public static readonly MedicalLicenseDocument medicalLicenseDocument = new()
        {
            Document = new Document
            {
                Url =
                    "https://res.cloudinary.com/dmjdskgd4/image/upload/v1724262123/Mediverse/C%C3%A9dula%20Profesional%20%28Desarrollo%29/Formato_C%C3%A9dula_Profesional_M%C3%A9dica_falso_r3igrb.pdf",
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
}