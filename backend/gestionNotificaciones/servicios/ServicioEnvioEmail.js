
const https = require('https');
const { env } = require('process');
const hostname= 'api.sendgrid.com'
const path= '/v3/mail/send'
const port=443


function enviarUnicoEmail(destinatario,asunto,cuerpo,resSer){
  var data = JSON.stringify({
    'personalizations': 
            [{'to':[{"email":destinatario}]}],
            'from': {'email': 'ivovucetic95@gmail.com'},
            'subject': asunto,
            'content': [{'type': 'text/plain', value: cuerpo}]      
});

const options = {
    hostname: hostname,
    port: port,
    path: path,
    method: 'POST',
    headers: {
        'Authorization': 'Bearer '+ 'token' ,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
  };
  return send(options,data,resSer)
}

function enviarListaEmails(destinatarios,asunto,cuerpo,resSer){
      var data = JSON.stringify({
        'personalizations': 
                [{'to':destinatarios}],
                'from': {'email': process.env.USER_SEND_GRID},
                'subject': asunto,
                'content': [{'type': 'text/plain', value: cuerpo}]      
    });

    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+ process.env.TOKEN_SEND_GRID ,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
      };
      return send(options,data,resSer)
  }

   function send(options,data,resSer){
    var req = https.request(options, (res) => {
        res.on('data', (d) => {
        process.stdout.write(d);
      });
      return hanldeResponse(res.statusCode,resSer)
    });
    req.write(data);
    req.end();
  }

    function hanldeResponse(statusCode,resSer){
    if (statusCode==202)
      return resSer.end(JSON.stringify({'message':'Mail/s enviado/s'}))
  else{
    resSer.writeHead(400)
    return resSer.end(JSON.stringify({'error':'Error al enviar mail'}))
 
  }
  }
    exports.enviarUnicoEmail = enviarUnicoEmail
    exports.enviarListaEmails = enviarListaEmails
