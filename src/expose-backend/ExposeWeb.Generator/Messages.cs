using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Expose.Generator;


internal static class Messages
{
    public static void Append(StringBuilder src, string name, List<Member> fields)
    {
        var tab = " ".Repeat(4);
        var parameters = string.Join(", ", fields.Select(field => $"{field.Type} {Names.Camel(field.Name)}"));
        src.AppendLine($"[ProtoBuf.ProtoContract] public sealed class {name}");
        src.AppendLine("{");
        src.AppendLine($"{tab}public {name}() {{ }}");
        if (fields.Count > 0) {
            src.AppendLine($"{tab}public {name}({parameters})");
            src.AppendLine($"{tab}{{");
            foreach (var field in fields)
                src.AppendLine($"{tab.Repeat(2)}{field.Name} = {Names.Camel(field.Name)};");
            src.AppendLine($"{tab}}}");
        }

        for (var i = 0; i < fields.Count; i++) {
            var suffix = fields[i].Type == "string" ? " = \"\";" : "";
            src.AppendLine($"{tab}[ProtoBuf.ProtoMember({i + 1})] public {fields[i].Type} {fields[i].Name} {{ get; set; }}{suffix}");
        }

        src.AppendLine("}");
    }
}
