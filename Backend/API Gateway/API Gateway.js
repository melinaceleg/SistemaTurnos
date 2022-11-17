const puerto = 4000

const http = require('http');

const peticiones = require('./modulos/peticiones');

const server = http.createServer(function (request, response){
    //[ '', 'api', '' ]
    dir = request.url.split('/');
    recurso = dir[1];
    servicio = dir[2];

    switch (request.method)
    {
        case 'POST':
            if (peticiones.ComprobarRecurso(recurso, 'api'))
            {
                request.on('data', function(data) {
                    peticiones.AltaReserva(data).then(function (result)
                    {
                        //enviarNotificacion.enviar(turnos[parametro]);
                        //response.write(resp);
                        peticiones.enviarRespuesta(response, 200, result);
                    }).catch(function(result){
                        peticiones.enviarRespuesta(response, 400, result);
                    });
                });
            }
            break;
        case 'GET':
            if (peticiones.ComprobarRecurso(servicio, ''))
            {
                request.on('data', function() {
                    peticiones.GetTurnosUsuario(data).then(function (result)
                    {
                        //response.write(resp);
                        peticiones.enviarRespuesta(response, 200, result);
                    }).catch(function(result){
                        peticiones.enviarRespuesta(response, 400, result);
                    });
                });
            }
            else if (peticiones.ComprobarRecurso(servicio, 'sucursales'))
            {
                request.on('data', function() {
                    peticiones.GetSucursales(data).then(function (result)
                    {
                        //response.write(resp);
                        peticiones.enviarRespuesta(response, 200, result);
                    }).catch(function(result){
                        peticiones.enviarRespuesta(response, 400, result);
                    });
                });
            }

            break;
    }
});

server.listen(puerto, function()
{
    console.log('API Gateway iniciado');
});