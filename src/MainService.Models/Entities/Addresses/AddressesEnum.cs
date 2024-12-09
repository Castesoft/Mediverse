using System.Runtime.Serialization;

namespace MainService.Models.Entities.Addresses;

public enum AddressesEnum
    {
        [EnumMember(Value = "Account")]
        Account,
        [EnumMember(Value = "Clinic")]
        Clinic,
    }