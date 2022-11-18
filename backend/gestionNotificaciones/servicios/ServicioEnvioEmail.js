
const { Console } = require('console');
const https = require('https')
const hostname= 'api.sendgrid.com'
const path= '/v3/mail/send'

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
      var req = https.request(options, (res) => {
        var response
        console.log(res.statusCode)
        if (res.statusCode==202){
            console.log(res.statusCode)
            response= "Email enviado";
          }
        else
            response= (error ={
              message:"Error al enviar el mail"
            });
            return response
      }
      );
    req.end('hola')
    }
    exports.enviar = enviar
