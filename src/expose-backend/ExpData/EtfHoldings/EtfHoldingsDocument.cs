using System.ComponentModel.DataAnnotations.Schema;
using Expose.Data.Common;

namespace Expose.Data.EtfHoldings;


[Table(IEtfHoldingsContext.DocumentsTable)]
public record EtfHoldingsDocument : IEntityBase, IEntityFromModel<EtfHoldingsDocument, Core.EtfHoldings.EtfHolding>
{
    public long Id { get; set; }
    public Guid Guid7 { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? WebUrl { get; set; }


    public static EtfHoldingsDocument FromModel(Core.EtfHoldings.EtfHolding model) => new() {
        Guid7 = model.Guid,
        Name = model.Name,
        WebUrl = model.WebUrl?.Value.url,
    };
}
