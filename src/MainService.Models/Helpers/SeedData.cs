using MainService.Models.Entities;

namespace MainService.Models.Helpers;
public static class SeedData
{
    public static readonly IEnumerable<string> roles = [
        "Admin",
        "Staff",
        "Patient",
        "Doctor",
        "Nurse",
    ];

    public static IEnumerable<AppRole> getRolesWithPermissions()
    {
        List<AppRole> rolesWithPermissions = [
            new("Admin", new() {
                { "View Users", "Can view user details" },
                { "Manage Users", "Can create, update, and delete users" },
                { "View Roles", "Can view role details" },
                { "Manage Roles", "Can create, update, and delete roles" },
                { "View Permissions", "Can view permission details" },
                { "Manage Permissions", "Can create, update, and delete permissions" }
            }),
            new("Staff", new() {
                { "View orders", "Este permiso habilita al usuario para ver los pedidos" },
                { "Manage orders", "Este permiso habilita al usuario para gestionar los pedidos" },
                { "View products", "Este permiso habilita al usuario para ver los productos" },
                { "Manage products", "Este permiso habilita al usuario para gestionar los productos" },
                { "View billing", "Este permiso habilita al usuario para ver la facturación" },
                { "Manage billing", "Este permiso habilita al usuario para gestionar la facturación" },
            }),
            new("Patient", new() {
                { "View appointments", "Este permiso habilita al usuario para ver las citas" },
                { "Manage appointments", "Este permiso habilita al usuario para gestionar las citas" },
                { "View medical records", "Este permiso habilita al usuario para ver los registros médicos" },
                { "Manage medical records", "Este permiso habilita al usuario para gestionar los registros médicos" },
            }),
            new("Doctor", new() {
                { "View appointments", "Este permiso habilita al usuario para ver las citas" },
                { "Manage appointments", "Este permiso habilita al usuario para gestionar las citas" },
                { "View patients", "Este permiso habilita al usuario para ver los pacientes" },
                { "Manage patients", "Este permiso habilita al usuario para gestionar los pacientes" },
                { "View medical records", "Este permiso habilita al usuario para ver los registros médicos" },
                { "Manage medical records", "Este permiso habilita al usuario para gestionar los registros médicos" },
            }),
            new("Nurse", new() {
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
    
    public static readonly IEnumerable<Product> products = [
        new("Monitor de presión arterial con pantalla digital de alta precisión",
            "Este monitor de presión arterial es ideal para uso doméstico y profesional, proporcionando lecturas precisas y consistentes. Incluye una pantalla digital fácil de leer y una función de memoria para almacenar varias lecturas."),
                
        new("Termómetro infrarrojo sin contacto para medición de fiebre rápida",
                    "El termómetro infrarrojo sin contacto ofrece una forma higiénica y precisa de medir la temperatura corporal. Su diseño sin contacto reduce el riesgo de contaminación cruzada y es perfecto para su uso en hospitales y clínicas."),
        
        new("Oxímetro de pulso portátil con pantalla OLED para saturación de oxígeno",
                    "El oxímetro de pulso portátil mide rápidamente los niveles de saturación de oxígeno en la sangre y la frecuencia cardíaca. Su pantalla OLED ofrece una visualización clara incluso en condiciones de poca luz."),
        
        new("Nebulizador ultrasónico compacto para tratamiento de enfermedades respiratorias",
                    "Este nebulizador ultrasónico es compacto y portátil, ideal para el tratamiento de enfermedades respiratorias como el asma y la bronquitis. Su tecnología avanzada proporciona una administración eficiente de los medicamentos."),
        
        new("Estetoscopio de doble campana para auscultación precisa y clara",
                    "El estetoscopio de doble campana ofrece una acústica superior para una auscultación precisa. Su diseño ergonómico y ligero lo hace cómodo de usar durante largos periodos."),
        
        new("Glucómetro digital con tiras reactivas para monitoreo de glucosa en sangre",
                    "Este glucómetro digital proporciona resultados rápidos y precisos de los niveles de glucosa en sangre. Incluye tiras reactivas y una memoria integrada para registrar los resultados anteriores."),
        
        new("Báscula digital para el control de peso corporal con función de memoria",
                    "La báscula digital ofrece una medición precisa del peso corporal con una función de memoria para rastrear el progreso a lo largo del tiempo. Es perfecta para uso en clínicas y hogares."),
        
        new("Inhalador de dosis medida para el manejo del asma y otros problemas respiratorios",
                    "El inhalador de dosis medida proporciona una entrega precisa de medicamentos para el manejo del asma y otros problemas respiratorios. Su diseño compacto y portátil lo hace fácil de llevar a cualquier lugar."),
        
        new("Tensiómetro manual aneroide con estetoscopio y brazalete ajustable",
                    "El tensiómetro manual aneroide es una herramienta esencial para medir la presión arterial. Viene con un estetoscopio y un brazalete ajustable para obtener lecturas precisas y consistentes."),
        
        new("Otoscopio de fibra óptica con iluminación LED para exámenes auditivos",
                    "El otoscopio de fibra óptica con iluminación LED proporciona una visualización clara del canal auditivo y el tímpano. Es una herramienta esencial para médicos y enfermeras en el diagnóstico de problemas auditivos."),
        
        new("Silla de ruedas plegable de aluminio ligera y fácil de transportar",
                    "Esta silla de ruedas plegable de aluminio es ligera y fácil de transportar, proporcionando movilidad y comodidad a los pacientes. Su diseño ergonómico incluye reposapiés ajustables y un asiento acolchado."),
        
        new("Bomba de infusión portátil para administración controlada de medicamentos",
                    "La bomba de infusión portátil permite la administración controlada y precisa de medicamentos intravenosos. Su diseño compacto y fácil de usar es ideal para hospitales y atención domiciliaria."),
        
        new("Colchón antiescaras con sistema de alivio de presión ajustable",
                    "El colchón antiescaras está diseñado para prevenir úlceras por presión en pacientes postrados en cama. Su sistema de alivio de presión ajustable proporciona comodidad y soporte óptimos."),
        
        new("Concentrador de oxígeno portátil para terapia de oxígeno de alta eficiencia",
                    "El concentrador de oxígeno portátil proporciona terapia de oxígeno de alta eficiencia para pacientes con enfermedades respiratorias. Su diseño compacto y silencioso lo hace adecuado para uso doméstico y en movimiento."),
        
        new("Electrocardiógrafo portátil de 12 canales con pantalla táctil y almacenamiento de datos",
                    "El electrocardiógrafo portátil de 12 canales ofrece una evaluación precisa de la actividad cardíaca. Su pantalla táctil y capacidad de almacenamiento de datos lo hacen fácil de usar y eficiente para médicos y técnicos."),
        
        new("Desfibrilador externo automático (DEA) con instrucciones de voz para emergencias",
                    "El desfibrilador externo automático (DEA) es una herramienta crucial para emergencias cardíacas. Incluye instrucciones de voz claras para guiar al usuario a través del proceso de desfibrilación."),
        
        new("Muletas ajustables de aluminio con empuñaduras ergonómicas para soporte y movilidad",
                    "Las muletas ajustables de aluminio proporcionan soporte y movilidad a los pacientes con lesiones en las piernas. Sus empuñaduras ergonómicas y altura ajustable garantizan comodidad y facilidad de uso."),
        
        new("Cama hospitalaria eléctrica con ajustes de altura y posiciones múltiples",
                    "La cama hospitalaria eléctrica permite ajustes de altura y posiciones múltiples para la comodidad del paciente. Su diseño robusto y fácil de operar es ideal para hospitales y atención domiciliaria."),
        
        new("Sonda nasogástrica de silicona con lubricación para alimentación enteral",
                    "La sonda nasogástrica de silicona es una herramienta esencial para la alimentación enteral. Su lubricación y diseño flexible permiten una inserción suave y cómoda."),
        
        new("Prótesis ortopédica para miembros inferiores con ajuste personalizado y materiales ligeros",
                    "La prótesis ortopédica para miembros inferiores está diseñada para ofrecer movilidad y soporte. Su ajuste personalizado y materiales ligeros garantizan comodidad y funcionalidad para el usuario.")
    ];

    public static readonly IEnumerable<Service> services = [
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
