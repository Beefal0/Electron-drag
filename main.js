const { app, BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path')
let mainWindow = undefined
const dragTarget = {
    startPosition: {
        x: 0,
        y: 0
    },
    mouseStartPosition: {
        x: 0,
        y: 0
    },
    interval: null
}
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 256,
        height: 180,
        resizable: false,
        frame: false,
        minimizable: false,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadFile('index.html').then(() => {
        console.log('load success!')
    }).catch(() => {
        console.log('load error!')
    })

    ipcMain.on('window-drag', (event, {
        draggable, mouseStartX, mouseStartY
    }) => {
        if (mainWindowNotDestroyed()) {
            if (draggable) {
                const winPosition = mainWindow.getPosition()
                dragTarget.startPosition = { x: winPosition[0], y: winPosition[1] }
                dragTarget.mouseStartPosition = screen.getCursorScreenPoint()
                
                clearInterval(dragTarget.interval)
                
                dragTarget.interval = setInterval(() => {
                    const cursorPosition = screen.getCursorScreenPoint()
                    const x = dragTarget.startPosition.x + cursorPosition.x - mouseStartX
                    const y = dragTarget.startPosition.y + cursorPosition.y - mouseStartY
                    
                    if (mainWindowNotDestroyed()) {
                        /**
                         * To dynamically change the window position, you must use setBounds instead of setPosition, and the width and height are fixed
                         * Because when your screen zoom ratio is not 100%, the return value of getSize has a deviation of 1px,
                         * and the underlying code of setPosition calls getSize, so calling setPosition frequently will make your window gradually larger
                         * reference link: https://github.com/electron/electron/issues/9477
                        */
                        mainWindow.setBounds({
                            width: 256,
                            height: 180,
                            x: x,
                            y: y
                        })
                    }
                }, 0)
            } else {
                clearInterval(dragTarget.interval)
                dragTarget.interval = null
            }
        }
    })
}

function mainWindowNotDestroyed() {
    return mainWindow && !mainWindow.isDestroyed()
}

app.whenReady().then(() => {
    createWindow()
})