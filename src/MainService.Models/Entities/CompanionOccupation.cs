namespace MainService.Models.Entities
{
    public class CompanionOccupation
    {
        public CompanionOccupation() { }
        public CompanionOccupation(Occupation occupation) => Occupation = occupation;
        public CompanionOccupation(int occupationId) => OccupationId = occupationId;
        public CompanionOccupation(int occupationId, int companionId)
        {
            OccupationId = occupationId;
            CompanionId = companionId;
        }

        public int CompanionId { get; set; }
        public Companion Companion { get; set; } = null!;
        public int OccupationId { get; set; }
        public Occupation Occupation { get; set; } = null!;
    }
}