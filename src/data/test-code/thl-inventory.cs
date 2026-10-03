public class PlayerInventoryTests
{
    [Test]
    public void NullItemIsRejected()
    {
        Assert.IsFalse(_inventory.AddItem(null).Result);
    }

    [Test]
    public void RemoveItemTakesOneCopyAtATime()
    {
        T_Item key = CreateItem("Key");
        T_Item copy = Track(Object.Instantiate(key));

        _inventory.AddItem(key);
        _inventory.AddItem(copy);

        Assert.IsTrue(_inventory.RemoveItem(key).Result);
        Assert.IsTrue(_inventory.HasItem(key));
        Assert.IsTrue(_inventory.RemoveItem(key).Result);
        Assert.IsFalse(_inventory.HasItem(key));
        Assert.IsFalse(_inventory.RemoveItem(key).Result);
    }

    [Test]
    public void RemoveByNameRespectsCount()
    {
        _inventory.AddItem(CreateItem("Catnip"));
        _inventory.AddItem(CreateItem("Catnip"));
        _inventory.AddItem(CreateItem("Catnip"));

        Assert.AreEqual(2, _inventory.RemoveItemsByName("Catnip", 2));
        Assert.AreEqual(1, _inventory.CountItemsByName("Catnip"));
    }

    [Test]
    public void ItemIdsKeepInventoryOrder()
    {
        T_Item first = CreateItem("First");
        T_Item second = CreateItem("Second");

        _inventory.AddItem(first);
        _inventory.AddItem(second);

        CollectionAssert.AreEqual(new[] { first.Id, second.Id }, _inventory.GetItemIds());
    }
}
