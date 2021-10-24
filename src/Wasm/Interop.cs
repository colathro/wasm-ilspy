using ICSharpCode.Decompiler.CSharp;
using ICSharpCode.Decompiler.Metadata;
using System.Reflection.Metadata;
using System.Reflection.Metadata.Ecma335;
using ICSharpCode.Decompiler;
using ICSharpCode.Decompiler.TypeSystem;
using Microsoft.JSInterop;
using System.Collections.Generic;

public static class Interop
{
    public static Dictionary<string, CSharpDecompiler> decompilers = new Dictionary<string, CSharpDecompiler>();
    public static IJSRuntime? JSRuntime = null;

    [JSInvokable]
    public static async Task FromJS(string fileName, byte[] bytes)
    {
        var memStream = new MemoryStream(bytes);
        var decompileTarget = new PEFile(fileName, memStream);

        var settings = GetSettings(decompileTarget);
        var assemblyResolver = new UniversalAssemblyResolver(
            fileName,
            false,
            decompileTarget.Reader.DetectTargetFrameworkId()
        );

        var decompilerTypeSystem = new DecompilerTypeSystem(decompileTarget);

        await decompilerTypeSystem.InitializeAsync(decompileTarget, assemblyResolver, DecompilerTypeSystem.GetOptions(settings));

        var decompiler = new CSharpDecompiler(
            decompilerTypeSystem,
            settings
        );

        foreach (var item in decompiler.TypeSystem.Modules)
        {
            Console.WriteLine(item.Name + " | " + item.SymbolKind.ToString());
            foreach (var tltd in item.TopLevelTypeDefinitions)
            {
                Console.WriteLine(tltd.FullName + " | " + tltd.SymbolKind.ToString());
                foreach (var member in tltd.Members)
                {
                    Console.WriteLine(member.FullName + " | " + tltd.SymbolKind.ToString());
                    //Console.WriteLine(GetCSharpCode(member.MetadataToken, decompiler));
                }
            }
        }
    }

    [JSInvokable]
    public static async Task AddAssembly(string fileName, byte[] bytes)
    {
        var memStream = new MemoryStream(bytes);
        var module = new PEFile(fileName, memStream);

        var settings = GetSettings(module);
        var assemblyResolver = new UniversalAssemblyResolver(
            fileName,
            false,
            module.Reader.DetectTargetFrameworkId()
        );

        var decompilerTypeSystem = new DecompilerTypeSystem(module);

        await decompilerTypeSystem.InitializeAsync(module, assemblyResolver, DecompilerTypeSystem.GetOptions(settings));

        var decompiler = new CSharpDecompiler(
            decompilerTypeSystem,
            settings
        );

        Interop.decompilers.TryAdd(fileName, decompiler);
        await Interop.JSRuntime!.InvokeAsync<Task>("addAssemblyCallback", fileName);
    }

    [JSInvokable]
    public static async Task<List<string>> GetLoadedAssemblies()
    {
        return Interop.decompilers.Keys.ToList();
    }

    [JSInvokable]
    public static async Task<List<string>> GetModules(string fileName)
    {
        var decompiler = decompilers[fileName];
        return decompiler.TypeSystem.Modules.Select(m => m.Name).ToList();
    }

    [JSInvokable]
    public static async Task<List<string>> GetTopLevelMembers(string fileName, string moduleName)
    {
        var decompiler = decompilers[fileName];
        var module = decompiler.TypeSystem.Modules.First(m => m.Name == moduleName);
        return module.TopLevelTypeDefinitions.Select(tltd => tltd.FullName).ToList();
    }

    [JSInvokable]
    public static async Task<List<string>> GetMembers(string fileName, string moduleName, string topLevelTypeDefinitionName)
    {
        var decompiler = decompilers[fileName];
        var module = decompiler.TypeSystem.Modules.First(m => m.Name == moduleName);
        var tltd = module.TopLevelTypeDefinitions.First(tltd => tltd.FullName == topLevelTypeDefinitionName);
        return tltd.Members.Select(m => m.FullName).ToList();
    }

    [JSInvokable]
    public static async Task<string> GetCSharpCode(string fileName, string moduleName, string topLevelTypeDefinitionName, string memberName)
    {
        var decompiler = decompilers[fileName];
        var module = decompiler.TypeSystem.Modules.First(m => m.Name == moduleName);
        var tltd = module.TopLevelTypeDefinitions.First(tltd => tltd.FullName == topLevelTypeDefinitionName);
        if (string.IsNullOrWhiteSpace(memberName))
        {
            return GetCSharpCode(tltd.MetadataToken, decompiler);
        }
        var member = tltd.Members.First(m => m.FullName == memberName);
        return GetCSharpCode(member.MetadataToken, decompiler);
    }

    public static string GetCSharpCode(EntityHandle handle, CSharpDecompiler dc)
    {
        if (handle.IsNil)
            return string.Empty;

        var module = dc.TypeSystem.MainModule;

        switch (handle.Kind)
        {
            case HandleKind.TypeDefinition:
                var td = module.GetDefinition((TypeDefinitionHandle)handle);
                if (td.DeclaringType == null)
                    return dc.DecompileTypesAsString(new[] { (TypeDefinitionHandle)handle });
                return dc.DecompileAsString(handle);
            case HandleKind.FieldDefinition:
            case HandleKind.MethodDefinition:
            case HandleKind.PropertyDefinition:
            case HandleKind.EventDefinition:
                return dc.DecompileAsString(handle);
        }

        return string.Empty;
    }

    public static DecompilerSettings GetSettings(PEFile module)
    {
        return new DecompilerSettings(LanguageVersion.Latest)
        {
            ThrowOnAssemblyResolveErrors = false,
            RemoveDeadCode = false,
            RemoveDeadStores = false,
            UseSdkStyleProjectFormat = false
        };
    }
}