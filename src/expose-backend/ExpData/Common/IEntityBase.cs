namespace Expose.Data.Common;


public interface IEntityBase
{
    long Id { get; set; }

    Guid Guid7 { get; set; }

    DateTimeOffset CreatedAt { get; set; }

    DateTimeOffset? UpdatedAt { get; set; }
}
