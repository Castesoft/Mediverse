namespace MainService.Core.DTOs.Google
{
    public class Geometry
    {
        public Location Location { get; set; }
        public Viewport Viewport { get; set; }
    }

    public class Location
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }

    public class Northeast
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }

    public class Southwest
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }

    public class Viewport
    {
        public Northeast Northeast { get; set; }
        public Southwest Southwest { get; set; }
    }
}