using System.Linq;

namespace Expose.Generator;


internal static class StringRepeat
{
    public static string Repeat(this string value, int count) =>
        string.Concat(Enumerable.Repeat(value, count));
}
