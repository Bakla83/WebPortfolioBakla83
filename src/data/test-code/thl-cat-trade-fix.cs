// ProgressFlags.cs: один ключ на два скрипта
public const string CatExchangeDone = "cat_exchange_done";

// CatQuestProgress.cs: квест кота пишет флаг
private const string F_EXCHANGE_DONE = ProgressFlags.CatExchangeDone;

// CircleTableMiniGameWorld.cs: стол читает тот же флаг
bool tradeCompleted = ProgressFlags.Get(ProgressFlags.CatExchangeDone, false);
