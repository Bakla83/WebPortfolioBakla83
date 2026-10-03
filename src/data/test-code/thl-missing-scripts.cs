[Test]
public void BuildScenesHaveNoMissingScripts()
{
    LogAssert.ignoreFailingMessages = true;
    var broken = new List<string>();

    foreach (EditorBuildSettingsScene buildScene in EditorBuildSettings.scenes)
    {
        Scene scene = EditorSceneManager.OpenScene(buildScene.path, OpenSceneMode.Additive);

        try
        {
            foreach (GameObject root in scene.GetRootGameObjects())
                CollectMissingScripts(root, buildScene.path, broken);
        }
        finally
        {
            EditorSceneManager.CloseScene(scene, true);
        }
    }

    CollectionAssert.IsEmpty(broken);
}

private static void CollectMissingScripts(GameObject gameObject, string scenePath, List<string> broken)
{
    if (GameObjectUtility.GetMonoBehavioursWithMissingScriptCount(gameObject) > 0)
        broken.Add($"{scenePath}: {gameObject.name}");

    foreach (Transform child in gameObject.transform)
        CollectMissingScripts(child.gameObject, scenePath, broken);
}
