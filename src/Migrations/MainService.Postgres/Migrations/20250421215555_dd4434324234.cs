using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MainService.Postgres.Migrations
{
    /// <inheritdoc />
    public partial class dd4434324234 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorPatients_AspNetUsers_PatientId",
                table: "DoctorPatients");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorPatients_AspNetUsers_PatientId",
                table: "DoctorPatients",
                column: "PatientId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorPatients_AspNetUsers_PatientId",
                table: "DoctorPatients");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorPatients_AspNetUsers_PatientId",
                table: "DoctorPatients",
                column: "PatientId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
