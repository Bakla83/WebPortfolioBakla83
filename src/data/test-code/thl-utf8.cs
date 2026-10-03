private static readonly string[] SourceFolders = { "Assets/Scripts", "Assets/Editor", "Assets/Tests" };

[Test]
public void SourceFilesAreUtf8()
{
    // Строгий декодер бросает исключение на любом байте, который не является UTF-8.
    var strictUtf8 = new UTF8Encoding(false, true);
    var broken = new List<string>();

    foreach (string folder in SourceFolders.Where(Directory.Exists))
    {
        foreach (string path in Directory.GetFiles(folder, "*.cs", SearchOption.AllDirectories))
        {
            try
            {
                strictUtf8.GetString(File.ReadAllBytes(path));
            }
            catch (DecoderFallbackException)
            {
                broken.Add(path);
            }
        }
    }

    CollectionAssert.IsEmpty(broken);
}
