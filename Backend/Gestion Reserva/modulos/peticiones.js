const manejoTurnos = require('./manejoTurnos');

function ComprobarRecurso(rec, recurso)
{
    return rec != undefined && rec.includes(recurso);
}
async function AltaReserva(turnos, idReserva, data, callback,response)
{
    indice = manejoTurnos.BuscarReserva(turnos, idReserva);
    if (idReserva <= 0)
    {        
        throw new Error('idReserva erroneo');
    }
    if (indice != -1 && turnos[indice].status == 1)
    {
        turnos[indice].email = data.email;
        turnos[indice].userId = data.userId;
        turnos[indice].status = 2;
        manejoTurnos.GuardarTurnos(turnos);
        console.debug('turno agregado!');
        callback(turnos[indice])
        enviarRespuesta2(response,200,JSON.stringify({'msg':'turno agregado correctamente'}));

    }
    else
    {
         enviarRespuesta2(response,400,JSON.stringify({'msg':'turno ocupado o status incorrecto'}))
  
    }
}
async function VerificarTurno(turnos, idReserva,response,userId)
{
    let i = 0;
    let len = turnos.length;
    let result = 0;
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

                turnos[i].userId = userId;
                turnos[i].status = 1;
                result = 1;
                manejoTurnos.GuardarTurnos(turnos);
            }


        }()
    }
   if(result==1)
        enviarRespuesta2(response,200,JSON.stringify({
            res: 1
        }))
    else
        enviarRespuesta2(response,400,JSON.stringify({
            msg: "Error al verrificar turno"
        }))
        
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
async function enviarRespuesta(response, cod)
{
    response.writeHead(cod,{'Content-Type':'application/json'});
}

async function enviarRespuesta2(response, cod,msg)
{
    response.writeHead(cod,{'Content-Type':'application/json'});
    response.end(msg)
}


async function parseRequestAlta(req,turnos, idReserva, callback,response){
    const size = parseInt(req.headers['content-length'], 10)
    const buffer = Buffer.allocUnsafe(size)
    var pos = 0
      const res= req.on('data', (chunk) => { 
          const offset = pos + chunk.length  
          chunk.copy(buffer, pos) 
          pos = offset 
          data = JSON.parse(buffer.toString())
          console.log(data)
            validateReqAlta(data,turnos, idReserva,callback,response)
      })
    }   



    async function parseRequestVerificar(req,turnos, idReserva,response){
        const size = parseInt(req.headers['content-length'], 10)
        const buffer = Buffer.allocUnsafe(size)
        var pos = 0
          const res=await  req.on('data', (chunk) => { 
              const offset = pos + chunk.length  
              chunk.copy(buffer, pos) 
              pos = offset 
              data = JSON.parse(buffer.toString())
                validateReqVerificar(data,turnos, idReserva,response)
          })
        } 

     async function validateReqAlta(data,turnos, idReserva, callback,response){
        const userId=data.userId
        const email=data.email
     
        if (userId===undefined|| email===undefined){
          //res.writeHead(422)
          //res.end(JSON.stringify({'mesageError':'Error de parseo'}))
          return enviarRespuesta2(response,422,JSON.stringify({'msg':'Error de parseo'}))
        }
       else
        return AltaReserva(turnos, idReserva, data, callback,response)
      }

      async function validateReqVerificar(data,turnos, idReserva,response){
        const userId=data.userId
        if (userId===undefined)
          return enviarRespuesta2(response,422,JSON.stringify({'msg':'Error de parseo'}))
       else
        return VerificarTurno(turnos, idReserva,response,userId)
      }

      async function responseError(res){
            res.writeHead(400)
            res.end(JSON.stringify({'msg':'Error'}))
      }

module.exports = {
    parseRequestAlta:parseRequestAlta,
    parseRequestVerificar:parseRequestVerificar,
    ComprobarRecurso : ComprobarRecurso,
    AltaReserva : AltaReserva,
    VerificarTurno : VerificarTurno,
    GetReservas : GetReservas,
    GetReserva : GetReserva,
    enviarRespuesta : enviarRespuesta
}

