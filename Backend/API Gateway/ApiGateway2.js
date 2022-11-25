const puerto = 6000

const http = require('http');

const peticiones = require('./modulos/peticiones');

const server = http.createServer(function (request, response){
    //[ '', 'api', '' ]
    dir = request.url.split('/');
    recurso = dir[2];
    servicio = dir[3];
    paremtro = dir[4];

    switch (request.method)
    {
        case 'POST':
            if (peticiones.ComprobarRecurso(recurso, 'reservas') && peticiones.ComprobarRecurso(servicio, 'confirmar'))
            {
                peticiones.AltaReserva(data, request, response).then(function (result)
                {
                }).catch(function(result){
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'reservas') && peticiones.ComprobarRecurso(servicio, 'solicitar'))
            {
                peticiones.VerificarTurno(data, request, response).then(function (result)
                {
                }).catch(function(result){
                });
            }
            break;
        case 'GET':
            if (peticiones.ComprobarRecurso(recurso, 'reservas') && parametro != undefined)
            {
                peticiones.GetReserva(data, response).then(function (result)
                {
                }).catch(function(result){
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'reservas'))
            {
                peticiones.GetReservas(data, response).then(function (result)
                {
                }).catch(function(result){
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'sucursales') && parametro != undefined)
            {
                peticiones.GetSucursal(data, request, response).then(function (result)
                {
                }).catch(function(result){
                });
            }
            else if (peticiones.ComprobarRecurso(recurso, 'sucursales'))
            {
                peticiones.GetSucursales(data, request, response).then(function (result)
                {
                }).catch(function(result){
                });
            }

            break;
    }
});

server.listen(puerto, function()
{
    console.log('API Gateway iniciado');
});