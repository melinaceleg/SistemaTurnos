
//MANEJO DE TURNOS
function CrearTurno(_idReserva, _dateTime, _userId, _email, _branchId, _status)
{
    var persona = 
    {
        idReserva: _idReserva, // id numérico único que representa el turno
        dateTime: _dateTime, // formato ISO String
        userId: _userId, // id de usuario si está registrado, o 0 si no lo está
        email: _email, // email del usuario
        branchId: _branchId, // id de la sucursal
        status: _status // id de la sucursal
    }

    return persona;
}

function BuscarReserva(turnos, id)
{
    let len = turnos.length;
    let i = 0;
    while (i < len && turnos[i].idReserva != id){
        i++;
    }
    return i < len? i:-1;
}

function CargarTurnos()
{
    return JSON.parse(fs.readFileSync('turnos.json', 'utf8'));
}
function AgregarTurno(turnos, t)
{
    let i = turnos.length - 1;
    while (i > 0 && turnos[i].idReserva > t.idReserva)
    {
        turnos[i+1] = turnos[i];
        i--;
    }
    turnos[i+1] = t;
}

function GuardarTurnos(turnos)
{
    jsonData = JSON.stringify(turnos);
    
    fs.writeFile("turnos.json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

//PETICIONES
function ComprobarRecurso(rec, recurso)
{
    return rec.includes(recurso);
    //return rec == recurso;
}
function AltaReserva(turnos, idReserva, data)
{
    d = JSON.parse(data);
    indice = BuscarReserva(turnos, idReserva);
    if (indice != -1 && turnos[indice].status == 0)
    {
        turnos[indice].email = d.email;
        turnos[indice].userId = d.userId;
        turnos[indice].status = 1;
        //AgregarTurno(turnos, CrearTurno(idReserva, "2022-09-02T19:58:10.406Z", d.userId, d.email, 3));
        GuardarTurnos(turnos);
        console.debug('turno agregado!');
    }
    else
    {
        console.debug('turno ocupado!');
    }
    return JSON.stringify('');
}
function VerificarTurno(turnos, idReserva)
{
    let i = 0;
    let len = turnos.length;
    //d = JSON.parse(data);

    while (i < len && turnos[i].idReserva < idReserva)
    {
        i++;
    }

    return JSON.stringify({
        res: turnos[i].idReserva == idReserva && turnos[i].status == 0? 1: 0
    });
}
function GetReservas(turnos, parametros)
{
    let nTurnos = turnos.slice(0);
    let i;
    let len;

    if (parametros.userId != undefined)
    {
        len = nTurnos.length;
        for (i = 0; i < len; i++)
        {
            if (nTurnos[i].userId != parametros.userId)
            {
                nTurnos.splice(i, 1);
                i--;
                len--;
            }
        }
    }
    if (parametros.dateTime != undefined)
    {
        len = nTurnos.length;
        for (i = 0; i < len; i++)
        {
            if (nTurnos[i].dateTime != parametros.dateTime)
            {
                nTurnos.splice(i, 1);
                i--;
                len--;
            }
        }
    }
    if (parametros.branchId != undefined)
    {
        len = nTurnos.length;
        for (i = 0; i < len; i++)
        {
            if (nTurnos[i].branchId != parametros.branchId)
            {
                nTurnos.splice(i, 1);
                i--;
                len--;
            }
        }  
    }
    return JSON.stringify(nTurnos);
}
function GetReserva(turnos, idReserva)
{
    let indice = BuscarReserva(turnos, idReserva);
    return JSON.stringify(indice != -1? turnos[indice]:'');
}
//MAIN
const fs = require('fs');
const http = require('http');
const url = require('url');

let turnos = CargarTurnos();

const server = http.createServer(function (request, response){

    dir = request.url.split('/');
    recurso = dir[1];
    parametro = dir[2];

    switch (request.method)
    {
        case 'POST':
            if (ComprobarRecurso(recurso, 'confirmar'))
            {
                request.on('data', function(data) {
                    resp = AltaReserva(turnos, parametro, data);
                    response.write(resp);
                    response.end();
                });
            }
            else if (ComprobarRecurso(recurso, 'solicitar'))
            {
                request.on('data', function() {
                    resp = VerificarTurno(turnos, parametro);
                    response.write(resp);
                    response.end();
                });
            } 
            break;
        case 'GET':
            if (ComprobarRecurso(recurso, 'reservas?'))
            {
                request.on('data', function() {
                    resp = GetReservas(turnos, url.parse(recurso, true).query);
                    response.write(resp);
                    response.end();
                });
            }
            else if (ComprobarRecurso(recurso, 'reservas'))
            {
                request.on('data', function() {
                    console.debug("Get3");
                    resp = GetReserva(turnos, parametro);
                    response.write(resp);
                    response.end();
                });
            }

            break;
    }
});

server.listen(4000, function()
{
    console.log('Server iniciado');
});


//Cliente con Gestion de Notificaciones
/*const http = require('http');
http.get('http://localhost:4000/', (response) =>
{
    response.on('data', (data) => {
        console.log('Resultado: ' + data);
    });
    response.on('close', () => {
        console.log('Desconectado');
    });
});

request.write('2+2');
request.end();*/
