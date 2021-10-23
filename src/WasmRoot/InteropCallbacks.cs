using ICSharpCode.Decompiler.CSharp;
using ICSharpCode.Decompiler.Metadata;
using System.Reflection.Metadata;
using System.Reflection.Metadata.Ecma335;
using ICSharpCode.Decompiler;
using ICSharpCode.Decompiler.TypeSystem;
using Microsoft.JSInterop;

public static class InteropCallbacks
{
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
            foreach (var tltd in item.TopLevelTypeDefinitions)
            {
                foreach (var member in tltd.Members)
                {
                    Console.WriteLine(GetCSharpCode(member.MetadataToken, decompiler));
                }
            }
        }
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