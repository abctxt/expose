using System.ComponentModel.DataAnnotations.Schema;

namespace Expose.Data.EtfHoldings;


[Table(IEtfHoldingsContext.DownloadsTable)]
public class EtfHoldingsDownloadRow : EntityBase
{
    public DateTimeOffset? StartedAt { get; set; }
    public DateTimeOffset? FinishedAt { get; set; }
    public DateTimeOffset? CanceledAt { get; set; }
    public DateTimeOffset? FailedAt { get; set; }

    public uint BytesReceived { get; set; }

    public int Retried { get; set; }
}
