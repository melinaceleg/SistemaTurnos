const fs = require('fs');
const https = require('http');
const HORAS_CONVERSION=1000*60*60;
const asunto='Recordatorio de turno'
const msg='Usted tiene un turno en 24 hs'
const servicioMailPuerto=9000
const host='localhost'
const path= '/api/notificaciones'
const port=9000
var notificados=[]


function cargarTurnos(){return turnos= JSON.parse(fs.readFileSync('../Gestion Reserva/turnos.json', 'utf8'))}

function agregaNotificados(noNotificados){
  notificados=notificados.concat(noNotificados.map(turno=>turno.idReserva));
}

async function notifica(turnos){
const now=Date.now()
let notificar=turnos.filter(turno=>Math.trunc((now - Date.parse(turno.dateTime))/HORAS_CONVERSION)<=24&&turno.userId!=-1);
let noNotificados=notificar.filter(turno=>!notificados.includes(turno.idReserva) && turno.status==2);
let mailsoNotificado
if(noNotificados.length>0){
  mailsoNotificado=noNotificados[0].email
  enviar(mailsoNotificado,asunto,msg,noNotificados.slice(0,1));
  
}
else
   console.log(JSON.stringify({'message':'No hay recordatorios por el momento'}))
  
}

     function enviar(email,asunto,msg,noNotificados){
        var data = JSON.stringify({
                  'destinatario':email,
                  'asunto': asunto,
                  'cuerpo': msg
      });
  
      const options = {
          hostname: host,
          port: port,
          path: path,
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(data)
          }
        };
        sendSingle(options,data,noNotificados,email);
    }
  

    function sendSingle(options,data,noNotificados,email){
      var req = https.request(options, (res) => {
          res.on('data', (d) => {
          process.stdout.write(d);
        });
           hanldeResponse(res.statusCode,noNotificados,email)
      });
      req.write(data);
      req.end();
    }
      function hanldeResponse(statusCode,noNotificados,email){
      if (statusCode==200){
        agregaNotificados(noNotificados);
        console.log(JSON.stringify({'message':'Recordatorio enviado y puesto en lista de enviados a: ' + email}))
      }
    else{
      console.log(JSON.stringify({'error':'Error al enviar recoradatorios se reintentara mas tarde'}))

    }
  }
     function send(options,data,noNotificados,emails){
      var req = https.request(options, (res) => {
          res.on('data', (d) => {
          process.stdout.write(d);
        });
           hanldeResponse(res.statusCode,noNotificados,emails)
      });
      req.write(data);
      req.end();
    }
      function hanldeResponse(statusCode,noNotificados,emails){
      if (statusCode==200){
        agregaNotificados(noNotificados);
        console.log(JSON.stringify({'message':'Recordatorios enviados y puestos en lista de enviados a: ' + emails}))
      }
    else{
      console.log(JSON.stringify({'error':'Error al enviar recoradatorios se reintentara mas tarde'}))

    }
        
}

const wait = ms => new Promise(res => setTimeout(res, ms))

const apiCall = turnos => notifica(turnos)

async function run(turnos, ms) {
  const result = await apiCall(turnos)

  await wait(ms)
  await run(cargarTurnos(), ms)

}
run(cargarTurnos(),2000)