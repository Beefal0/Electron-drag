const target = document.getElementById('dragMask')
target.onpointerdown = handlePointerDown
target.onpointerup = handlePointerUp

function handlePointerDown(e) {
    if (e.button !== 0) return
    if (e.target.nodeName === 'I') return

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