[Workflow]
public class OrderWorkflow
{
    private string? _status;

    [WorkflowRun]
    public async Task RunAsync()
    {
        // Wait until status is set via signal
        await Workflow.WaitConditionAsync(() => _status != null);

        // Now react
        Console.WriteLine($"Order status changed to {_status}");
    }

    [WorkflowSignal]
    public Task UpdateStatusAsync(string status)
    {
        _status = status;
        return Task.CompletedTask;
    }
}


await client.SignalWithStartWorkflowAsync(
    (OrderWorkflow wf) => wf.UpdateStatusAsync("Paid"),
    new WorkflowOptions
    {
        Id = "order-123",
        TaskQueue = "orders"
    },
    wf => wf.RunAsync()
);


[WorkflowRun]
public async Task RunAsync()
{
    while (true)
    {
        await Workflow.WaitConditionAsync(() => _hasNewEvent);

        await ProcessAsync();

        _hasNewEvent = false;
    }
}
