namespace MainService.Models.Helpers;

public static class DateGenerator
{
    private static readonly Random Random = new();

    /// <summary>
    /// Generates a random date for a given year and optionally for a specific month.
    /// </summary>
    /// <param name="year">The year for which to generate the date.</param>
    /// <param name="month">Optional. The month for which to generate the date. If not provided, a month is chosen randomly.</param>
    /// <returns>A random <see cref="DateTime"/> within the specified year and optionally month.</returns>
    public static DateTime GenerateRandomDate(int year, int? month = null)
    {
        // If month is not specified, generate a random month (1 to 12)
        int generatedMonth = month ?? Random.Next(1, 13);

        // Find the number of days in the generated month and year
        int daysInMonth = DateTime.DaysInMonth(year, generatedMonth);

        // Generate a random day within the month
        int day = Random.Next(1, daysInMonth + 1);

        // Return the generated random date
        return new DateTime(year, generatedMonth, day);
    }
}