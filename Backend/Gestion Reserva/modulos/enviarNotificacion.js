const puerto = '9000';

const http = require('http');

function enviar(turno)
{    
    destinatario = turno.email;
    asunto = "turno agregado";
    cuerpo = turno.dateTime;

    const data = JSON.stringify({
        destinatario: destinatario,
        asunto: asunto,
        cuerpo : cuerpo
    });
    var options = {
        //hostname: 'localhost',
        method: 'POST',
        path: '/notificacion',

        port: puerto,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
      };

      const request = http.request(options, function (response) {

        /*let body = ''
      
        console.log('Status Code:', response.statusCode);
      
        response.on('data', (chunk) => {
          body += chunk;
        });
      
        response.on('end', () => {
            console.log('Body: ', JSON.parse(body));
        });*/
      });
      
      request.write(data);
      request.end();
}

exports.enviar = enviar;
