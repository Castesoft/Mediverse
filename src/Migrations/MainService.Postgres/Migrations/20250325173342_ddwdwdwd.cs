using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MainService.Postgres.Migrations
{
    /// <inheritdoc />
    public partial class ddwdwdwd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BillingAddressId",
                table: "Events",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Events_BillingAddressId",
                table: "Events",
                column: "BillingAddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Addresses_BillingAddressId",
                table: "Events",
                column: "BillingAddressId",
                principalTable: "Addresses",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Addresses_BillingAddressId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_BillingAddressId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "BillingAddressId",
                table: "Events");
        }
    }
}
