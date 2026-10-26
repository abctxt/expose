namespace Expose;

public class TestClass
{
    [Test]
    public async Task TestMe()
    {
        await Task.Delay(100);
        await Assert.That("test").IsEqualTo("test");
    }
}
