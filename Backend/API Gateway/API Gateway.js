const puerto = 8000

const http = require('http');
const { ErrorHandler } = require("./modulos/ErrorHandler");

const peticiones = require('./modulos/peticiones');

const server = http.createServer();

server.on('request',(request, response) =>{
    //[ '', 'api', '' ]
    dir = request.url.split('/');
    recurso = dir[2];
    let body=''

    request.on('data', (data) =>
    {
        body += data
        if (request.method == 'POST')
        {
            if (peticiones.ComprobarRecurso(recurso, 'reservas'))
            {
                console.log(body);
                peticiones.AltaReserva(request, body)
                .then(function (result)
                {
                    let errorHandler = new ErrorHandler(null)
                    errorHandler.OK(response,result);
                    response.end(JSON.stringify(result));
                })
                .catch(function(error){
                    response.writeHead(400,{'Content-Type':'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers':'*',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Credentials' : true});
                    response.end(error);
                });
            }            
            else
            {
                let errorHandler = new ErrorHandler(null);
                errorHandler.NotFound(response);
                response.end(errorHandler.body);
            }
        }
     })
    request.on('error', (error) => {
        let errorHandler = new ErrorHandler(error);
        errorHandler.InternalError(response);
        response.end(errorHandler.body);
    })

    switch (request.method)
    {
        case 'GET':
            if (peticiones.ComprobarRecurso(recurso, 'reservas'))
            {
                peticiones.GetReservas(request, response).then(function (result)
                {
                    let errorHandler = new ErrorHandler(null)
                    errorHandler.OK(response,result);
                    response.end(JSON.stringify(result));
                })
                .catch(function(result){
                    response.writeHead(400,{'Content-Type':'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers':'*',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Credentials' : true});
                    response.end(JSON.stringify(result));
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'sucursales'))
            {
                peticiones.GetSucursales(request).then(function (result)
                {
                    let errorHandler = new ErrorHandler(null)
                    errorHandler.OK(response,result);                    
                    response.end(JSON.stringify(result));
                })
                .catch(function(result){
                    response.writeHead(400,{'Content-Type':'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers':'*',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Credentials' : true});
                    response.end(JSON.stringify(result));
                });
            }
            else
            {
                let errorHandler = new ErrorHandler(null);
                errorHandler.NotFound(response);
                response.end(errorHandler.body);
            }

            break;
            case 'OPTIONS':
            //Le doy el ok al navegador de que admito cualquier origen
            response.writeHead(200,{
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers':'*',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Credentials' : true})
            response.end('')
            break;
    }
});

server.listen(puerto, function()
{
    console.log('API Gateway iniciado');
});