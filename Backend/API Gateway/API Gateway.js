const puerto = 6000

const http = require('http');

const peticiones = require('./modulos/peticiones');

const server = http.createServer(function (request, response){
    //[ '', 'api', '' ]
    let dir = request.url.split('/');
    let body;
    let recurso = dir[2];
    let servicio = dir[3];
    let parametro = dir[4];

    request.on('data', function(data)
    {
        body += data;
    });

    request.on('end', function(data)
    {
        switch (request.method)
        {
            case 'POST':
                if (peticiones.ComprobarRecurso(recurso, 'reservas') && peticiones.ComprobarRecurso(servicio, 'confirmar'))
                {
                    peticiones.AltaReserva(body, request, response).then(function (result)
                    {
                    }).catch(function(result){
                        peticiones.enviarRespuesta(response, 400);
                        response.end();
                    });
                }
                else if (peticiones.ComprobarRecurso(recurso, 'reservas') && peticiones.ComprobarRecurso(servicio, 'solicitar'))
                {
                    peticiones.VerificarTurno(body, request, response).then(function (result)
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
    
});

server.listen(puerto, function()
{
    console.log('API Gateway iniciado');
});