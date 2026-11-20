using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Expose.Data.Portfolio;


[Table(IPortfolioContext.ItemsTable)]
public class PortfolioItemRow : EntityBase, IEntityFromModel<PortfolioItemRow, Core.Portfolio.PortfolioItem>
{
    public string OriginalIsin { get; set; } = string.Empty;

    public string? DisplayName { get; set; }

    public int DisplayOrder { get; set; }

    [Precision(IPortfolioContext.SharePiecesPrecision, IPortfolioContext.SharePiecesScale)]
    public decimal NumberOfPieces { get; set; }

    [Precision(IPortfolioContext.MoneyPrecision, IPortfolioContext.MoneyScale)]
    public decimal CapitalAmount { get; set; }

    public int Currency { get; set; }

    public static PortfolioItemRow FromModel(Core.Portfolio.PortfolioItem model) => new() {
        NumberOfPieces = model.Pieces,
        CapitalAmount = model.Capital,
    };
}
