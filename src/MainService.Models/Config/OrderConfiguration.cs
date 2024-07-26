// OrderConfiguration.cs

using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Runtime.Serialization;
using System.Reflection;

namespace MainService.Models.Config;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.Property(x => x.Status)
            .HasConversion(
                v => GetEnumMemberValue(v),
                v => GetEnumFromMemberValue<OrderStatus>(v)
            )
            .HasMaxLength(50);

        builder.Property(x => x.DeliveryStatus)
            .HasConversion(
                v => GetEnumMemberValue(v),
                v => GetEnumFromMemberValue<OrderDeliveryStatus>(v)
            )
            .HasMaxLength(50);
    }

    private string GetEnumMemberValue<T>(T enumValue) where T : Enum
    {
        var type = typeof(T);
        var memberInfo = type.GetMember(enumValue.ToString()).FirstOrDefault();
        var attribute = memberInfo?.GetCustomAttribute<EnumMemberAttribute>();
        return attribute?.Value ?? enumValue.ToString();
    }

    private T GetEnumFromMemberValue<T>(string value) where T : Enum
    {
        var type = typeof(T);
        foreach (var field in type.GetFields())
        {
            var attribute = field.GetCustomAttribute<EnumMemberAttribute>();
            if (attribute != null && attribute.Value == value)
            {
                return (T)field.GetValue(null);
            }
        }

        return (T)Enum.Parse(type, value, true);
    }
}