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
    recurso = dir[2];
    servicio = dir[3];
    parametro = dir[4];

    switch (request.method)
    {
        case 'POST':
            if (peticiones.ComprobarRecurso(servicio, 'confirmar'))
            {
                peticiones.AltaReserva(turnos, parametro, data, enviarNotificacion.enviar).then(function (result)
                {
                    peticiones.enviarRespuesta(response, 200);
                    response.end(result);
                }).catch(function(result){
                    peticiones.enviarRespuesta(response, 400);
                    response.end(result);
                });
            }
            else if (peticiones.ComprobarRecurso(servicio, 'solicitar') && servicio == undefined)
            {
                peticiones.VerificarTurno(turnos, parametro).then(function (result)
                {
                    peticiones.enviarRespuesta(response, 200);
                    response.end(result);
                }).catch(function(result){
                    peticiones.enviarRespuesta(response, 400);
                    response.end(result);
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
                peticiones.GetReserva(turnos, parametro).then(function (result)
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
                peticiones.GetReservas(turnos, query).then(function (result)
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
        case 'OPTIONS':
            //Le doy el ok al navegador de que admito cualquier origen
            response.writeHead(200,{
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers':'*',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Credentials' : true})
            response.end("todo ok")
            break;      
    }
});

server.listen(puerto, function()
{
    console.log('Server iniciado');
});