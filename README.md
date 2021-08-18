# printer-api

Printer API allows us to use locally installed printers to print
documents from a web application. It starts a simple [expressjs](https://expressjs.com/)
server which exposes a basic REST API.

## Usage

Get the current state:

```bash
curl localhost:1761/status
```

Get all printers:

```bash
curl localhost:1761/printers
```

Upload a PDF. This requires the `document` field to be a PDF.

```bash
curl http://localhost:1761/print\?printer\=PRINTERNAME -F "document=@Confirmation1.pdf"
```

Use an URL to upload

```bash
curl -X POST http://localhost:1761/print\?printer\=PRINTERNAME\&url\=http://pdf.com
```
