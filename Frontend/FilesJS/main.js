
const URI_base = 'http://localhost:8000'
const URI_base2 = 'http://localhost:4000'
const URI_base3 = 'http://localhost:8000'
const URI_cartes = 'https://cartes.io'
const apk = "eyJpdiI6InhzOGxKSlpZSlRQSDZVc2ZuSTlVVHc9PSIsInZhbHVlIjoiaWp6azVFK0xPUnFaY3RNYTJPMUZ2cjhSNDE5aGs2b1cwaHlrMlhiT2FNSkN5WFhrU0ZFVU5SUzY3c0crdXdMcXpaRkxocDJSc0lWbFg0MFF0bkFsZ2hmc09wM0VkTGI0T0pXQUp5SUpuSEN5R0pNaGh4S2NNc1B4cXRDT0NUVkUiLCJtYWMiOiJmMGU1M2JjYmZiZjhjZTBkYzY3NmEzZjFlMTBlZDgyMjA3MGFiY2ZmM2IyNmI0MmFlMTkwZTQ5NzZhOTUwNjdhIiwidGFnIjoiIn0%3D"
const userId = 1

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
        window.sucursales = jsondata
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
    .then(response => {
        window.statuscode = response.status
        console.log(response);
        return response.json()}) 
    .then(jsondata => callback(jsondata))
    .catch(err => console.error(err))
}

function peticionPOSTC(uri,callback,method){
    fetch(uri,{
        method: method,
        mode: "cors",
        headers: {
            "Accept": "application/json",
            "Authorization": apk
        },
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
            "Authorization": apk
        },
    })
    .then(response =>{return response.json()})
    .then(jsondata =>callback(jsondata))
    .catch(err =>{ 
        console.error(err)
        //Como no tengo el recurso creado, hago un nuevo mapa
        peticionPOSTC(`${URI_cartes}${"/api/maps?title=SistemaTurnos&slug=turnos&description=Representalassucursalesdeunaclinica&privacy=public&users_can_create_markers=yes"}`,muestraMapa, "POST")    
    }
        )
}

//Cuando se cargue la pagina lo primero que hago es traerme las sucursales disponibles con un get
addEventListener("load", () =>{  
   peticionGET(`${URI_base3}${"/api/sucursales"}`, muestraSucursales)
   //Me traigo el mapa de cartes
   peticionGETC(`${URI_cartes}${"/api/maps?withmine=true&title=SistemaTurnos"}`, muestraMapa)
})


function actualizaMarcadores(marcadores,uuid){
    //Caso en el que no tengo marcadores, caso de que el mapa fue eliminado por completo
    if(marcadores.data == "[]"){
        console.log("No hay marcadores en el mapa")
        for(sucursal in sucursales){
            let lat = sucursales[sucursal].lat
            let lng = sucursales[sucursal].lng
            let description = sucursales[sucursal].name
            console.log("lat:",lat,"lng:",lng)
            peticionPOSTC(`${URI_cartes}${"/api/maps/"}${uuid}${"/markers?lat="}${lat}${"&lng="}${lng}${"&description="}${description}${"&category_name="}${description}`, null, "POST")
        }
    }
    else{
        //Elimino si hay algun marcador que ya no forma parte de las sucursales disponibles
        //O agrago en el caso de que falte alguno
        console.log("Si hay marcadores en el mapa")
        //Recorro por sucursal, si los marcadores no tienen la sucursal creo el nuevo marcador
        for(let suc in sucursales){
            if(!(infoMarc.has(sucursales[suc].name))){
                lat = sucursales[suc].lat
                lng = sucursales[suc].lng
                description = sucursales[suc].name
                peticionPOSTC(`${URI_cartes}${"/api/maps/"}${uuid}${"/markers?lat="}${lat}${"&lng="}${lng}${"&description="}${description}${"&category_name="}${description}`, null, "POST")
            }
        }
        //Recorro por marcador, si hay algun marcador que ya no forma parte de las sucursales lo elimino
        for(let marcador in marcadores){
            if(!(infoSuc.has(marcadores[marcador].description))){
                console.log("El nombre del marcador es:", marcadores[marcador].description)
                console.log("El id del marcador es:", marcadores[marcador].id)
                peticionPOSTC(`${URI_cartes}${"/api/maps/"}${uuid}${"/markers/"}${marcadores[marcador].id}`, null, "DELETE")     
            }
        }
    }
}

