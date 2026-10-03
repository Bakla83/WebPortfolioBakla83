// SaveManager.cs
private void OnApplicationQuit()
{
    if (SceneManager.GetActiveScene().buildIndex == 0)
        return;

    // Слот ещё ни разу не сохранялся, а игрока в сцене нет (идёт ролик):
    // писать нечего, иначе в файл попадёт позиция (0, 0, 0).
    if (_current != null && _current.lastSavedUtcTicks == 0 && FindPlayerForSave() == null)
        return;

    SaveNow();
}
