
const URI_base = 'http://localhost:8000'
const URI_base2 = 'http://localhost:4000'
const URI_base3 = 'http://localhost:6000'
const URI_cartes = 'https://cartes.io'
const userId = 2

//Cargo un lote de prueba para las sucursales que puede elegir el cliente
const sucursales = [{"branchId":1,"lat":56.12,"lng":45.23,"name":"Constitucion"},   
                    {"branchId":2,"lat":23.12,"lng":91.53,"name":"Tejedor"},
                    {"branchId":3,"lat":1.12,"lng":89.3,"name":"Centro"}]


//PETICIONES
function peticionGET(uri,callback){
    fetch(uri,{
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response =>{return response.json()})
    .then(jsondata => {
        console.log(jsondata)
        callback(jsondata)})
    .catch(err => console.error(err))
}

function peticionPOST(uri,infobody,callback){
    fetch(uri,{
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(infobody)
    })
    .then(response =>{return response.json()})
    .then(jsondata => callback(jsondata))
    .catch(err => console.error(err))
}

function peticionGETC(uri, callback){
    fetch(uri,{
        method: "GET",
        mode: "cors",
        headers: {
            "Accept": "application/json",
        }
    })
    .then(response =>{return response.json()})
    .then(jsondata => {
        console.log(jsondata)
        callback(jsondata)})
    .catch(err => console.error(err))
}

//Cuando se cargue la pagina lo primero que hago es traerme las sucursales disponibles con un get
addEventListener("load", () =>{  
   peticionGET(`${URI_base}${"/sucursales"}`, muestraSucursales)
})

function muestraMapa(json){
    let frame = document.createElement('iframe')
    frame.width = "100%"
    frame.height = "400"
    frame.innerHTML = 
    document.getElementById("col_mapa").appendChild(frame)  
}

//Habilito boton para buscar turno, siempre y cuando tenga todo completo
function habilitar(){
    let email = document.getElementById("email").value
    let sucursal = document.getElementById("select_sucursal").value
    let fecha = document.getElementById("fechayhora").value
    let habilita = false

    //&& sucursal != "" || sucrusal == "" && sucursal != "Sin especificar"
    if(email != "")
        habilita = true
    
    let res = (habilita)? document.getElementById("buscar_turno").disabled = false :  document.getElementById("buscar_turno").disabled = true
}

document.getElementById("email").addEventListener("keyup", habilitar)
document.getElementById("select_sucursal").addEventListener("change",habilitar)
document.getElementById("fechayhora").addEventListener("change",habilitar)

function muestraSucursales(jsondata){
    //Aca me quedo con name-id
    window.infoSuc = new Map()
    //Muestro las sucursales al cliente
    for(let sucursal in jsondata){
        infoSuc.set(jsondata[sucursal].name,jsondata[sucursal].id)
        let nombre_suc = jsondata[sucursal].name
        let op_suc = document.createElement('option')
        op_suc.text = nombre_suc
        document.getElementById("select_sucursal").appendChild(op_suc)         
   }  
}

function confirmacionCliente(jsondata){
    //Si el header me da codigo 200 esta ok para la confirmacion
    let email = document.getElementById("email").value

    if(jsondata.headers == 200){
        //Creo ventanaConfirmacion
        peticionPOST(`${URI_base2}${"/api/reservas/confirmar/:"}${window.idReserva}`,{
           "userId":userId,
           "email":email
        },confirmacionCliente)
    }
}

function escuchaReservas(reserva){
    //Este es el idReserva a enviar para la verificacion
    window.idReserva = reserva.id;
    peticionPOST(`${URI_base2}${"/api/reservas/solicitar/:"}${window.idReserva}`,{"userId":userId},confirmacionCliente)
    eliminaTurnos()
}

//Muestro los turnos por pantalla
function muestraTurnos(turnos){
    /*
    const turnos = [{"dataTime":"2022-10-01", "branchId":1},
                    {"dataTime":"2022-10-01", "branchId":2},
                    {"dataTime":"2022-10-01", "branchId":2},
                    {"dataTime":"2022-10-01", "branchId":1},
                    {"dataTime":"2022-10-01", "branchId":1},
                    {"dataTime":"2022-10-01", "branchId":3},
                    {"dataTime":"2022-10-01", "branchId":4},
                    {"dataTime":"2022-10-01", "branchId":1}]
    */
    for(let turno in turnos){
        let item = document.createElement('li')
        item.className = "list-group-item d-flex justify-content-between align-items-center"
        item.id = turno
        item.innerHTML = `${"Fecha = "}${turnos[turno].dataTime}${"Sucursal = "}${turnos[turno].branchId}${"\n"}`
        item.innerHTML += '<button id="'+turno+'" class="btn btn-primary btn-sm" type "button" onclick="escuchaReservas(this)">Reservar</button>'  
        document.getElementById("lista_turnos").appendChild(item)
        /*
        let buttonitem =  document.createElement('button')
        buttonitem.className = "btn btn-primary btn-sm"
        buttonitem.id = turno
        buttonitem.innerHTML = "Reservar"
        document.getElementById(item.id).appendChild(buttonitem)
        */
    }  
}


//Me trae los turnos de una sucursal
document.getElementById("buscar_turno").addEventListener("click", (evt) =>{
    evt.preventDefault();
    let branchId = window.infoSuc.get(document.getElementById("select_sucursal").value)
    let dataTime = document.getElementById("fechayhora").value
    
    if(dataTime === "" && (branchId !== "" && branchId !== undefined)){
        //Hago GET de las reservas de una sucursal, el filtro es solo por brachId
        peticionGET(`${URI_base2}${"/api/reservas?userId=-1&branchId="}${branchId}`, muestraTurnos)
    }
    else if(dataTime !== "" && branchId !== "" &&  branchId !== undefined){
        //Hago GET de las reservas con filtro en sucursales y fecha
        peticionGET(`${URI_base2}${"/api/reservas?userId=-1&dateTime="}${dataTime}${"&branchId="}${branchId}`, muestraTurnos)       
    }
    else {
        //Hago GET de las reservas sin filtro, me quedo con todas
        peticionGET(`${URI_base2}${"/api/reservas?userId=-1"}`, muestraTurnos)
    }
    
})



