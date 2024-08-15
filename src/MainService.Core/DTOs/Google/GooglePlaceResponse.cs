namespace MainService.Core.DTOs.Google
{
    public class GooglePlaceResponse
    {
        public List<object> HtmlAttributions { get; set; }
        public List<Result> Results { get; set; }
        public string Status { get; set; }
    }
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

    public class PlusCode
    {
        public string CompoundCode { get; set; }
        public string GlobalCode { get; set; }
    }

    public class Result
    {
        public string FormattedAddress { get; set; }
        public Geometry Geometry { get; set; }
        public string Icon { get; set; }
        public string IconBackgroundColor { get; set; }
        public string IconMaskBaseUri { get; set; }
        public string Name { get; set; }
        public string PlaceId { get; set; }
        public PlusCode PlusCode { get; set; }
        public string Reference { get; set; }
        public List<string> Types { get; set; }
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