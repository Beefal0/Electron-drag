const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    windowDrag: ({draggable, mouseStartX, mouseStartY}) => ipcRenderer.send('window-drag', {
        draggable, mouseStartX, mouseStartY,
    })
})