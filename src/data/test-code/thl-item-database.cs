// ProjectIntegrityTests.cs
[Test]
public void ItemDatabaseCoversItemsUsedInGameScene()
{
    LogAssert.ignoreFailingMessages = true;
    Scene scene = EditorSceneManager.OpenScene(GameScenePath, OpenSceneMode.Additive);

    try
    {
        MonoBehaviour[] behaviours = scene.GetRootGameObjects()
            .SelectMany(root => root.GetComponentsInChildren<MonoBehaviour>(true))
            .Where(behaviour => behaviour != null)
            .ToArray();

        BaseGameInformation database = behaviours.OfType<BaseGameInformation>().Single();
        HashSet<T_Item> known = CollectItems(database);
        var used = new HashSet<T_Item>();

        foreach (MonoBehaviour behaviour in behaviours)
        {
            if (behaviour != database)
                used.UnionWith(CollectItems(behaviour));
        }

        // Любой предмет, который сцена может положить в инвентарь,
        // обязан быть в базе, иначе после загрузки он пропадёт.
        CollectionAssert.IsEmpty(used.Where(item => !known.Contains(item)).Select(item => item.name));
    }
    finally
    {
        EditorSceneManager.CloseScene(scene, true);
    }
}

// Обходит все сериализованные ссылки компонента, включая реплики диалогов.
private static HashSet<T_Item> CollectItems(Object source)
{
    var items = new HashSet<T_Item>();
    SerializedProperty property = new SerializedObject(source).GetIterator();

    while (property.Next(true))
    {
        if (property.propertyType != SerializedPropertyType.ObjectReference)
            continue;

        if (property.objectReferenceValue is T_Item item)
            items.Add(item);
        else if (property.objectReferenceValue is DialogSettingConfig line)
            items.UnionWith(CollectItems(line));
    }

    return items;
}

// PlayerInventoryTests.cs
[Test]
public void LoadRestoresKnownItemsAndSkipsUnknown()
{
    T_Item pruner = CreateItem("Pruner");
    BaseGameInformation database = Track(new GameObject("Database")).AddComponent<BaseGameInformation>();
    ReflectionTestHelper.SetField(database, "_allItems", new List<T_Item> { pruner });
    database.InitAwake();

    _inventory.SetItemsByIds(new List<string> { pruner.Id, "unknown_id" });

    CollectionAssert.AreEqual(new[] { pruner.Id }, _inventory.GetItemIds());
}
