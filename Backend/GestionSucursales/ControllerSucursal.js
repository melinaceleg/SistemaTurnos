import SucursalService from './SucursalService.mjs'
//require ('./SucursalService.mjs');
import Error from './Error.mjs'
import ErrorHandler from './ErrorHandler.mjs'
//require('./Error.mjs');
import * as http from 'http';
import path from 'path';


//const http = require("node:http");
const GETMETHOD = 'GET'
const LOCALHOST = "localhost"
const RESOURCE = "sucursales"

const sucursalService = new SucursalService();

const server = http.createServer();

server.on('request',(request,response) => {
  
    const {headers,method,url} = request;
    console.log(url);
    let urlRequest=  url.split("/");
    //urlRequest=urlRequest.slice(1);
    console.log(urlRequest)
        if (urlRequest[2] == RESOURCE) ///si es el recurso sucursales
        {
            //if(urlRequest.length == 1) ////si posee solo 1 parametro
            if(urlRequest[3]===undefined) ////si posee solo 1 parametro

            {   
                if (method ==  GETMETHOD)
                {                              
                    sucursalService.getAll()
                        .then((data) => 
                        {
                            let errorHandler = new ErrorHandler(null)
                            errorHandler.OK(response,data);
                            response.end(errorHandler.body); 
                        })
                        .catch(((error) =>
                    {
                       
                        /* response.writeHead(500,{'Content-Type':'application/json'});
                         if (typeof(error) != String)
                            response.end(JSON.stringify(new Error(error.message))); 
                        else
                            response.end(JSON.stringify(new Error(error.message)));
                            */
                        let errorHandler = new ErrorHandler(error);
                        errorHandler.InternalError(response);
                        response.end(errorHandler.body);
                    }));
                }
                else
                {
                    
                    let errorHandler = new ErrorHandler(null);
                    errorHandler.NotFound(response);
                    response.end(errorHandler.body); 
                }
            }
            else
            {
                ///getbyId
               if (!isNaN(parseInt(urlRequest[3])) && method == GETMETHOD) ///if the urlParam is a number and the method is GET
               {
                   sucursalService.getById(parseInt(urlRequest[1]))
                        .then((result) => {
                            let errorHandler = new ErrorHandler(null)
                            errorHandler.OK(response,result);
                            response.end(JSON.stringify(errorHandler.body)); 
                        })
                        .catch((message) => {
                            let errorHandler = new ErrorHandler(message);
                            errorHandler.InternalError(response);
                            response.end(errorHandler.body);
                          
                        })
                    
               } 
               else
               {
               /* let errorHandler = new ErrorHandler("Resource not Found");
                errorHandler.NotFound(response);
                */
                let errorHandler = new ErrorHandler(null);
                errorHandler.NotFound(response);
                response.end(errorHandler.body); 
               }
            }
        }
        else
        {
            let errorHandler = new ErrorHandler(null);
            errorHandler.NotFound(response);
            response.end(errorHandler.body); 
        }

});

server.listen(8080);
console.log("listening...")

