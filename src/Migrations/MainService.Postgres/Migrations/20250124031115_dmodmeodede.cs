using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MainService.Postgres.Migrations
{
    /// <inheritdoc />
    public partial class dmodmeodede : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsMain",
                table: "ProductPhoto",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsMain",
                table: "ProductPhoto");
        }
    }
}
