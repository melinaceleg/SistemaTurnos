
const { Console } = require('console');
const https = require('https');
const { env } = require('process');
const hostname= 'api.sendgrid.com'
const path= '/v3/mail/send'
let okResponse = false
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
            'Authorization': 'Bearer '+ process.env.TOKEN_SEND_GRID ,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
      };
     var req = https.request(options, (res) => {
        if (res.statusCode=='202'){
          okResponse=true;
        }      
        res.on('data', (d) => {
          process.stdout.write(d);
        });
      return res.statusCode
      });
      req.write(data);
      req.end();
      if (okResponse)
        return {'message':'Mail enviado'}
      else
        return{'error':'Error al enviar mail'}
  }
    exports.enviar = enviar
