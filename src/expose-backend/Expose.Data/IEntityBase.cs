namespace Expose.Data;


public interface IEntityBase
{
    long Id { get; set; }

    Guid Guid7 { get; set; }

    DateTimeOffset CreatedAt { get; set; }

    DateTimeOffset? UpdatedAt { get; set; }
}


public abstract class EntityBase : IEntityBase
{
    public long Id { get; set; }
    public Guid Guid7 { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}
