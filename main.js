const { app, Menu, Tray, nativeImage } = require('electron')
const { scheduleSystemCheck, scheduler } = require('./src/systemcheck')
const { api } = require('./src/server.js')
const path = require('path')

let tray = null
const port = 1761

const contextMenu = [
    { label: 'API state: running..' },
    { label: 'Close', click() { scheduler.stop(); app.quit() } },
]

const gotTheLock = app.requestSingleInstanceLock()

if (! gotTheLock) app.quit()

function startRestApi() {
    api.listen(port, () => {
        console.log(`REST service started on port ${port}`)
    })
}

app.whenReady().then(() => {
    const icon = path.join(__dirname, 'src/icon@2x.png')
    tray = new Tray(icon)

    tray.setToolTip('Printer Client')
    tray.setContextMenu(Menu.buildFromTemplate(contextMenu))

    scheduleSystemCheck(port, tray, contextMenu)
    startRestApi()
});

require('update-electron-app')()
