const puerto = 4000

const http = require('http');
const url = require('url');

const manejoTurnos = require('./modulos/manejoTurnos');
const peticiones = require('./modulos/peticiones');
const enviarNotificacion = require('./modulos/enviarNotificacion');

//manejoTurnos.GuardarTurnos(manejoTurnos.CrearJSON(20, 2022, 09, 02, 10, 00, 30));

let turnos = manejoTurnos.CargarTurnos();
/*let turnos;
manejoTurnos.CargarTurnos().then(function (result)
{
    turnos = result;
}).catch(function(result){

});*/

const server = http.createServer(function (request, response){

    dir = request.url.split('/');
    recurso = dir[1];
    parametro = dir[2];

    switch (request.method)
    {
        case 'POST':
            if (peticiones.ComprobarRecurso(recurso, 'confirmar'))
            {
                request.on('data', function(data) {
                    peticiones.AltaReserva(turnos, parametro, data, enviarNotificacion.enviar).then(function (result)
                    {
                        //enviarNotificacion.enviar(turnos[parametro]);
                        //response.write(resp);
                        peticiones.enviarRespuesta(response, 200, result);
                    }).catch(function(result){
                        peticiones.enviarRespuesta(response, 400, result);
                    });
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'solicitar'))
            {
                request.on('data', function() {
                    peticiones.VerificarTurno(turnos, parametro).then(function (result)
                    {
                        //response.write(resp);
                        peticiones.enviarRespuesta(response, 200, result);
                    }).catch(function(result){
                        peticiones.enviarRespuesta(response, 400, result);
                    });
                });
            } 
            break;
        case 'GET':
            if (peticiones.ComprobarRecurso(recurso, 'reservas?'))
            {
                request.on('data', function() {
                    peticiones.GetReservas(turnos, url.parse(recurso, true).query).then(function (result)
                    {
                        //response.write(resp);
                        peticiones.enviarRespuesta(response, 200, result);
                    }).catch(function(result){
                        peticiones.enviarRespuesta(response, 400, result);
                    });
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'reservas'))
            {
                request.on('data', function() {
                    peticiones.GetReserva(turnos, parametro).then(function (result)
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
    console.log('Server iniciado');
});