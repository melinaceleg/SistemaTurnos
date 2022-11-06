
const URI_base = 'http://localhost:8080'

//Cargo un lote de prueba para las sucursales que puede elegir el cliente
const sucursales = [{"branchId":1,"lat":56.12,"lng":45.23,"name":"Constitucion"},   
                    {"branchId":2,"lat":23.12,"lng":91.53,"name":"Tejedor"},
                    {"branchId":3,"lat":1.12,"lng":89.3,"name":"Centro"}]

//Cuando se cargue la pagina lo primero que hago es traerme las sucursales disponibles con un get
addEventListener("load", () =>{
    //Aca va el fetch con get a sucursales
    /*
    fetch(`${URI_base}${"/api/sucursales"}`,{
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response =>  response.json())
    .then(jsondata => {
        //Aca me tengo que quedar con la lista de sucursales
        let listaSucursales
    })
    */
   //Una vez que tengo los datos de las sucursales las tengo que mostrar en la vista
   for(let sucursal in sucursales){
        let nombre_suc = sucursales[sucursal].name
        let op_suc = document.createElement('option')
        op_suc.text = nombre_suc
        document.getElementById("select_sucursal").appendChild(op_suc)         
   }
})

const email = document.getElementById("email").value
console.log("El mail es: ", email)


document.getElementById().addEventListener("click", (evt) =>{
    evt.preventDefault();
    let 
})



/*

const URI_cartesbase = 'http://cates.io/'
const URI = 'https://jsonplaceholder.typicode.com/users/1'

const request = fetch(URI,{
    method: "GET",
    //Seguridad para que no cualquier cliente pueda tomar informacion
    mode: "cors",
    headers:{
        "Content-Type": "application/json"
    },
})

request
    //Este primer then vuelve a devolver una promesa
    .then(response => response.json()) 
    .then(jsonData => console.log(jsonData))
    .catch(err => console.error(err))

/*
const request2 = fetch(URI_adventure,{
    method: "GET",
    mode: "cors",
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify({name: "Lucas", age: 23})
})
*/

