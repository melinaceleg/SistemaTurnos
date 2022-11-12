const manejoTurnos = require('./manejoTurnos');

function ComprobarRecurso(rec, recurso)
{
    return rec.includes(recurso);
    //return rec == recurso;
}
function AltaReserva(turnos, idReserva, data, callback)
{
    d = JSON.parse(data);
    indice = manejoTurnos.BuscarReserva(turnos, idReserva);
    if (indice != -1 && turnos[indice].status == 0)
    {
        turnos[indice].email = d.email;
        turnos[indice].userId = d.userId;
        turnos[indice].status = 1;
        //AgregarTurno(turnos, CrearTurno(idReserva, "2022-09-02T19:58:10.406Z", d.userId, d.email, 3));
        manejoTurnos.GuardarTurnos(turnos);

        callback(turnos[indice]);
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
    let indice = manejoTurnos.BuscarReserva(turnos, idReserva);
    return JSON.stringify(indice != -1? turnos[indice]:'');
}

module.exports = {
    ComprobarRecurso : ComprobarRecurso,
    AltaReserva : AltaReserva,
    VerificarTurno : VerificarTurno,
    GetReservas : GetReservas,
    GetReserva : GetReserva
}
