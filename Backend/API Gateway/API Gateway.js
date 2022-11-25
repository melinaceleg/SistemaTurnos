const puerto = 6000

const http = require('http');
const { ErrorHandler } = require("./modulos/ErrorHandler");

const peticiones = require('./modulos/peticiones');

const server = http.createServer();

server.on('request',(request, response) =>{
    //[ '', 'api', '' ]
    dir = request.url.split('/');
    recurso = dir[2];
    servicio = dir[3];
    parametro = dir[4];
    let body=''

    request.on('data', (data) =>
     {
        body += data
        if (request.method == 'POST')
        {
            if (peticiones.ComprobarRecurso(recurso, 'reservas') && peticiones.ComprobarRecurso(servicio, 'confirmar'))
            {
                console.log(body);
                peticiones.AltaReserva(request, body)
                .then(function (result)
                {
                    let errorHandler = new ErrorHandler(null)
                    errorHandler.OK(response,result);
                    response.end();
                })
                .catch(function(error){
                    response.writeHead(response.statusCode,{'Content-Type':'application/json'});
                    response.end(error);
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'reservas') && peticiones.ComprobarRecurso(servicio, 'solicitar'))
            {
                peticiones.VerificarTurno(request, response)
                 .then(function (result)
                {

                })
                .catch(function(error){
                    let errorHandler = new ErrorHandler(error);
                        errorHandler.InternalError(response);
                        response.end(JSON.stringify(errorHandler.body));
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
            if (peticiones.ComprobarRecurso(recurso, 'reservas') && parametro != undefined)
            {
                peticiones.GetReserva(request, response).then(function (result)
                {
                })
                .catch(function(result){
                    let errorHandler = new ErrorHandler(error);
                    errorHandler.InternalError(response);
                    response.end(errorHandler.body);
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'reservas'))
            {
                peticiones.GetReservas(request, response).then(function (result)
                {
                })
                .catch(function(result){
                    let errorHandler = new ErrorHandler(error);
                        errorHandler.InternalError(response);
                        response.end(errorHandler.body);
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'sucursales') && parametro != undefined)
            {
                peticiones.GetSucursal(data, request, response).then(function (result)
                {
                })
                .catch(function(error){
                    let errorHandler = new ErrorHandler(error);
                        errorHandler.InternalError(response);
                        response.end(errorHandler.body);
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'sucursales'))
            {
                peticiones.GetSucursales(data, request, response).then(function (result)
                {
                })
                .catch(function(error){
                    let errorHandler = new ErrorHandler(error);
                    errorHandler.InternalError(response);
                    response.end(errorHandler.body);
                });
            } else
            {
                let errorHandler = new ErrorHandler(null);
                errorHandler.NotFound(response);
                response.end(errorHandler.body);
            }

            break;
    }
});

server.listen(puerto, function()
{
    console.log('API Gateway iniciado');
});