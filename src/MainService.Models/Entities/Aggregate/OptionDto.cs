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
    public bool Enabled { get; set; } = true;
    public bool Visible { get; set; } = true;
}