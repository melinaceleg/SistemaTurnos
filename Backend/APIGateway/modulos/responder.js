const http = require('http');

function enviar(data, options)
{    
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