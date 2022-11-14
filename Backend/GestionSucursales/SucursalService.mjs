
//let fs =require('fs')
import * as fs from 'fs';
import path from 'path';
export default class SucursalService {
    sucursalFile;
    __dirname;

    constructor()
    {
        this.sucursalFile="sucursales.json"
        this.__dirname = path.dirname("sucursales.json");
    }

    /* get All sucursales */
    getAll = () => { return new Promise((resolve,reject) => 
    {

       if (fs.existsSync(path.join(this.__dirname,this.sucursalFile)))
       {
        fs.readFile(path.join(this.__dirname,this.sucursalFile),"utf8",(error,data) => {
            resolve(data);
            
        });
       }
       else
       {
        reject("File not Found");
       }
    });
}

/* get a sucursal by id
    @id
    return Promise
*/
    getById = (id) => 
    {
      return new Promise((resolve,reject) =>
        {
            if (fs.existsSync(path.join(this.__dirname,this.sucursalFile)))
            {
                fs.readFile(path.join(this.__dirname,this.sucursalFile),"utf8", (error,data) =>
                {

                            let sucursales = JSON.parse(data);
                            let sucursal =  sucursales.find((element) => {
                                return (element.id == id);
                            });
                            if (sucursal)
                              resolve(sucursal);
                            else
                              reject("Such id doesnt exist");
                });
            }
            else
                reject("File Not Found");
        });
    }
}
