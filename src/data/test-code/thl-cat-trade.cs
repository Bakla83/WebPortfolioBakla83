public class CatTradeTableDialogTests
{
    [SetUp]
    public void SetUp()
    {
        _saveHost = new GameObject("SaveManager");
        _saveManager = _saveHost.AddComponent<SaveManager>();
        SetSaveManagerInstance(_saveManager);

        _playerHost = new GameObject("Player");
        _inventory = _playerHost.AddComponent<PlayerInventory>();
        PlayerBrain brain = _playerHost.AddComponent<PlayerBrain>();
        ReflectionTestHelper.SetField(brain, "_playerInventory", _inventory);

        _paperPassword = ScriptableObject.CreateInstance<T_Item>();

        _tableHost = new GameObject("Table");
        _table = _tableHost.AddComponent<CircleTableMiniGameWorld>();
        ReflectionTestHelper.SetField(_table, "_playerBrain", brain);
        ReflectionTestHelper.SetField(_table, "_paperPasswordItem", _paperPassword);
        ReflectionTestHelper.SetField(_table, "_requireCatTrade", true);
    }

    // Флаг берётся у того, кто его пишет (квест кота), а не у того, кто читает (стол).
    // Так тест ловит расхождение ключей между двумя скриптами.
    private static string FlagWrittenByCatQuest()
    {
        FieldInfo field = typeof(CatQuestProgress).GetField("F_EXCHANGE_DONE", BindingFlags.NonPublic | BindingFlags.Static);
        Assert.IsNotNull(field);
        return (string)field.GetValue(null);
    }

    private bool TableUnlocksPaperDialog()
    {
        return (bool)ReflectionTestHelper.Invoke(_table, "HasPaperPasswordAfterCatTrade");
    }

    [Test]
    public void PaperDialogStaysLockedBeforeCatExchange()
    {
        _inventory.AddItem(_paperPassword);
        Assert.IsFalse(TableUnlocksPaperDialog());
    }

    [Test]
    public void PaperDialogNeedsPaperInInventory()
    {
        _saveManager.SetFlag(FlagWrittenByCatQuest(), true);
        Assert.IsFalse(TableUnlocksPaperDialog());
    }

    [Test]
    public void PaperDialogUnlocksAfterCatExchange()
    {
        _saveManager.SetFlag(FlagWrittenByCatQuest(), true);
        _inventory.AddItem(_paperPassword);

        Assert.IsTrue(TableUnlocksPaperDialog());
    }
}
