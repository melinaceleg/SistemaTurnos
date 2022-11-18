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
        handleResponse(req,res)
    else{
        res.writeHead(405)
        res.end(JSON.stringify({'mesageError':'Metodo incorrecto'}))
    }

})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})


function handleResponse(req,res){
    var msg=''
    var asunto=''
    var email=''
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    if(url.req.url!=='/notificaiones'){
      res.writeHead(404)
      res.end(JSON.stringify({'mesageError':'Ruta Incorrecta'}))
    }
    else{
      const size = parseInt(req.headers['content-length'], 10)
      const buffer = Buffer.allocUnsafe(size)
      var pos = 0
      try{
        req.on('data', (chunk) => { 
          const offset = pos + chunk.length 
          if (offset > size) { 
            reject(413, 'Too Large', res) 
            return 
          }  
        chunk.copy(buffer, pos) 
        pos = offset 
        })
        const data = JSON.parse(buffer.toString())
        msg=data.msg
        asunto=data.asunto
        email=data.email
        response=enviar.enviar(data.email,data.asunto,data.msg)
        res.end()

      }
      catch{
        res.writeHead(422)
        res.end(JSON.stringify({'mesageError':'Error de parseo'}))
      }
     
      response=enviar.enviar(data.email,data.asunto,data.msg)
      
      res.setHeader('Content-Type', 'application/json;charset=utf-8');
      res.end(response)
    }
}