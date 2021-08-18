import express, { request } from 'express'
import fs from 'fs';
import ptp from 'pdf-to-printer'
import path from 'path'
import fileUpload from 'express-fileupload';
import requestPromise from 'request-promise-native';

const app = express()
const port = 1761

async function downloadDocumentFromUrl(url, filename) {
    let pdfBuffer = await requestPromise.get({ uri: url, encoding: null })
    fs.writeFileSync(filename, pdfBuffer)
}

app.use(fileUpload())

app.get('/status', function (request, response) {
    response.status(200).send({'status': 'Up and running!'})
})

app.get('/printers', function (request, response) {
    ptp.getPrinters()
        .then(result => {
            response.status(200).send(result)
         })
})

app.post('/print', async(request, response) => {
    if (request.params.url && (!request.files || Object.keys(request.files).length === 0)) {
        return response.status(400).send({'error': 'No files were uploaded and the url parameter is missing.'});
    }

    const options = {
        unix: ["-o fit-to-page"],
        win32: ['-print-settings "fit"'],
    }

    if (request.query.printer) {
        options.printer = request.query.printer
    }

    const temporaryFileLocation = path.join(`./tmp/${Math.random().toString(36).substr(7)}.pdf`)

    if (request.files) await request.files.document.mv(temporaryFileLocation)
    if (request.query.url) await downloadDocumentFromUrl(request.query.url, temporaryFileLocation)

    ptp.print(temporaryFileLocation, options)
        .then(result => {
            fs.unlinkSync(temporaryFileLocation)
            response.status(204).send({'state': result})
        })
        .catch(error => {
            console.error(error)
            fs.unlinkSync(temporaryFileLocation)
            response.status(500).send({
                'error': 'Something went wrong. Did you select the right printer?'
            })
        })
})

app.listen(port, () => {
    console.log(`REST service started on port ${port}`)
})
