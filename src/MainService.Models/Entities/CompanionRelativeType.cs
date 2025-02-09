namespace MainService.Models.Entities
{
    public class CompanionRelativeType
    {
        public CompanionRelativeType() { }
        public CompanionRelativeType(RelativeType relativeType) => RelativeType = relativeType;
        public CompanionRelativeType(int relativeTypeId) => RelativeTypeId = relativeTypeId;
        public CompanionRelativeType(int relativeTypeId, int companionId)
        {
            RelativeTypeId = relativeTypeId;
            CompanionId = companionId;
        }

        public int CompanionId { get; set; }
        public Companion Companion { get; set; } = null!;
        public int RelativeTypeId { get; set; }
        public RelativeType RelativeType { get; set; } = null!;
    }
}