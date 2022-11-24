const puerto = 6000

const http = require('http');

const peticiones = require('./modulos/peticiones');

const server = http.createServer(function (request, response){
    //[ '', 'api', '' ]
    dir = request.url.split('/');
    recurso = dir[2];
    servicio = dir[3];
    parametro = dir[4];

    switch (request.method)
    {
        case 'POST':
            if (peticiones.ComprobarRecurso(recurso, 'reservas') && peticiones.ComprobarRecurso(servicio, 'confirmar'))
            {
                console.debug(response);
                peticiones.AltaReserva(request, response).then(function (result)
                {
                }).catch(function(result){
                    peticiones.enviarRespuesta(response, 400);
                    response.end();
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'reservas') && peticiones.ComprobarRecurso(servicio, 'solicitar'))
            {
                peticiones.VerificarTurno(request, response).then(function (result)
                {
                }).catch(function(result){
                    peticiones.enviarRespuesta(response, 400);
                    response.end();
                });
            } else
            {
                peticiones.enviarRespuesta(response, 400);
                response.end();
            }
            break;
        case 'GET':
            if (peticiones.ComprobarRecurso(recurso, 'reservas') && parametro != undefined)
            {
                peticiones.GetReserva(request, response).then(function (result)
                {
                }).catch(function(result){
                    peticiones.enviarRespuesta(response, 400);
                    response.end();
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'reservas'))
            {
                peticiones.GetReservas(request, response).then(function (result)
                {
                }).catch(function(result){
                    peticiones.enviarRespuesta(response, 400);
                    response.end();
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'sucursales') && parametro != undefined)
            {
                peticiones.GetSucursal(data, request, response).then(function (result)
                {
                }).catch(function(result){
                    peticiones.enviarRespuesta(response, 400);
                    response.end();
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'sucursales'))
            {
                peticiones.GetSucursales(data, request, response).then(function (result)
                {
                }).catch(function(result){
                    peticiones.enviarRespuesta(response, 400);
                    response.end();
                });
            } else
            {
                peticiones.enviarRespuesta(response, 400);
                response.end();
            }

            break;
    }
});

server.listen(puerto, function()
{
    console.log('API Gateway iniciado');
});