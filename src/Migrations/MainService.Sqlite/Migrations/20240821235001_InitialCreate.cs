using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MainService.Sqlite.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Street = table.Column<string>(type: "TEXT", nullable: true),
                    InteriorNumber = table.Column<string>(type: "TEXT", nullable: true),
                    ExteriorNumber = table.Column<string>(type: "TEXT", nullable: true),
                    Neighborhood = table.Column<string>(type: "TEXT", nullable: true),
                    City = table.Column<string>(type: "TEXT", nullable: true),
                    State = table.Column<string>(type: "TEXT", nullable: true),
                    Country = table.Column<string>(type: "TEXT", nullable: true),
                    Zipcode = table.Column<string>(type: "TEXT", nullable: true),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    Latitude = table.Column<double>(type: "REAL", nullable: true),
                    Longitude = table.Column<double>(type: "REAL", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CrossStreet1 = table.Column<string>(type: "TEXT", nullable: true),
                    CrossStreet2 = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FirstName = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    LastName = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Sex = table.Column<string>(type: "TEXT", maxLength: 10, nullable: true),
                    DateOfBirth = table.Column<DateOnly>(type: "TEXT", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastActive = table.Column<DateTime>(type: "TEXT", maxLength: 100, nullable: false),
                    PhoneNumberCountryCode = table.Column<string>(type: "TEXT", maxLength: 5, nullable: true),
                    EmailVerificationCodeHash = table.Column<byte[]>(type: "BLOB", nullable: true),
                    EmailVerificationCodeSalt = table.Column<byte[]>(type: "BLOB", nullable: true),
                    EmailVerificationExpiryTime = table.Column<DateTime>(type: "TEXT", maxLength: 100, nullable: true),
                    PhoneNumberVerificationCodeHash = table.Column<byte[]>(type: "BLOB", nullable: true),
                    PhoneNumberVerificationCodeSalt = table.Column<byte[]>(type: "BLOB", nullable: true),
                    PhoneNumberVerificationExpiryTime = table.Column<DateTime>(type: "TEXT", maxLength: 100, nullable: true),
                    StripeCustomerId = table.Column<string>(type: "TEXT", nullable: true),
                    RFC = table.Column<string>(type: "TEXT", nullable: true),
                    CURP = table.Column<string>(type: "TEXT", nullable: true),
                    CommercialName = table.Column<string>(type: "TEXT", nullable: true),
                    LegalName = table.Column<string>(type: "TEXT", nullable: true),
                    Education = table.Column<string>(type: "TEXT", nullable: true),
                    Post = table.Column<string>(type: "TEXT", nullable: true),
                    UserName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: true),
                    SecurityStamp = table.Column<string>(type: "TEXT", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumber = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Cities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Documents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Url = table.Column<string>(type: "TEXT", nullable: true),
                    PublicId = table.Column<string>(type: "TEXT", nullable: true),
                    Size = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DateFrom = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DateTo = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Link",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Url = table.Column<string>(type: "TEXT", nullable: true),
                    SiteName = table.Column<string>(type: "TEXT", nullable: true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Link", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MedicalInsuranceCompanies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalInsuranceCompanies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MedicalLicenses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LicenseNumber = table.Column<string>(type: "TEXT", nullable: true),
                    SpecialtyLicense = table.Column<string>(type: "TEXT", nullable: true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalLicenses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Neighborhoods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Settlement = table.Column<string>(type: "TEXT", nullable: true),
                    Zipcode = table.Column<string>(type: "TEXT", nullable: true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Neighborhoods", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Total = table.Column<double>(type: "REAL", nullable: false),
                    Subtotal = table.Column<double>(type: "REAL", nullable: false),
                    Discount = table.Column<double>(type: "REAL", nullable: false),
                    Tax = table.Column<double>(type: "REAL", nullable: false),
                    AmountPaid = table.Column<double>(type: "REAL", nullable: false),
                    AmountDue = table.Column<double>(type: "REAL", nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    DeliveryStatus = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PaymentMethods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DisplayName = table.Column<string>(type: "TEXT", nullable: true),
                    Last4 = table.Column<string>(type: "TEXT", nullable: true),
                    Brand = table.Column<string>(type: "TEXT", nullable: true),
                    Country = table.Column<string>(type: "TEXT", nullable: true),
                    ExpirationMonth = table.Column<int>(type: "INTEGER", nullable: false),
                    ExpirationYear = table.Column<int>(type: "INTEGER", nullable: false),
                    StripePaymentMethodId = table.Column<string>(type: "TEXT", nullable: true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentMethods", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PaymentMethodTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentMethodTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Permissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Phone",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PhoneNumber = table.Column<string>(type: "TEXT", nullable: true),
                    CountryCode = table.Column<string>(type: "TEXT", nullable: true),
                    Extension = table.Column<string>(type: "TEXT", nullable: true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Phone", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Photos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Url = table.Column<string>(type: "TEXT", nullable: true),
                    PublicId = table.Column<string>(type: "TEXT", nullable: true),
                    Size = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Photos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Prescriptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ExchangeAmount = table.Column<int>(type: "INTEGER", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prescriptions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Dosage = table.Column<int>(type: "INTEGER", nullable: false),
                    Unit = table.Column<string>(type: "TEXT", nullable: true),
                    Manufacturer = table.Column<string>(type: "TEXT", nullable: true),
                    LotNumber = table.Column<string>(type: "TEXT", nullable: true),
                    Price = table.Column<double>(type: "REAL", nullable: false),
                    Discount = table.Column<double>(type: "REAL", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Price = table.Column<double>(type: "REAL", nullable: false),
                    Discount = table.Column<double>(type: "REAL", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Specialties",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specialties", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "States",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_States", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SubSpecialties",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubSpecialties", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TaxRegime",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Code = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaxRegime", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RoleId = table.Column<int>(type: "INTEGER", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "TEXT", nullable: false),
                    ProviderKey = table.Column<string>(type: "TEXT", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "TEXT", nullable: true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    RoleId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    LoginProvider = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClinicNurses",
                columns: table => new
                {
                    ClinicId = table.Column<int>(type: "INTEGER", nullable: false),
                    NurseId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClinicNurses", x => new { x.NurseId, x.ClinicId });
                    table.ForeignKey(
                        name: "FK_ClinicNurses_Addresses_ClinicId",
                        column: x => x.ClinicId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClinicNurses_AspNetUsers_NurseId",
                        column: x => x.NurseId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorClinics",
                columns: table => new
                {
                    DoctorId = table.Column<int>(type: "INTEGER", nullable: false),
                    ClinicId = table.Column<int>(type: "INTEGER", nullable: false),
                    IsMain = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorClinics", x => new { x.DoctorId, x.ClinicId });
                    table.ForeignKey(
                        name: "FK_DoctorClinics_Addresses_ClinicId",
                        column: x => x.ClinicId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorClinics_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorNurses",
                columns: table => new
                {
                    DoctorId = table.Column<int>(type: "INTEGER", nullable: false),
                    NurseId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorNurses", x => new { x.DoctorId, x.NurseId });
                    table.ForeignKey(
                        name: "FK_DoctorNurses_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorNurses_AspNetUsers_NurseId",
                        column: x => x.NurseId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorPatients",
                columns: table => new
                {
                    DoctorId = table.Column<int>(type: "INTEGER", nullable: false),
                    PatientId = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorPatients", x => new { x.DoctorId, x.PatientId });
                    table.ForeignKey(
                        name: "FK_DoctorPatients_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorPatients_AspNetUsers_PatientId",
                        column: x => x.PatientId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserAddress",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    AddressId = table.Column<int>(type: "INTEGER", nullable: false),
                    IsMain = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsBilling = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAddress", x => new { x.UserId, x.AddressId });
                    table.ForeignKey(
                        name: "FK_UserAddress_Addresses_AddressId",
                        column: x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserAddress_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorEvent",
                columns: table => new
                {
                    DoctorId = table.Column<int>(type: "INTEGER", nullable: false),
                    EventId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorEvent", x => new { x.DoctorId, x.EventId });
                    table.ForeignKey(
                        name: "FK_DoctorEvent_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorEvent_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventClinic",
                columns: table => new
                {
                    EventId = table.Column<int>(type: "INTEGER", nullable: false),
                    ClinicId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventClinic", x => new { x.EventId, x.ClinicId });
                    table.ForeignKey(
                        name: "FK_EventClinic_Addresses_ClinicId",
                        column: x => x.ClinicId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventClinic_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NurseEvent",
                columns: table => new
                {
                    NurseId = table.Column<int>(type: "INTEGER", nullable: false),
                    EventId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NurseEvent", x => new { x.NurseId, x.EventId });
                    table.ForeignKey(
                        name: "FK_NurseEvent_AspNetUsers_NurseId",
                        column: x => x.NurseId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NurseEvent_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientEvent",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "INTEGER", nullable: false),
                    EventId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientEvent", x => new { x.PatientId, x.EventId });
                    table.ForeignKey(
                        name: "FK_PatientEvent_AspNetUsers_PatientId",
                        column: x => x.PatientId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientEvent_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorLinks",
                columns: table => new
                {
                    DoctorId = table.Column<int>(type: "INTEGER", nullable: false),
                    LinkId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorLinks", x => new { x.DoctorId, x.LinkId });
                    table.ForeignKey(
                        name: "FK_DoctorLinks_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorLinks_Link_LinkId",
                        column: x => x.LinkId,
                        principalTable: "Link",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorMedicalInsuranceCompany",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    MedicalInsuranceCompanyId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorMedicalInsuranceCompany", x => new { x.UserId, x.MedicalInsuranceCompanyId });
                    table.ForeignKey(
                        name: "FK_DoctorMedicalInsuranceCompany_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorMedicalInsuranceCompany_MedicalInsuranceCompanies_MedicalInsuranceCompanyId",
                        column: x => x.MedicalInsuranceCompanyId,
                        principalTable: "MedicalInsuranceCompanies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserMedicalInsuranceCompanies",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    MedicalInsuranceCompanyId = table.Column<int>(type: "INTEGER", nullable: false),
                    IsMain = table.Column<bool>(type: "INTEGER", nullable: false),
                    PolicyNumber = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMedicalInsuranceCompanies", x => new { x.UserId, x.MedicalInsuranceCompanyId });
                    table.ForeignKey(
                        name: "FK_UserMedicalInsuranceCompanies_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserMedicalInsuranceCompanies_MedicalInsuranceCompanies_MedicalInsuranceCompanyId",
                        column: x => x.MedicalInsuranceCompanyId,
                        principalTable: "MedicalInsuranceCompanies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicalLicenseDocuments",
                columns: table => new
                {
                    MedicalLicenseId = table.Column<int>(type: "INTEGER", nullable: false),
                    DocumentId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalLicenseDocuments", x => new { x.MedicalLicenseId, x.DocumentId });
                    table.ForeignKey(
                        name: "FK_MedicalLicenseDocuments_Documents_DocumentId",
                        column: x => x.DocumentId,
                        principalTable: "Documents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicalLicenseDocuments_MedicalLicenses_MedicalLicenseId",
                        column: x => x.MedicalLicenseId,
                        principalTable: "MedicalLicenses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserMedicalLicenses",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    MedicalLicenseId = table.Column<int>(type: "INTEGER", nullable: false),
                    IsMain = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMedicalLicenses", x => new { x.UserId, x.MedicalLicenseId });
                    table.ForeignKey(
                        name: "FK_UserMedicalLicenses_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserMedicalLicenses_MedicalLicenses_MedicalLicenseId",
                        column: x => x.MedicalLicenseId,
                        principalTable: "MedicalLicenses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CityNeighborhood",
                columns: table => new
                {
                    CityId = table.Column<int>(type: "INTEGER", nullable: false),
                    NeighborhoodId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CityNeighborhood", x => new { x.CityId, x.NeighborhoodId });
                    table.ForeignKey(
                        name: "FK_CityNeighborhood_Cities_CityId",
                        column: x => x.CityId,
                        principalTable: "Cities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CityNeighborhood_Neighborhoods_NeighborhoodId",
                        column: x => x.NeighborhoodId,
                        principalTable: "Neighborhoods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorOrder",
                columns: table => new
                {
                    DoctorId = table.Column<int>(type: "INTEGER", nullable: false),
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorOrder", x => new { x.DoctorId, x.OrderId });
                    table.ForeignKey(
                        name: "FK_DoctorOrder_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorOrder_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderAddress",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false),
                    AddressId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderAddress", x => new { x.OrderId, x.AddressId });
                    table.ForeignKey(
                        name: "FK_OrderAddress_Addresses_AddressId",
                        column: x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderAddress_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientOrder",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "INTEGER", nullable: false),
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientOrder", x => new { x.PatientId, x.OrderId });
                    table.ForeignKey(
                        name: "FK_PatientOrder_AspNetUsers_PatientId",
                        column: x => x.PatientId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientOrder_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserPaymentMethods",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    PaymentMethodId = table.Column<int>(type: "INTEGER", nullable: false),
                    IsMain = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPaymentMethods", x => new { x.UserId, x.PaymentMethodId });
                    table.ForeignKey(
                        name: "FK_UserPaymentMethods_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserPaymentMethods_PaymentMethods_PaymentMethodId",
                        column: x => x.PaymentMethodId,
                        principalTable: "PaymentMethods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorPaymentMethodTypes",
                columns: table => new
                {
                    DoctorId = table.Column<int>(type: "INTEGER", nullable: false),
                    PaymentMethodTypeId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorPaymentMethodTypes", x => new { x.DoctorId, x.PaymentMethodTypeId });
                    table.ForeignKey(
                        name: "FK_DoctorPaymentMethodTypes_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorPaymentMethodTypes_PaymentMethodTypes_PaymentMethodTypeId",
                        column: x => x.PaymentMethodTypeId,
                        principalTable: "PaymentMethodTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppRolePermission",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "INTEGER", nullable: false),
                    PermissionId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppRolePermission", x => new { x.RoleId, x.PermissionId });
                    table.ForeignKey(
                        name: "FK_AppRolePermission_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppRolePermission_Permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserPermissions",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    PermissionId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPermissions", x => new { x.UserId, x.PermissionId });
                    table.ForeignKey(
                        name: "FK_UserPermissions_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserPermissions_Permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorPhones",
                columns: table => new
                {
                    DoctorId = table.Column<int>(type: "INTEGER", nullable: false),
                    PhoneId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorPhones", x => new { x.DoctorId, x.PhoneId });
                    table.ForeignKey(
                        name: "FK_DoctorPhones_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorPhones_Phone_PhoneId",
                        column: x => x.PhoneId,
                        principalTable: "Phone",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorBannerPhoto",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    PhotoId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorBannerPhoto", x => new { x.UserId, x.PhotoId });
                    table.ForeignKey(
                        name: "FK_DoctorBannerPhoto_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorBannerPhoto_Photos_PhotoId",
                        column: x => x.PhotoId,
                        principalTable: "Photos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorSignature",
                columns: table => new
                {
                    DoctorId = table.Column<int>(type: "INTEGER", nullable: false),
                    SignatureId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorSignature", x => new { x.DoctorId, x.SignatureId });
                    table.ForeignKey(
                        name: "FK_DoctorSignature_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorSignature_Photos_SignatureId",
                        column: x => x.SignatureId,
                        principalTable: "Photos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicalInsuranceCompanyPhoto",
                columns: table => new
                {
                    MedicalInsuranceCompanyId = table.Column<int>(type: "INTEGER", nullable: false),
                    PhotoId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalInsuranceCompanyPhoto", x => new { x.MedicalInsuranceCompanyId, x.PhotoId });
                    table.ForeignKey(
                        name: "FK_MedicalInsuranceCompanyPhoto_MedicalInsuranceCompanies_MedicalInsuranceCompanyId",
                        column: x => x.MedicalInsuranceCompanyId,
                        principalTable: "MedicalInsuranceCompanies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicalInsuranceCompanyPhoto_Photos_PhotoId",
                        column: x => x.PhotoId,
                        principalTable: "Photos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserPhotos",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    PhotoId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPhotos", x => new { x.UserId, x.PhotoId });
                    table.ForeignKey(
                        name: "FK_UserPhotos_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserPhotos_Photos_PhotoId",
                        column: x => x.PhotoId,
                        principalTable: "Photos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorPrescription",
                columns: table => new
                {
                    DoctorId = table.Column<int>(type: "INTEGER", nullable: false),
                    PrescriptionId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorPrescription", x => new { x.DoctorId, x.PrescriptionId });
                    table.ForeignKey(
                        name: "FK_DoctorPrescription_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorPrescription_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventPrescription",
                columns: table => new
                {
                    EventId = table.Column<int>(type: "INTEGER", nullable: false),
                    PrescriptionId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventPrescription", x => new { x.EventId, x.PrescriptionId });
                    table.ForeignKey(
                        name: "FK_EventPrescription_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventPrescription_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientPrescription",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "INTEGER", nullable: false),
                    PrescriptionId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientPrescription", x => new { x.PatientId, x.PrescriptionId });
                    table.ForeignKey(
                        name: "FK_PatientPrescription_AspNetUsers_PatientId",
                        column: x => x.PatientId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientPrescription_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PrescriptionOrder",
                columns: table => new
                {
                    PrescriptionId = table.Column<int>(type: "INTEGER", nullable: false),
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrescriptionOrder", x => new { x.PrescriptionId, x.OrderId });
                    table.ForeignKey(
                        name: "FK_PrescriptionOrder_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PrescriptionOrder_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorProducts",
                columns: table => new
                {
                    DoctorId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorProducts", x => new { x.DoctorId, x.ProductId });
                    table.ForeignKey(
                        name: "FK_DoctorProducts_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorProducts_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false),
                    ItemId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    Dosage = table.Column<string>(type: "TEXT", nullable: true),
                    Instructions = table.Column<string>(type: "TEXT", nullable: true),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    Unit = table.Column<string>(type: "TEXT", nullable: true),
                    Price = table.Column<double>(type: "REAL", nullable: false),
                    Discount = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => new { x.OrderId, x.ItemId });
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PrescriptionItems",
                columns: table => new
                {
                    PrescriptionId = table.Column<int>(type: "INTEGER", nullable: false),
                    ItemId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    Dosage = table.Column<string>(type: "TEXT", nullable: true),
                    Instructions = table.Column<string>(type: "TEXT", nullable: true),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    Unit = table.Column<string>(type: "TEXT", nullable: true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Id = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrescriptionItems", x => new { x.PrescriptionId, x.ItemId });
                    table.ForeignKey(
                        name: "FK_PrescriptionItems_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PrescriptionItems_Products_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ProductPhoto",
                columns: table => new
                {
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    PhotoId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPhoto", x => new { x.ProductId, x.PhotoId });
                    table.ForeignKey(
                        name: "FK_ProductPhoto_Photos_PhotoId",
                        column: x => x.PhotoId,
                        principalTable: "Photos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductPhoto_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorServices",
                columns: table => new
                {
                    DoctorId = table.Column<int>(type: "INTEGER", nullable: false),
                    ServiceId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorServices", x => new { x.DoctorId, x.ServiceId });
                    table.ForeignKey(
                        name: "FK_DoctorServices_AspNetUsers_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorServices_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventService",
                columns: table => new
                {
                    EventId = table.Column<int>(type: "INTEGER", nullable: false),
                    ServiceId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventService", x => new { x.EventId, x.ServiceId });
                    table.ForeignKey(
                        name: "FK_EventService_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventService_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ServicePhoto",
                columns: table => new
                {
                    ServiceId = table.Column<int>(type: "INTEGER", nullable: false),
                    PhotoId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServicePhoto", x => new { x.ServiceId, x.PhotoId });
                    table.ForeignKey(
                        name: "FK_ServicePhoto_Photos_PhotoId",
                        column: x => x.PhotoId,
                        principalTable: "Photos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ServicePhoto_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicalLicenseSpecialty",
                columns: table => new
                {
                    MedicalLicenseId = table.Column<int>(type: "INTEGER", nullable: false),
                    SpecialtyId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalLicenseSpecialty", x => new { x.MedicalLicenseId, x.SpecialtyId });
                    table.ForeignKey(
                        name: "FK_MedicalLicenseSpecialty_MedicalLicenses_MedicalLicenseId",
                        column: x => x.MedicalLicenseId,
                        principalTable: "MedicalLicenses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicalLicenseSpecialty_Specialties_SpecialtyId",
                        column: x => x.SpecialtyId,
                        principalTable: "Specialties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecialtyService",
                columns: table => new
                {
                    SpecialtyId = table.Column<int>(type: "INTEGER", nullable: false),
                    ServiceId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecialtyService", x => new { x.SpecialtyId, x.ServiceId });
                    table.ForeignKey(
                        name: "FK_SpecialtyService_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpecialtyService_Specialties_SpecialtyId",
                        column: x => x.SpecialtyId,
                        principalTable: "Specialties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StateCity",
                columns: table => new
                {
                    StateId = table.Column<int>(type: "INTEGER", nullable: false),
                    CityId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StateCity", x => new { x.StateId, x.CityId });
                    table.ForeignKey(
                        name: "FK_StateCity_Cities_CityId",
                        column: x => x.CityId,
                        principalTable: "Cities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StateCity_States_StateId",
                        column: x => x.StateId,
                        principalTable: "States",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicalLicenseSubSpecialties",
                columns: table => new
                {
                    MedicalLicenseId = table.Column<int>(type: "INTEGER", nullable: false),
                    SubSpecialtyId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalLicenseSubSpecialties", x => new { x.MedicalLicenseId, x.SubSpecialtyId });
                    table.ForeignKey(
                        name: "FK_MedicalLicenseSubSpecialties_MedicalLicenses_MedicalLicenseId",
                        column: x => x.MedicalLicenseId,
                        principalTable: "MedicalLicenses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicalLicenseSubSpecialties_SubSpecialties_SubSpecialtyId",
                        column: x => x.SubSpecialtyId,
                        principalTable: "SubSpecialties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecialitySubSpecialties",
                columns: table => new
                {
                    SpecialtyId = table.Column<int>(type: "INTEGER", nullable: false),
                    SubSpecialtyId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecialitySubSpecialties", x => new { x.SpecialtyId, x.SubSpecialtyId });
                    table.ForeignKey(
                        name: "FK_SpecialitySubSpecialties_Specialties_SpecialtyId",
                        column: x => x.SpecialtyId,
                        principalTable: "Specialties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpecialitySubSpecialties_SubSpecialties_SubSpecialtyId",
                        column: x => x.SubSpecialtyId,
                        principalTable: "SubSpecialties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTaxRegimes",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    TaxRegimeId = table.Column<int>(type: "INTEGER", nullable: false),
                    IsMain = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTaxRegimes", x => new { x.UserId, x.TaxRegimeId });
                    table.ForeignKey(
                        name: "FK_UserTaxRegimes_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserTaxRegimes_TaxRegime_TaxRegimeId",
                        column: x => x.TaxRegimeId,
                        principalTable: "TaxRegime",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppRolePermission_PermissionId",
                table: "AppRolePermission",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CityNeighborhood_NeighborhoodId",
                table: "CityNeighborhood",
                column: "NeighborhoodId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClinicNurses_ClinicId",
                table: "ClinicNurses",
                column: "ClinicId");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorBannerPhoto_PhotoId",
                table: "DoctorBannerPhoto",
                column: "PhotoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorBannerPhoto_UserId",
                table: "DoctorBannerPhoto",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorClinics_ClinicId",
                table: "DoctorClinics",
                column: "ClinicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorEvent_EventId",
                table: "DoctorEvent",
                column: "EventId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorLinks_LinkId",
                table: "DoctorLinks",
                column: "LinkId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorMedicalInsuranceCompany_MedicalInsuranceCompanyId",
                table: "DoctorMedicalInsuranceCompany",
                column: "MedicalInsuranceCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorNurses_NurseId",
                table: "DoctorNurses",
                column: "NurseId");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorOrder_OrderId",
                table: "DoctorOrder",
                column: "OrderId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorPatients_PatientId",
                table: "DoctorPatients",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorPaymentMethodTypes_PaymentMethodTypeId",
                table: "DoctorPaymentMethodTypes",
                column: "PaymentMethodTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorPhones_PhoneId",
                table: "DoctorPhones",
                column: "PhoneId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorPrescription_PrescriptionId",
                table: "DoctorPrescription",
                column: "PrescriptionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorProducts_ProductId",
                table: "DoctorProducts",
                column: "ProductId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorServices_ServiceId",
                table: "DoctorServices",
                column: "ServiceId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSignature_DoctorId",
                table: "DoctorSignature",
                column: "DoctorId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSignature_SignatureId",
                table: "DoctorSignature",
                column: "SignatureId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventClinic_ClinicId",
                table: "EventClinic",
                column: "ClinicId");

            migrationBuilder.CreateIndex(
                name: "IX_EventClinic_EventId",
                table: "EventClinic",
                column: "EventId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventPrescription_PrescriptionId",
                table: "EventPrescription",
                column: "PrescriptionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventService_EventId",
                table: "EventService",
                column: "EventId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventService_ServiceId",
                table: "EventService",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalInsuranceCompanyPhoto_MedicalInsuranceCompanyId",
                table: "MedicalInsuranceCompanyPhoto",
                column: "MedicalInsuranceCompanyId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicalInsuranceCompanyPhoto_PhotoId",
                table: "MedicalInsuranceCompanyPhoto",
                column: "PhotoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicalLicenseDocuments_DocumentId",
                table: "MedicalLicenseDocuments",
                column: "DocumentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicalLicenseDocuments_MedicalLicenseId",
                table: "MedicalLicenseDocuments",
                column: "MedicalLicenseId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicalLicenseSpecialty_MedicalLicenseId",
                table: "MedicalLicenseSpecialty",
                column: "MedicalLicenseId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicalLicenseSpecialty_SpecialtyId",
                table: "MedicalLicenseSpecialty",
                column: "SpecialtyId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalLicenseSubSpecialties_SubSpecialtyId",
                table: "MedicalLicenseSubSpecialties",
                column: "SubSpecialtyId");

            migrationBuilder.CreateIndex(
                name: "IX_NurseEvent_EventId",
                table: "NurseEvent",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderAddress_AddressId",
                table: "OrderAddress",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderAddress_OrderId",
                table: "OrderAddress",
                column: "OrderId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ItemId",
                table: "OrderItems",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientEvent_EventId",
                table: "PatientEvent",
                column: "EventId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PatientOrder_OrderId",
                table: "PatientOrder",
                column: "OrderId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PatientPrescription_PrescriptionId",
                table: "PatientPrescription",
                column: "PrescriptionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionItems_ItemId",
                table: "PrescriptionItems",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionOrder_OrderId",
                table: "PrescriptionOrder",
                column: "OrderId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionOrder_PrescriptionId",
                table: "PrescriptionOrder",
                column: "PrescriptionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductPhoto_PhotoId",
                table: "ProductPhoto",
                column: "PhotoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServicePhoto_PhotoId",
                table: "ServicePhoto",
                column: "PhotoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SpecialitySubSpecialties_SubSpecialtyId",
                table: "SpecialitySubSpecialties",
                column: "SubSpecialtyId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SpecialtyService_ServiceId",
                table: "SpecialtyService",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_StateCity_CityId",
                table: "StateCity",
                column: "CityId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserAddress_AddressId",
                table: "UserAddress",
                column: "AddressId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserMedicalInsuranceCompanies_MedicalInsuranceCompanyId",
                table: "UserMedicalInsuranceCompanies",
                column: "MedicalInsuranceCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMedicalLicenses_MedicalLicenseId",
                table: "UserMedicalLicenses",
                column: "MedicalLicenseId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPaymentMethods_PaymentMethodId",
                table: "UserPaymentMethods",
                column: "PaymentMethodId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissions_PermissionId",
                table: "UserPermissions",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPhotos_PhotoId",
                table: "UserPhotos",
                column: "PhotoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserPhotos_UserId",
                table: "UserPhotos",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserTaxRegimes_TaxRegimeId",
                table: "UserTaxRegimes",
                column: "TaxRegimeId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppRolePermission");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "CityNeighborhood");

            migrationBuilder.DropTable(
                name: "ClinicNurses");

            migrationBuilder.DropTable(
                name: "DoctorBannerPhoto");

            migrationBuilder.DropTable(
                name: "DoctorClinics");

            migrationBuilder.DropTable(
                name: "DoctorEvent");

            migrationBuilder.DropTable(
                name: "DoctorLinks");

            migrationBuilder.DropTable(
                name: "DoctorMedicalInsuranceCompany");

            migrationBuilder.DropTable(
                name: "DoctorNurses");

            migrationBuilder.DropTable(
                name: "DoctorOrder");

            migrationBuilder.DropTable(
                name: "DoctorPatients");

            migrationBuilder.DropTable(
                name: "DoctorPaymentMethodTypes");

            migrationBuilder.DropTable(
                name: "DoctorPhones");

            migrationBuilder.DropTable(
                name: "DoctorPrescription");

            migrationBuilder.DropTable(
                name: "DoctorProducts");

            migrationBuilder.DropTable(
                name: "DoctorServices");

            migrationBuilder.DropTable(
                name: "DoctorSignature");

            migrationBuilder.DropTable(
                name: "EventClinic");

            migrationBuilder.DropTable(
                name: "EventPrescription");

            migrationBuilder.DropTable(
                name: "EventService");

            migrationBuilder.DropTable(
                name: "MedicalInsuranceCompanyPhoto");

            migrationBuilder.DropTable(
                name: "MedicalLicenseDocuments");

            migrationBuilder.DropTable(
                name: "MedicalLicenseSpecialty");

            migrationBuilder.DropTable(
                name: "MedicalLicenseSubSpecialties");

            migrationBuilder.DropTable(
                name: "NurseEvent");

            migrationBuilder.DropTable(
                name: "OrderAddress");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "PatientEvent");

            migrationBuilder.DropTable(
                name: "PatientOrder");

            migrationBuilder.DropTable(
                name: "PatientPrescription");

            migrationBuilder.DropTable(
                name: "PrescriptionItems");

            migrationBuilder.DropTable(
                name: "PrescriptionOrder");

            migrationBuilder.DropTable(
                name: "ProductPhoto");

            migrationBuilder.DropTable(
                name: "ServicePhoto");

            migrationBuilder.DropTable(
                name: "SpecialitySubSpecialties");

            migrationBuilder.DropTable(
                name: "SpecialtyService");

            migrationBuilder.DropTable(
                name: "StateCity");

            migrationBuilder.DropTable(
                name: "UserAddress");

            migrationBuilder.DropTable(
                name: "UserMedicalInsuranceCompanies");

            migrationBuilder.DropTable(
                name: "UserMedicalLicenses");

            migrationBuilder.DropTable(
                name: "UserPaymentMethods");

            migrationBuilder.DropTable(
                name: "UserPermissions");

            migrationBuilder.DropTable(
                name: "UserPhotos");

            migrationBuilder.DropTable(
                name: "UserTaxRegimes");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "Neighborhoods");

            migrationBuilder.DropTable(
                name: "Link");

            migrationBuilder.DropTable(
                name: "PaymentMethodTypes");

            migrationBuilder.DropTable(
                name: "Phone");

            migrationBuilder.DropTable(
                name: "Documents");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Prescriptions");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "SubSpecialties");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "Specialties");

            migrationBuilder.DropTable(
                name: "Cities");

            migrationBuilder.DropTable(
                name: "States");

            migrationBuilder.DropTable(
                name: "Addresses");

            migrationBuilder.DropTable(
                name: "MedicalInsuranceCompanies");

            migrationBuilder.DropTable(
                name: "MedicalLicenses");

            migrationBuilder.DropTable(
                name: "PaymentMethods");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropTable(
                name: "Photos");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "TaxRegime");
        }
    }
}
