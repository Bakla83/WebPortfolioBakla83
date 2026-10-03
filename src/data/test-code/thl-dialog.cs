public class DialogConteynerTests
{
    private DialogSettingConfig CreateLine(params T_Item[] requiredItems)
    {
        DialogSettingConfig line = Track(ScriptableObject.CreateInstance<DialogSettingConfig>());
        line._itemsNeedsForTalk = new List<T_Item>(requiredItems);
        return line;
    }

    [Test]
    public void NextLineWaitsForRequiredItem()
    {
        T_Item catnip = Track(ScriptableObject.CreateInstance<T_Item>());
        DialogConteyner dialog = CreateDialog(CreateLine(), CreateLine(catnip));

        Assert.IsFalse(dialog.CheckIsCanTalkNextSentence(_inventory));

        _inventory.AddItem(catnip);

        Assert.IsTrue(dialog.CheckIsCanTalkNextSentence(_inventory));
        Assert.IsTrue(_inventory.HasItem(catnip));
    }

    [Test]
    public void RequiredItemIsTakenWhenLineConsumesIt()
    {
        T_Item catnip = Track(ScriptableObject.CreateInstance<T_Item>());
        DialogSettingConfig giveCatnip = CreateLine(catnip);
        giveCatnip._itemsMustBeenDelete = true;

        DialogConteyner dialog = CreateDialog(CreateLine(), giveCatnip);
        _inventory.AddItem(catnip);

        Assert.IsTrue(dialog.CheckIsCanTalkNextSentence(_inventory));
        Assert.IsFalse(_inventory.HasItem(catnip));
    }

    [Test]
    public void StepDoesNotRunPastEnd()
    {
        DialogConteyner dialog = CreateDialog(CreateLine(), CreateLine());

        for (int i = 0; i < 5; i++)
            dialog.SetNextOfSentence();

        Assert.AreEqual(2, dialog.GetStepOfDialog());

        dialog.ResetStep();
        Assert.AreEqual(0, dialog.GetStepOfDialog());
    }
}
