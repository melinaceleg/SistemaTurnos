const puertoReservas = '4000';
const puertoSucursales = '3000';

const http = require('http');


async function enviar(data, options, cliente)
{    
    const request = http.request(options, function (response) {

        let body = ''
            
        response.on('data', (chunk) => {
          body += chunk;
          enviarRespuesta(cliente, 200, chunk);
        });
      
        response.on('end', (chunk) => {
            console.debug(chunk);
            console.log('Body: ', body);
        });
    });
      
    request.write(data);
    request.end();
}

function ComprobarRecurso(rec, recurso)
{
    return rec.includes(recurso);
}


async function GetTurnosUsuario(data, request, cliente)
{
    let i = 0;
    let len = turnos.length;
    let result = 0;
    //d = JSON.parse(data);
    if (idReserva <= 0)
    {        
        throw 'idReserva erroneo';
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

async function AltaReserva(data, request, cliente)
{
    const ndata = JSON.stringify({
        userId: d.userId,
        email: d.email
    });
    var options = {
        method: 'POST',
        path: request.url,
    
        port: puertoReservas,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': ndata.length
        }
    };

    enviar(ndata, options, cliente);

    return 1; 
}
async function VerificarTurno(data, request, cliente)
{
    const ndata = JSON.stringify({
        userId: d.userId,
    });
    var options = {
        method: 'GET',
        path: request.url,
    
        port: puertoReservas,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': ndata.length
        }
    };

    enviar(ndata, options, cliente);

    return 1; 
}
async function GetReservas(data, request, cliente)
{
    const ndata = JSON.stringify('');
    var options = {
        method: 'GET',
        path: request.url,
    
        port: puertoReservas,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': ndata.length
        }
    };

    enviar(ndata, options, cliente);

    return 1; 
}
async function GetReserva(data, request, cliente)
{
    const ndata = JSON.stringify('');

    var options = {
        method: 'GET',
        path: request.url,
    
        port: puertoReservas,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': ndata.length
        }
    };

    enviar(ndata, options, cliente);

    return 1; 
}
async function GetSucursales(data, request, cliente)
{
    d = JSON.parse(data);

    const ndata = JSON.stringify({
        id: d.branchId,
        lat: d.lat,
        lng: d.lng,
        name: d.name
    });

    var options = {
        method: 'GET',
        path: request.url,
    
        port: puertoSucursales,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': ndata.length
        }
    };

    enviar(ndata, options, cliente);

    return 1; 
}
async function GetSucursal(data, request, cliente)
{
    d = JSON.parse(data);

    const ndata = JSON.stringify({
        lat: d.lat,
        lng: d.lng,
        name: d.name
    });

    var options = {
        method: 'GET',
        path: request.url,
    
        port: puertoSucursales,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': ndata.length
        }
    };

    enviar(ndata, options, cliente);

    return 1; 
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
    GetTurnosUsuario : GetTurnosUsuario,
    GetSucursales : GetSucursales,
    GetSucursal : GetSucursal,
    enviarRespuesta : enviarRespuesta
}