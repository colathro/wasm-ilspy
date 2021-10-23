using Microsoft.JSInterop;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using ICSharpCode.Decompiler.CSharp;
using ICSharpCode.Decompiler.CSharp.ProjectDecompiler;
using ICSharpCode.Decompiler.DebugInfo;
using ICSharpCode.Decompiler.Disassembler;
using ICSharpCode.Decompiler.Metadata;
using ICSharpCode.Decompiler.TypeSystem;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
var host = builder.Build();

var serviceScope = host.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
var interop = serviceScope.ServiceProvider.GetService<IJSRuntime>();

if (interop == default)
{
    throw new Exception("Interop Service Null. Refresh Page.");
}
