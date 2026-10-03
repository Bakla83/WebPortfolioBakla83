public class SaveManagerTests
{
    [Test]
    public void MissingFlagReturnsDefault()
    {
        Assert.IsTrue(_saveManager.GetFlag("missing_flag", true));
        Assert.IsFalse(_saveManager.GetFlag("missing_flag"));
    }

    [Test]
    public void CollectedIdIsStoredOnce()
    {
        _saveManager.MarkCollected("item_1");
        _saveManager.MarkCollected("item_1");

        Assert.IsTrue(_saveManager.WasCollected("item_1"));
        Assert.IsFalse(_saveManager.WasCollected("item_2"));

        SaveData data = ReflectionTestHelper.GetField<SaveData>(_saveManager, "_current");
        Assert.AreEqual(1, data.collectedPersistentIds.Count);
    }

    [Test]
    public void SaveDataSurvivesJsonRoundTrip()
    {
        var data = new SaveData
        {
            sceneBuildIndex = 2,
            activeLocationName = "Kitchen",
            totalPlaySeconds = 125.5,
            lastSavedUtcTicks = 638000000000000000,
            playerPos = new SerializableVector3(new Vector3(37.85f, -28.81f, 0f)),
            inventoryItemIds = { "key", "pruner" },
            collectedPersistentIds = { "hairpin_on_floor" },
            boolFlags = { new StringBoolPair { key = "vines_cut", value = true } }
        };

        SaveData copy = JsonUtility.FromJson<SaveData>(JsonUtility.ToJson(data));

        Assert.AreEqual(data.sceneBuildIndex, copy.sceneBuildIndex);
        Assert.AreEqual(data.activeLocationName, copy.activeLocationName);
        Assert.AreEqual(data.totalPlaySeconds, copy.totalPlaySeconds);
        Assert.AreEqual(data.lastSavedUtcTicks, copy.lastSavedUtcTicks);
        Assert.AreEqual(data.playerPos.ToVector3(), copy.playerPos.ToVector3());
        CollectionAssert.AreEqual(data.inventoryItemIds, copy.inventoryItemIds);
        CollectionAssert.AreEqual(data.collectedPersistentIds, copy.collectedPersistentIds);
        Assert.AreEqual("vines_cut", copy.boolFlags[0].key);
        Assert.IsTrue(copy.boolFlags[0].value);
    }
}
