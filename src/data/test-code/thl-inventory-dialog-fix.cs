// DialogController.cs
public bool IsDialogActive => _isWork;

// InputController.cs
private bool CanToggleInventory()
{
    if (DialogController.Instance == null || !DialogController.Instance.IsDialogActive) return true;

    // Во время диалога инвентарь можно только закрыть, если он уже открыт.
    PlayerInventory inventory = _playerBrain.GetPlayerInventory();
    return inventory != null && inventory.IsInventoryOpen();
}

private void Update()
{
    if (Input.GetKeyDown(KeyCode.I))
    {
        if (_playerBrain == null) _playerBrain = PlayerBrain.Instance;
        if (_playerBrain != null && CanToggleInventory()) _playerBrain.ToggleInventory();
        return;
    }
    // ...
}