function muestraMapa(jsondata){
    const uuid = jsondata.data[0].uuid
    const fuente = `${"https://app.cartes.io/maps/"}${uuid}${"/embed?type=map"}`
    const uri = `${URI_cartes}${"/api/maps/"}${uuid}${"/markers"}`
    let idFrame = document.getElementById("mapa")
    //Hago este fetch para saber los marcadores que tiene el mapa, y poder actualizarlos en caso de no tener todos los marcadores de las sucursales
    fetch(uri,{
        method: "GET",
        mode: "cors",
        headers: {
            "Accept": "application/json",
            "Authorization": apk
        },
    })
    .then(response =>{return response.json()})
    .then(jsondata =>{
        window.infoMarc = new Map()
        for(let marc in jsondata){
            infoMarc.set(jsondata[marc].description,jsondata[marc].id)    
        } 
        actualizaMarcadores(jsondata,uuid)
        idFrame.setAttribute("src",fuente)
    })
    .catch(err =>{ 
        console.error(err)
    }
        )
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
    let email = document.getElementById("email").value

    if(statuscode == 200){
        var resultado = window.confirm('Estas seguro de confirmar el turno?');
        if (resultado === true) {
            peticionPOST(`${URI_base3}${"/api/reservas/confirmar/"}${window.idReserva}`,{
                "userId":userId,
                "email":email
             },confirmacionCliente)
        } else { 
            window.alert('Puede elegir otro turno');
        } 
    }
}

function escuchaReservas(reserva){
    //Este es el idReserva a enviar para la verificacion
    window.idReserva = reserva.id;
    console.log("El idReserva:", idReserva)
    peticionPOST(`${URI_base3}${"/api/reservas/solicitar/"}${window.idReserva}`,{"userId":userId},confirmacionCliente)
}

//Muestro los turnos por pantalla
function muestraTurnos(turnos){
    //Limpio la lista
    let id_lista = document.getElementById("lista_turnos")
    let id_divF = document.getElementById("fila_turnos")
    id_divF.removeChild(id_lista)

    //Creo una nueva lista
    let item_ul = document.createElement('ul')
    item_ul.className = "list-group list-group-horizontal-xxl"
    item_ul.id = "lista_turnos"
    id_divF.appendChild(item_ul)
    for(let turno in turnos){
        let date = turnos[turno].dateTime.split("T")
        let item = document.createElement('li')
        item.className = "list-group-item d-flex justify-content-between align-items-center"
        item.id = turno
        item.innerHTML = `${"Fecha = "}${date[0]}${"<br>"}${"Sucursal = "}${turnos[turno].branchId}${"\n"}`
        item.innerHTML += '<button id="'+turnos[turno].idReserva+'" class="btn btn-primary btn-sm" type "button" onclick="escuchaReservas(this)">Reservar</button>'  
        document.getElementById("lista_turnos").appendChild(item)
    }  
}


//Me trae los turnos de una sucursal
document.getElementById("buscar_turno").addEventListener("click", (evt) =>{
    evt.preventDefault();
    let branchId = window.infoSuc.get(document.getElementById("select_sucursal").value)
    let dataTime = document.getElementById("fechayhora").value
    
    if(dataTime === "" && (branchId !== "" && branchId !== undefined)){
        //Hago GET de las reservas de una sucursal, el filtro es solo por brachId
        peticionGET(`${URI_base3}${"/api/reservas?userId=-1&branchId="}${branchId}`, muestraTurnos)
    }
    else if(dataTime !== "" && branchId !== "" &&  branchId !== undefined){
        //Hago GET de las reservas con filtro en sucursales y fecha
        peticionGET(`${URI_base3}${"/api/reservas?userId=-1&dateTime="}${dataTime}${"&branchId="}${branchId}`, muestraTurnos)       
    }
    else {
        //Hago GET de las reservas sin filtro, me quedo con todas
        peticionGET(`${URI_base3}${"/api/reservas?userId=-1"}`, muestraTurnos)
    }
    
})




