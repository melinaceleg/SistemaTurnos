const puerto = 4000

const http = require('http');
const url = require('url');

const manejoTurnos = require('./modulos/manejoTurnos');
const peticiones = require('./modulos/peticiones');
const enviarNotificacion = require('./modulos/enviarNotificacion');

//manejoTurnos.GuardarTurnos(manejoTurnos.CrearJSON(20, 2022, 09, 02, 10, 00, 30));

//let turnos = manejoTurnos.CargarTurnos();
/*let turnos;
manejoTurnos.CargarTurnos().then(function (result)
{
    turnos = result;
}).catch(function(result){

});*/

const server = http.createServer(function (request, response){
    dir = request.url.split('/');
    recurso = dir[2];
    servicio = dir[3];
    parametro = dir[4];

    switch (request.method)
    {
        case 'POST':
            if (peticiones.ComprobarRecurso(servicio, 'confirmar'))
            {
                
                peticiones.parseRequestAlta(request,manejoTurnos.CargarTurnos(), parametro, enviarNotificacion.enviar,response)
            }
                else if (peticiones.ComprobarRecurso(servicio, 'solicitar'))

                peticiones.parseRequestVerificar(request,manejoTurnos.CargarTurnos(),parametro,response)
            else
            {
                peticiones.enviarRespuesta(response, 400);
                response.end();
            }
            break;
        case 'GET':
            if (peticiones.ComprobarRecurso(recurso, 'reservas') && parametro != undefined)
            {

                peticiones.GetReserva(manejoTurnos.CargarTurnos(), parametro).then(function (result)

                {
                    peticiones.enviarRespuesta(response, 200);
                    response.end(result);
                }).catch(function(result){
                    peticiones.enviarRespuesta(response, 400);
                    response.end(result);
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'reservas'))
            {
                query = url.parse(request.url, true).query;
                peticiones.GetReservas(manejoTurnos.CargarTurnos(), query).then(function (result)
                {
                    peticiones.enviarRespuesta(response, 200);
                    response.end(result);
                }).catch(function(result){
                    peticiones.enviarRespuesta(response, 400);
                    response.end(result);
                });
            } 
            else
            {
                peticiones.enviarRespuesta(response, 400);
                response.end();
            }

            break;
    }
});

server.listen(puerto, function()
{
    console.log('Server iniciado');
});