const http = require('http');
const enviar = require('./servicios/ServicioEnvioEmail')
const port =  9000
const uri='/notificaciones'


const server = http.createServer((req, res) => {
  handelRequest(req,res)
})

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})

function handelRequest(req,res){
  req.method!=='POST'
  if(req.method!=='POST'){
    res.writeHead(400);
    return res.end(JSON.stringify({'mesageError':'Metodo incorrecto'}));
  }
  else if(req.url!==uri){
    res.writeHead(400);
    return res.end(JSON.stringify({'mesageError':'Ruta Incorrecta'}))
  }
  else 
    return parseRequestAndSend(req,res)

}

function parseRequestAndSend(req,res){
      const size = parseInt(req.headers['content-length'], 10)
      const buffer = Buffer.allocUnsafe(size)
      var pos = 0
          req.on('data', (chunk) => { 
            const offset = pos + chunk.length  
            chunk.copy(buffer, pos) 
            pos = offset 
            data = JSON.parse(buffer.toString())
            return validateReq(data,res)
        })
      }   

        function validateReq(data,res){
          const destinatario=data.destinatario
          const asunto=data.asunto
          const cuerpo=data.cuerpo 
          if (destinatario===undefined|| asunto===undefined||cuerpo===undefined){
            res.writeHead(422)
            res.end(JSON.stringify({'mesageError':'Error de parseo'}))
          }
         else
          return enviar.enviarUnicoEmail(destinatario,asunto,cuerpo,res)
        }