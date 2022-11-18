const puertoReservas = '4000';
const puertoSucursales = '3000';


async function enviar(data, options, cliente)
{    
    const request = http.request(options, function (response) {

        let body = ''
      
        console.log('Status Code:', response.statusCode);
      
        response.on('data', (chunk) => {
          body += chunk;
          enviarRespuesta(cliente, cod, chunk);
        });
      
        response.on('end', () => {
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
async function AltaReserva(data, cliente)
{
    d = JSON.parse(data);
    if (idReserva <= 0)
    {        
        throw 'idReserva erroneo';
    }
    else
    {
        fecha = nTurnos[i].dateTime.split('T');
        
        if (fecha.length != 2)
        {        
            throw 'Error fecha';
        }
    }

    const data = JSON.stringify({
        email: data.email,
        userId: data.userId
    });

    var options = {
        method: 'POST',
        path: '/confirmar/'+idReserva,
    
        port: '4000',
        //json: true,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return JSON.stringify('');
}
async function GetTurnosUsuario(data, cliente)
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
async function GetSucursales(data, cliente)
{
    d = JSON.parse(data);

    const data = JSON.stringify({
        id: data.branchId,
        lat: data.lat,
        lng: data.lng,
        name: data.name
    });

    var options = {
        method: 'GET',
        path: '/api/sucursales',
    
        port: puertoSucursales,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    enviar(data, options, cliente);

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
    GetTurnosUsuario : GetTurnosUsuario,
    GetSucursales : GetSucursales,
    enviarRespuesta : enviarRespuesta
}