using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MainService.Postgres.Migrations
{
    /// <inheritdoc />
    public partial class ddowwwwww : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFavorite",
                table: "UserNotifications",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsImportant",
                table: "UserNotifications",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFavorite",
                table: "UserNotifications");

            migrationBuilder.DropColumn(
                name: "IsImportant",
                table: "UserNotifications");
        }
    }
}
