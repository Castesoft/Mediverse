using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MainService.Postgres.Migrations
{
    /// <inheritdoc />
    public partial class sdawdads : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_AspNetUsers_MarkedPaidByUserId",
                table: "Payments");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_AspNetUsers_MarkedPaidByUserId",
                table: "Payments",
                column: "MarkedPaidByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_AspNetUsers_MarkedPaidByUserId",
                table: "Payments");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_AspNetUsers_MarkedPaidByUserId",
                table: "Payments",
                column: "MarkedPaidByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
