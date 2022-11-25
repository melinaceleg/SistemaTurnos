const { Error } = require("./Error");

//const Error = require(Error);
/**
 * Clase manejadora de errores
 * Coloca en body lo que llega desde result, deberia hacerse un stringify luego en el objeto invocador en caso de que no sea un json
 */
 class ErrorHandler
{
 body;

  constructor(error)
  {
    if (error != null)
    {
    if (typeof(error) != String)
        this.body=new Error(error.message); 
    else
        this.body =new Error(error);

    this.body = JSON.stringify(this.body);
    }
  }
  NotFound = (response) =>
  {
    this.body = JSON.stringify(new Error("Resource Not Found"));
    response.writeHead(400,{'Content-Type':'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':'*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Credentials' : true});
  }

  InternalError = (response) => 
  {
    response.writeHead(500,{'Content-Type':'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':'*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Credentials' : true});
  }

  OK = (response,result) => 
  {
    response.writeHead(200,{'Content-Type':'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':'*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Credentials' : true});
    this.body = result; ///plano, si es un objeto debera hacerse stringify 

  }

  

}

exports.ErrorHandler = ErrorHandler;