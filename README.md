# printer-api

Printer API allows us to use locally installed printers to print
documents from a web application. It starts a simple [expressjs](https://expressjs.com/)
server which exposes a basic REST API.

## Installation

Download the latest [release](https://github.com/coppertrack/printer-api/releases)
and install it on your local machine.

## Usage

### Curl & endpoints

Get the current state:

```bash
curl localhost:1761/status
```

Get all printers:

```bash
curl localhost:1761/printers
```

Upload a PDF to the api. This requires the `document` field to be a PDF:

```bash
curl http://localhost:1761/print\?printer\=PRINTERNAME -F "document=@Confirmation1.pdf"
```

Print the pdf from a url:

```bash
curl -X POST http://localhost:1761/print\?printer\=PRINTERNAME\&url\=http://pdf.com
```

### Javascript

In our Javascript example we assume you can download a pdf
from a specific location in your application. We use javascript,
as this (probably) allows us to reuse an existing session
should the pdf require authentication.

```javascript
<script>
    function printPdf(url, printer) {
        fetch(url, {method: 'GET'})
            .then(response => response.blob())
            .then((blob) => {
                const data = new FormData()
                data.append('document', blob)

                fetch(`http://localhost:1761/print?printer=${printer}`, {
                    method: 'POST',
                    body: data,
                })
            })
    }
</script>
```

## Tests

Sorry, this code doesn't come with tests yet.

## License & support

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Sensson does not provide commercial support or paid development.
