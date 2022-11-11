const http = require('http');
const url = require('url')
const enviar = require('./servicios/ServicioEnvioEmail')
const port =  9000
const baseUri='localhost'
const uri='notificaciones'

const server = http.createServer((req, res) => {
    const  pathname  = url.parse(req.url)
    const size = parseInt(req.headers['content-length'], 10)
    const buffer = Buffer.allocUnsafe(size)
    var pos = 0
    if(req.method==='POST')
        req 
        .on('data', (chunk) => { 
          const offset = pos + chunk.length 
          if (offset > size) { 
            reject(413, 'Too Large', res) 
            return 
          } 
          chunk.copy(buffer, pos) 
          pos = offset 
        }) 
        .on('end', () => { 
          if (pos !== size) { 
            reject(400, 'Bad Request', res) 
            return 
          } 
          const data = JSON.parse(buffer.toString())
          response=enviar.enviar(data.email,data.asunto,data.msg)
          res.setHeader('Content-Type', 'application/json;charset=utf-8');
          res.end('You Posted: ' + JSON.stringify(response))
        }
        )

})
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
