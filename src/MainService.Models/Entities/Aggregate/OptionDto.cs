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

    public int Id { get; set; } = 0;
    public string Code { get; set; }
    public string Name { get; set; }
    public Options Options { get; set; } = null;
    public bool Enabled { get; set; } = true;
    public bool Visible { get; set; } = true;
    
}

#nullable enable

public class Options
{
    public int? Id { get; set; } = null;
    public string? Sex { get; set; } = null;
    public string? Race { get; set; } = null;
    public decimal? Price { get; set; } = null;
    public string? PhotoUrl { get; set; } = null;
    public string? Description { get; set; } = null;
    public bool? IsMain { get; set; } = null;
}

#nullable disable
