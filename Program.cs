using Microsoft.JSInterop;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
var host = builder.Build();

var serviceScope = host.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
var interop = serviceScope.ServiceProvider.GetService<IJSRuntime>();

if (interop == default)
{
    throw new Exception("Interop Service Null. Refresh Page.");
}

await interop.InvokeAsync<Task>("printCounter", 1);
