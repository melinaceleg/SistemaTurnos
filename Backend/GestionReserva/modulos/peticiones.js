const manejoTurnos = require('./manejoTurnos');

function ComprobarRecurso(rec, recurso)
{
    return rec != undefined && rec.includes(recurso);
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
    let nTurnos = turnos.filter(function (t) {
        return t.userId != -20
    });
    if (parametros.userId != undefined)
    {        
        nTurnos = nTurnos.filter(function (t) {
            return t.userId == parametros.userId
        });
    }
    if (parametros.dateTime != undefined)
    {        
        if (parametros.dateTime.length != 2)
        {        
            throw 'Error fecha';
        }

        nTurnos = nTurnos.filter(function (t) {
            return t.dateTime.split('T')[0] == parametros.dateTime
        });
    }
    if (parametros.branchId != undefined)
    {
        nTurnos = nTurnos.filter(function (t) {
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
function enviarRespuesta(response, cod)
{
    response.writeHead(cod,{'Content-Type':'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':'*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Credentials' : true});
}

module.exports = {
    ComprobarRecurso : ComprobarRecurso,
    AltaReserva : AltaReserva,
    VerificarTurno : VerificarTurno,
    GetReservas : GetReservas,
    GetReserva : GetReserva,
    enviarRespuesta : enviarRespuesta
}