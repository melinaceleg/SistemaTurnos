const fs = require('fs');

function CrearTurno(_idReserva, _dateTime, _userId, _email, _branchId, _status)
{
    var persona = 
    {
        idReserva: _idReserva, // id numérico único que representa el turno
        dateTime: _dateTime, // formato ISO String "2022-09-02T19:58:10.406Z"
        userId: _userId, // id de usuario si está registrado, o 0 si no lo está
        email: _email, // email del usuario
        branchId: _branchId, // id de la sucursal
        status: _status // id de la sucursal
    }

    return persona;
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
function Div(num, den)
{
    let res = num % den;
    num = (num - res) / den;
    return [num, res];
}
function CrearJSON(cantidad, año, mes, dia, hora, min, deltaMin)
{
    //"2022-09-02T19:58:10.406Z"
    let t = [];
    let aux;
    for (let i = 0; i < cantidad; i++)
    {
        cadena = año + "-" + (mes<=9? "0"+mes:mes) + "-" + (dia<=9? "0"+dia:dia) + "T" + (hora<=9? "0"+hora:hora) + ":" + (min<=9? "0"+min:min) + ":00.000Z";
        t[i] = CrearTurno(i, cadena, -1, "null", Math.floor(Math.random() * 5) + 1, 0);
        min += deltaMin;
        aux = Div (min, 60);
        min = aux[1];

        hora += aux[0];
        aux = Div (hora, 24);
        hora = aux[1];
        
        dia += aux[0];
        aux = Div (dia, 31);
        dia = aux[1];

        mes += aux[0];
        aux = Div (mes, 12);
        mes = aux[1];
        
        año += aux[0];
    }
    return t;
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
function resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 2000);
    });
  }
function CargarTurnos()
{
    //await resolveAfter2Seconds();
    //console.debug("archivo cargado");
    return JSON.parse(fs.readFileSync('turnos.json', 'utf8'));
}
function GuardarTurnos(turnos)
{
    jsonData = JSON.stringify(turnos);
    
    fs.writeFile('turnos.json', jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = {
    CrearTurno : CrearTurno,
    AgregarTurno : AgregarTurno,
    CrearJSON : CrearJSON,
    BuscarReserva : BuscarReserva,
    CargarTurnos : CargarTurnos,
    GuardarTurnos : GuardarTurnos
}