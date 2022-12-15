// Operate dom instance，you can use ref in your react/vue project to get dom instance
const target = document.getElementById('dragMask')
target.onpointerdown = handlePointerDown
target.onpointerup = handlePointerUp

function handlePointerDown(e) {
    // Triggered by the left mouse button
    if (e.button !== 0) return

    window.electronAPI.windowDrag({
        draggable: true,
        mouseStartX: Math.round(e.screenX),
        mouseStartY: Math.round(e.screenY)
    })

    target.setPointerCapture(e.pointerId)
}

function handlePointerUp(e) {
    window.electronAPI.windowDrag({
        draggable: false
    })
    target.releasePointerCapture(e.pointerId)
}