namespace MainService.Models.Helpers;

public static class DateGenerator
{
    private static readonly Random Random = new();

    /// <summary>
    /// Generates a random date and time for a given year and, optionally, for a specific month.
    /// You can also customize the range for the hour component (defaults to 9 AM to 5 PM, where 5 PM is exclusive).
    /// Minutes and seconds are randomized from 0 to 59.
    /// </summary>
    /// <param name="year">The year for which to generate the date.</param>
    /// <param name="month">
    /// Optional. The month for which to generate the date.
    /// If not provided, a month is chosen randomly from 1 to 12.
    /// </param>
    /// <param name="startHour">
    /// Optional. The inclusive lower bound for the hour component (default is 9).
    /// </param>
    /// <param name="endHour">
    /// Optional. The exclusive upper bound for the hour component (default is 17).
    /// The generated hour will be in the range [startHour, endHour).
    /// </param>
    /// <returns>
    /// A random <see cref="DateTime"/> within the specified year and optionally month, with a randomized time
    /// where the hour is between <paramref name="startHour"/> (inclusive) and <paramref name="endHour"/> (exclusive).
    /// </returns>
    public static DateTime GenerateRandomDate(int year, int? month = null, int startHour = 9, int endHour = 17)
    {
        // Validate that the provided hour range is valid
        if (startHour < 0 || endHour > 24 || startHour >= endHour)
        {
            throw new ArgumentException("Invalid hour range. Ensure 0 <= startHour < endHour <= 24.");
        }

        // If month is not specified, choose a random month (1 to 12)
        var generatedMonth = month ?? Random.Next(1, 13);

        // Determine the number of days in the chosen month and year
        var daysInMonth = DateTime.DaysInMonth(year, generatedMonth);

        // Randomly choose a day within the month
        var day = Random.Next(1, daysInMonth + 1);

        // Randomly choose an hour between startHour (inclusive) and endHour (exclusive)
        var hour = Random.Next(startHour, endHour);

        // Return the randomly generated DateTime
        return new DateTime(year, generatedMonth, day, hour, 0, 0);
    }
}