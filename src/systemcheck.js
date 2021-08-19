const { Menu, net } = require('electron')
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const http = require('http')

const scheduler = new ToadScheduler()

function systemCheck(port) {
    // return http.get({host: `http://127.0.0.1:${port}/status`}, function (response) {
    //     return response.statusCode === 200;
    // })

    const request = net.request(`http://127.0.0.1:${port}/status`)
    return request.on('response', (response) => {
        return response.statusCode === 200
    })
}

function scheduleSystemCheck(port, tray, contextMenu) {
    const task = new Task('system check', () => {
        contextMenu[0].label = systemCheck(port)
            ? 'API state: running..'
            : 'API state: error..'

        const menu = Menu.buildFromTemplate(contextMenu)
        tray.setContextMenu(menu)
    })

    scheduler.addSimpleIntervalJob(new SimpleIntervalJob({ seconds: 10 }, task))
}

module.exports.scheduler = scheduler
module.exports.scheduleSystemCheck = scheduleSystemCheck
