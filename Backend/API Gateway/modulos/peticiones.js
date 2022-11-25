const puertoReservas = '4000';
const puertoSucursales = '8080';

const http = require('http');
const { ErrorHandler } = require("./ErrorHandler");

function ComprobarRecurso(rec, recurso)
{
    return rec != undefined && rec.includes(recurso);
}

function AltaReserva(request, datos)
{
    let options = {
        hostname: 'localhost',
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
function GetReservas(request)
{    
    let options = {
        hostname: 'localhost',
        port: puertoReservas,
        method: 'GET',
        path: request.url, //ojo aca
        headers: { 'Content-Type': 'application/json'}

      }

      return new Promise((resolve, reject) => {
        http.get(options, res => {

            let body = ''
        
            res.on('data', chunk => {
                body += chunk;
            })
            
            res.on('end', () => {
                if (res.statusCode == 200) {
                  resolve(JSON.parse(body))
                } else {
                    let error = body;
                  reject(error);
                }
            })
        
        })
    })
}
 function GetSucursales(request)
{
    let options = {
        hostname: 'localhost',
        port: puertoSucursales,
        method: 'GET',
        path: request.url, //ojo aca
        //headers: { 'Content-Type': 'application/json'}

      }

      return new Promise((resolve, reject) => {
        http.get(options, res => {

            let body = ''
        
            res.on('data', data => {
                body += data;
            })
            
            res.on('end', () => {
                if (res.statusCode == 200) {
                  resolve(JSON.parse(body))
                } else {
                    let error = body;
                  reject(error);
                }
            })
        
        })
           //request.write();
            //request.end();
    })
}

module.exports = {
    ComprobarRecurso : ComprobarRecurso,
    AltaReserva : AltaReserva,
    GetReservas : GetReservas,
    GetSucursales : GetSucursales
}