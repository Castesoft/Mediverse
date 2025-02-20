using MainService.Models.Entities;

namespace MainService.Models.Helpers;
public static class Utils
{
    private static readonly Random random = new();

    /// <summary>
    /// Genera un número de cédula aleatorio de la longitud especificada.
    /// </summary>
    /// <param name="length">La longitud del número de cédula.</param>
    /// <returns>Un string que representa un número de cédula aleatorio.</returns>
    public static string GenerateRandomLicenseNumber()
    {
        return new string(Enumerable.Repeat("0123456789", 7)
                                    .Select(s => s[random.Next(s.Length)])
                                    .ToArray());
    }

    public static UserMedicalLicense CreateUserMedicalLicense(List<Specialty> specialties) =>
        new() {
            IsMain = true,
            MedicalLicense = new() {
                LicenseNumber = GenerateRandomLicenseNumber(),
                SpecialtyLicense = GenerateRandomLicenseNumber(),
                MedicalLicenseSpecialty = new(specialties[random.Next(specialties.Count)].Id),
                MedicalLicenseDocument = new() {
                    Document = new() {
                        Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1724262123/Mediverse/C%C3%A9dula%20Profesional%20%28Desarrollo%29/Formato_C%C3%A9dula_Profesional_M%C3%A9dica_falso_r3igrb.pdf",
                        Size = 350000,
                        PublicId = "Formato_Cédula_Profesional_Médica_falso_r3igrb"
                    }
                },
            }
        };
    
    
    /// <summary>
    /// Helper method that maps a Stripe PaymentIntent status string to your PaymentStatus enum.
    /// </summary>
    public static PaymentStatus MapStripeStatusToPaymentStatus(string stripeStatus)
    {
        return stripeStatus.ToLower() switch
        {
            "requires_payment_method" => PaymentStatus.RequiresPaymentMethod,
            "requires_confirmation" => PaymentStatus.RequiresConfirmation,
            "requires_action" => PaymentStatus.RequiresAction,
            "processing" => PaymentStatus.Processing,
            "requires_capture" => PaymentStatus.RequiresCapture,
            "succeeded" => PaymentStatus.Succeeded,
            "canceled" => PaymentStatus.Canceled,
            "refunded" => PaymentStatus.Refunded,
            _ => PaymentStatus.Processing
        };
    }


    // from the number of paymentMethodTypes that come in as a parameter to 1, select randomly one and create a DoctorPaymentMethodType
    public static List<DoctorPaymentMethodType> CreateDoctorPaymentMethodTypes(List<PaymentMethodType> paymentMethodTypes)
    {
        int count = random.Next(1, paymentMethodTypes.Count + 1);
         List<PaymentMethodType> shuffledPaymentMethodTypes = paymentMethodTypes.OrderBy(x => random.Next()).ToList();

         List<PaymentMethodType> selectedPaymentMethodTypes = shuffledPaymentMethodTypes.Take(count).ToList();

        var doctorPaymentMethodTypes = selectedPaymentMethodTypes.Select(pm => new DoctorPaymentMethodType(pm.Id)).ToList();

        return doctorPaymentMethodTypes;
    }

    public static List<DoctorWorkSchedule> CreateDoctorWorkSchedules()
    {
        return [
            // Monday to Friday
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Monday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(9, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Monday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Monday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Monday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(13, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Monday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(13, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(14, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Monday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(15, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(16, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Monday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(16, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(17, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Monday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(17, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(18, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Tuesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(9, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Tuesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Tuesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Tuesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(13, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Tuesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(13, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(14, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Tuesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(15, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(16, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Tuesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(16, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(17, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Tuesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(17, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(18, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Wednesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(9, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Wednesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Wednesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Wednesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(13, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Wednesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(13, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(14, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Wednesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(15, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(16, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Wednesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(16, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(17, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Wednesday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(17, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(18, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Thursday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(9, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Thursday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Thursday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Thursday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(13, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Thursday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(13, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(14, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Thursday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(15, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(16, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Thursday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(16, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(17, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Thursday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(17, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(18, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Friday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(9, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Friday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Friday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Friday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(13, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Friday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(13, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(14, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Friday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(15, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(16, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Friday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(16, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(17, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Friday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(17, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(18, 0, 0))
                }
            },
            // Saturday and Sunday
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Saturday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(9, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Saturday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Saturday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Saturday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(13, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Sunday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(9, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Sunday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Sunday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(11, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0))
                }
            },
            new() {
                WorkSchedule = new() {
                    DayOfWeek = (int)DayOfWeek.Sunday,
                    StartTime = TimeOnly.FromTimeSpan(new TimeSpan(12, 0, 0)),
                    EndTime = TimeOnly.FromTimeSpan(new TimeSpan(13, 0, 0))
                }
            }
        ];
    }
}