// PlayerMoveController.cs
private void SetStartMove(Action moveDone)
{
    _moving = true;
    _callBackMoveDone = moveDone;
    _transformTarget.position = new Vector3(_target.x, _target.y, _transformTarget.position.z);

    TurnPlayer(_target);
    _playerAnimController.SetMove();

    // Гасит и освобождает прошлый экземпляр, прежде чем создать новый.
    StopFootsteps();

    footstepsInstance = RuntimeManager.CreateInstance(footstepsEvent);
    footstepsInstance.start();

    _footstepCoroutine = StartCoroutine(PlayFootstepsLoop());
}
