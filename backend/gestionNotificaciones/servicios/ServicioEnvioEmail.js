
const { Console } = require('console');
const https = require('https')

function enviar(email,asunto,msg){
      var data = JSON.stringify({
        'personalizations': 
                [{'to': [{'email': email}]}],
                'from': {'email': 'erik.nrs@gmail.com'},
                'subject': asunto,
                'content': [{'type': 'text/plain', value: msg}]      
    });


    const options = {
        hostname: 'api.sendgrid.com',
        port: 443,
        path: '/v3/mail/send',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
      };
      var response='';
      const req = https.request(options, (res) => {
        console.log(res.statusCode)
        if (res.statusCode==202){
            console.log(res.statusCode)
            response = 'Notificacion Enviada';
          }
        else
            response= 'Fallo el envio de mail';

      });
      
      req.write(data);
      console.log(response)
      req.end('hola');
      
      return response

    }
    exports.enviar = enviar
