using System.ComponentModel.DataAnnotations.Schema;

namespace Expose.Data.EtfHoldings;


[Table(IEtfHoldingsContext.LookupTable)]
public class EtfHoldingsLookupRow //: IEntityBase
{
    public long Id { get; set; }
    //public Guid Guid7 { get; set; }
    //public DateTimeOffset CreatedAt { get; set; }
    //public DateTimeOffset? UpdatedAt { get; set; }
}
