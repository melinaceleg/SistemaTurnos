const puertoReservas = '4000';
const puertoSucursales = '3000';

const http = require('http');
const { ErrorHandler } = require("./ErrorHandler");

async function enviar(data, options, cliente)
{
    try
    {
        const request = http.request(options, function (response) {
            
                
            response.on('data', (chunk) => {
              enviarRespuesta(cliente, response.statusCode, chunk);
              cliente.end(chunk);
            });
          
            /*response.on('end', (chunk) => {
                enviarRespuesta(cliente, response.statusCode, chunk);
                console.debug('??????');
                console.debug(chunk);
                cliente.end(chunk);
            });*/
        });
        request.on('error', function(err) {
            enviarRespuesta(cliente, 400, JSON.stringify(''));
            cliente.end();
            console.debug('error conexion con el componente');
        });
          
        request.write(data);
        request.end();

    } catch (error) {        
        enviarRespuesta(cliente, 400, JSON.stringify(''));
        cliente.end();
        console.debug('error de respuesta');
    }
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
        throw JSON.stringify('');//'idReserva erroneo';
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

function AltaReserva(request, datos)
{
<<<<<<< HEAD
    let options = {
        hostname: 'localhost',
=======
    const ndata = JSON.stringify({
        userId: d.userId,
        email: d.email
    });
    var options = {
        method: 'POST',
        path: request.url,
    
>>>>>>> 0904aab (Alta reservas fix)
        port: puertoReservas,
        method: 'POST',
        path: request.url, //ojo aca
        headers: { 'Content-Type': 'application/json','Content-Length': datos.length  }

      }

      return new Promise((resolve, reject) => {
        let body='';
        let request = http.request(options, (response) =>
         {
       

          response.on('data', (data) => 
           {
            body += data;
           })

          response.on('end', () => {

            if (response.statusCode == 200) {
              resolve(JSON.parse(body))
            } else {
                let error = body;
              reject(error);
            }
          })
        });

        request.on('error', (error) => {
            reject(error);
        });
        console.log(datos);
        request.write(datos)
        request.end();
    })
}


async function VerificarTurno(request, cliente)
{
    const data = JSON.stringify('');//JSON.stringify( userId: d.userId });
    
    var options = {
        method: request.method, //'POST',
        path: request.url,
    
        port: puertoReservas,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };
    enviar(data, options, cliente);

    return 1; 
}
async function GetReservas(request, cliente)
{
    const data = JSON.stringify('');
    var options = {
        method: request.method, //'GET',
        path: request.url,
    
        port: puertoReservas,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    enviar(data, options, cliente);

    return 1; 
}
async function GetReserva(request, cliente)
{
    const data = JSON.stringify('');

    var options = {
        method: request.method, //'GET',
        path: request.url,
    
        port: puertoReservas,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    enviar(data, options, cliente);

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
        method: request.method, //'GET',
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
        method: request.method, //'GET',
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