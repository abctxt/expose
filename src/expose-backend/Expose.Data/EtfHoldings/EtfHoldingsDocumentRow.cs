using System.ComponentModel.DataAnnotations.Schema;

namespace Expose.Data.EtfHoldings;


[Table(IEtfHoldingsContext.DocumentsTable)]
public class EtfHoldingsDocumentRow : EntityBase, IEntityFromModel<EtfHoldingsDocumentRow, Core.EtfHoldings.Document>
{
    public string Name { get; set; } = string.Empty;

    public string? HomepageUrl { get; set; }
    public string? DownloadUrl { get; set; }


    public static EtfHoldingsDocumentRow FromModel(Core.EtfHoldings.Document model) => new() {
        Guid7 = model.Guid,
        Name = model.Name,
        HomepageUrl = model.HomepageUrl?.Value.url,
        DownloadUrl = model.DownloadUrl?.Value.url,
    };
}
