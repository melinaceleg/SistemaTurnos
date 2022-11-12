const puerto = 4000

const http = require('http');
const url = require('url');

const manejoTurnos = require('./modulos/manejoTurnos');
const peticiones = require('./modulos/peticiones');
const enviarNotificacion = require('./modulos/enviarNotificacion');

//manejoTurnos.GuardarTurnos(manejoTurnos.CrearJSON(20, 2022, 09, 02, 10, 00, 30));

let turnos = manejoTurnos.CargarTurnos();

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
                    resp = peticiones.AltaReserva(turnos, parametro, data, enviarNotificacion.enviar);
                    //enviarNotificacion.enviar(turnos[parametro]);
                    response.write(resp);
                    response.end();
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'solicitar'))
            {
                request.on('data', function() {
                    resp = peticiones.VerificarTurno(turnos, parametro);
                    response.write(resp);
                    response.end();
                });
            } 
            break;
        case 'GET':
            if (peticiones.ComprobarRecurso(recurso, 'reservas?'))
            {
                request.on('data', function() {
                    resp = peticiones.GetReservas(turnos, url.parse(recurso, true).query);
                    response.write(resp);
                    response.end();
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'reservas'))
            {
                request.on('data', function() {
                    resp = peticiones.GetReserva(turnos, parametro);
                    response.write(resp);
                    response.end();
                });
            }

            break;
    }
});

server.listen(puerto, function()
{
    console.log('Server iniciado');
});