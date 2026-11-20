using System.Linq;
using System.Text;

namespace Expose.Generator;


internal static class ResultMapping
{
    public static void Append(StringBuilder src, Endpoint endpoint, int level, string keyword, string onNotFound, string onOther)
    {
        var tab = " ".Repeat(4);
        src.AppendLine($"{tab.Repeat(level)}if (result.IsOk)");
        src.AppendLine($"{tab.Repeat(level)}{{");
        src.AppendLine($"{tab.Repeat(level + 1)}var value = result.ResultValue;");
        if (endpoint.ResponseRecord is null)
            src.AppendLine($"{tab.Repeat(level + 1)}{keyword} value;");
        else {
            var fields = string.Join(", ", endpoint.ResponseFields!.Select(field => $"value.{field.Name}"));
            src.AppendLine($"{tab.Repeat(level + 1)}{keyword} new {endpoint.ResponseRecord}({fields});");
        }

        src.AppendLine($"{tab.Repeat(level)}}}");
        src.AppendLine($"{tab.Repeat(level)}var error = result.ErrorValue;");
        if (endpoint.ErrorCases.Contains("IsNotFound"))
            src.AppendLine($"{tab.Repeat(level)}if (error.IsNotFound) {onNotFound}");
        src.AppendLine($"{tab.Repeat(level)}{onOther}");
    }
}
