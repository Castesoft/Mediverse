namespace MainService.Models.Entities.Aggregate;

public class OptionDto
{
    public OptionDto() { }

    public OptionDto(string text)
    {
        Code = text;
        Name = text;
        Id = 0;
    }

    public OptionDto(int id, string code, string name)
    {
        Id = id;
        Code = code;
        Name = name;
    }

    public OptionDto(string code, string name)
    {
        Id = 0;
        Code = code;
        Name = name;
    }

    public int? Id { get; set; }
    public string? Code { get; set; }
    public string? Name { get; set; }
    public Options? Options { get; set; }
    public bool? Enabled { get; set; }
    public bool? Visible { get; set; }
    
}



public class Options
{
    public int? Id { get; set; }
    public string? Sex { get; set; }
    public double? Dosage { get; set; }
    public string? Unit { get; set; }
    public string? Description { get; set; }
    public string? Race { get; set; }
    public decimal? Price { get; set; }
    public string? PhotoUrl { get; set; }
    public bool? IsMain { get; set; }
}


