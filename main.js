const { app, Menu, Tray, Notification } = require('electron')
const { scheduleSystemCheck, scheduler } = require('./src/systemcheck')
const { getDoNotDisturb } = require('electron-notification-state')
const { api } = require('./src/server.js')
const path = require('path')

let tray = null
const port = 1761

const contextMenu = [
    { label: 'API state: running..' },
    { label: 'Close', click() { scheduler.stop(); app.quit() } },
]

function startUpNotification() {
    if (getDoNotDisturb()) return

    new Notification({
        title: 'Printer API started!',
        body: 'You can now list printers.',
        silent: true
    }).show()
}

const gotTheLock = app.requestSingleInstanceLock()

if (! gotTheLock) app.quit()

function startRestApi() {
    api.listen(port, () => {
        console.log(`REST service started on port ${port}`)
    })
}

if (process.platform === 'win32') app.setAppUserModelId(process.execPath);

function startApp() {
    const icon = path.join(__dirname, 'src/icon@2x.png')
    tray = new Tray(icon)

    tray.setToolTip('Printer Client')
    tray.setContextMenu(Menu.buildFromTemplate(contextMenu))

    scheduleSystemCheck(port, tray, contextMenu)
    startRestApi()
}

app.whenReady()
    .then(startApp)
    .then(startUpNotification);
