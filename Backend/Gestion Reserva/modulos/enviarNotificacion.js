const puerto = '9000';

const http = require('http');

async function enviar(turno)
{    
    destinatario = turno.email;
    asunto = "turno agregado";
    cuerpo = turno.dateTime;

    const data = await JSON.stringify({
        destinatario: destinatario,
        asunto: asunto,
        cuerpo : cuerpo
    });
    var options = {
        hostname: 'localhost',
        method: 'POST',
        path: '/api/notificaciones',

        port: puerto,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
      };
      send(options,data)
    }


async function send(options,data){
  var req = http.request(options, (res) => {
      res.on('data', (d) => {
      process.stdout.write(d);
      hanldeResponse(res.statusCode)
    })

  });
  req.on('error', function(err) {
    console.log("Error de conexion!")
});
    req.write(data);
    req.end();   
}
  async function hanldeResponse(statusCode){
  if (statusCode==200)
    return console.log('Notificaion de turno enviada')
else
     return console.log('Error al notificar turno')
    
  }


exports.enviar = enviar;