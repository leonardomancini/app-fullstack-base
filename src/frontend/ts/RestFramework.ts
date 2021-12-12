/**
 *  Clase que encapsula las llamadas Rest de AJAX
 *  Se agregan interfaces para los listener para las respuestas de las llamadas
 * 
 * 
 */


class RestFramework {


    public requestGET(url:string, listener:GETResponseListener){
        let xml = new XMLHttpRequest();

        xml.onreadystatechange = function respuestaServidor(){
            
            if(xml.readyState == 4)
            {
                listener.handleGETResponse(xml.status, xml.response);  
            }                        

        }
        xml.open("GET", url,true);//true --->asincrona
        xml.send();
   }

   public requestDEL(url:string, listener:DELETEResponseListener){
       ///AJAX api rest DEL
       let xml = new XMLHttpRequest();

       //asynchronous request method
       xml.onreadystatechange = function respuestaServidor(){
           
           if(xml.readyState == 4)//status 4 all transaction performed
           {
               listener.handleDELETEResponse(xml.status, xml.response);      
           }                        
       }
       xml.open("DELETE", url,true);//true --->asincrona
       xml.send();
  }

  public requestPOST(url:string, listener:POSTResponseListener,data:any){
       let xml = new XMLHttpRequest();
       //asynchronous request method
       let jdata=JSON.stringify(data);
       xml.onreadystatechange = function respuestaServidor(){
           
           if(xml.readyState == 4)//status 4 all transaction performed
           {
               listener.handlePOSTResponse(xml.status, xml.response);      
           }                        
       }
       xml.open("POST", url,true);//true --->asincrona
       xml.setRequestHeader("Content-Type","application/json;charset=UTF-8");
       xml.send(jdata);
   }


   public requestPATCH(url:string, listener:PATCHResponseListener, data:any){
    let xml = new XMLHttpRequest();
    //asynchronous request method
    let jdata=JSON.stringify(data);   
    xml.onreadystatechange = function respuestaServidor(){
   
        if(xml.readyState == 4)//status 4 all transaction performed
        {
            listener.handlePATCHResponse(xml.status, xml.response);      
        }                        
    }
    xml.open("PATCH", url,true);//true --->asincrona
    xml.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    xml.send(jdata);
}




   public requestPUT(url:string, listener:PutResponseListener,data:any){
   ///AJAX api rest PUT for state changes
   console.log("sending state changes")
   let xml = new XMLHttpRequest();
   console.log(data);
   //asynchronous request method
   let jdata=JSON.stringify(data);
   console.log(jdata);
   xml.onreadystatechange = function respuestaServidor(){
       
       if(xml.readyState == 4)//status 4 all transaction performed
       {
           listener.handlePutResponse(xml.status, xml.response);      
       }                        
   }
   xml.open("PUT", url,true);//true --->asincrona
   xml.setRequestHeader("Content-Type","application/json;charset=UTF-8");
   xml.send(jdata);

   }
}

interface GETResponseListener {
    handleGETResponse (status: number, response: string): void;
}

interface POSTResponseListener {
    handlePOSTResponse (status: number, response: string): void;
}

interface DELETEResponseListener {
    handleDELETEResponse (status: number, response: string): void;
}

interface PATCHResponseListener {
    handlePATCHResponse (status: number, response: string): void;
}

interface PutResponseListener {
    handlePutResponse (status: number, response: string): void;
}