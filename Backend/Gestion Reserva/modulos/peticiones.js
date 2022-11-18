const manejoTurnos = require('./manejoTurnos');

function ComprobarRecurso(rec, recurso)
{
    return rec.includes(recurso);
    //return rec == recurso;
}
async function AltaReserva(turnos, idReserva, data, callback)
{
    d = JSON.parse(data);
    indice = manejoTurnos.BuscarReserva(turnos, idReserva);
    if (idReserva <= 0)
    {        
        throw 'idReserva erroneo';
    }
    if (indice != -1 && turnos[indice].status == 1)
    {
        turnos[indice].email = d.email;
        turnos[indice].userId = d.userId;
        turnos[indice].status = 2;
        //AgregarTurno(turnos, CrearTurno(idReserva, "2022-09-02T19:58:10.406Z", d.userId, d.email, 3));
        manejoTurnos.GuardarTurnos(turnos);

        callback(turnos[indice]);
        console.debug('turno agregado!');
    }
    else
    {
        throw 'turno ocupado o status incorrecto';
    }
    return JSON.stringify('');
}
async function VerificarTurno(turnos, idReserva)
{
    let i = 0;
    let len = turnos.length;
    let result = 0;
    //d = JSON.parse(data);
    if (idReserva <= 0)
    {        
        throw 'idReserva erroneo';
    }

    while (i < len && turnos[i].idReserva < idReserva)
    {
        i++;
    }
    if (i < len && turnos[i].idReserva == idReserva)
    {
        await function() {
            if (turnos[i].status == 0)
            {
                turnos[i].status = 1;
                result = 1;
            }
        }
    }

    return JSON.stringify({
        res: result
    });
}
async function GetReservas(turnos, parametros)
{
    let nTurnos;
    let filtro = turnos;
    
    let len;

    if (len > 3)
    {        
        throw 'Querrys incorrectos';
    }
    if (parametros.userId != undefined)
    {        
        nTurnos = filtro.filter(function (t) {
            return t.userId == parametros.userId
        });
        nTurnos = filtro;
    }
    if (parametros.dateTime != undefined)
    {        
        if (parametros.dateTime.length != 2)
        {        
            throw 'Error fecha';
        }

        nTurnos = filtro.filter(function (t) {
            return t.dateTime.split('T')[0] == parametros.dateTime
        });
        nTurnos = filtro;
    }
    if (parametros.branchId != undefined)
    {
        nTurnos = filtro.filter(function (t) {
            return t.branchId == parametros.branchId
        });
    }
    return JSON.stringify(nTurnos);
}
async function GetReserva(turnos, idReserva)
{
    if (idReserva <= 0)
    {        
        throw 'idReserva erroneo';
    }
    let indice = manejoTurnos.BuscarReserva(turnos, idReserva);
    return JSON.stringify(indice != -1? turnos[indice]:'');
}
function enviarRespuesta(response, cod, res)
{
    response.writeHead(cod,{'Content-Type':'application/json'});
    response.end(res);
}

module.exports = {
    ComprobarRecurso : ComprobarRecurso,
    AltaReserva : AltaReserva,
    VerificarTurno : VerificarTurno,
    GetReservas : GetReservas,
    GetReserva : GetReserva,
    enviarRespuesta : enviarRespuesta
}