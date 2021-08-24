const { app, Menu, Tray, Notification } = require('electron')
const { scheduleSystemCheck, scheduler } = require('./src/systemcheck')
const { getDoNotDisturb } = require('electron-notification-state')
const { api } = require('./src/server.js')
const path = require('path')

let tray = null
const port = 1761
const version = '0.0.6'

const contextMenu = [
    { label: `API ${version}: running..` },
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
    api.listen(port, '127.0.0.1', () => {
        console.log(`REST service started on http://127.0.0.1:${port}.`)
    })

    api.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
            new Notification({
                title: 'Printer API service already running.',
                silent: true
            }).show()
        }
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
