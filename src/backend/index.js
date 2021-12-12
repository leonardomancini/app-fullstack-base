//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

jsonDevices = require('./devices.js')

/**
 * Metodo que captura request para obtener todos los devices
 * Recibe opcionalmente parametro para ordenar ascendente/descendente
 * 
 * Codigos de estado:
 *  -500: Error interno al conectarse a la base
 *  -200: Funcionamiento correcto
 * 
 * Body:
 *  Array de json con los datos de cada device:
 *       id: number, 
        name: string, 
        description: string, 
        state: number, 
        type: number (1-On/Off, 2-Regulable)
 * 
 */
app.get('/devices/', function(req, res, next) {
    let query = "SELECT * FROM Devices";
    if( req.query.sort === 'DES') {
       query += " ORDER BY id DESC";
    } else {
        query += " ORDER BY id ASC";     
    }
    utils.query(query, (error,result, fields) =>{
        if(error) return res.status(500).send("Error:"+ error);
        return res.status(200).send(JSON.stringify(result));
    }); 
});


/**
 * Metodo que captura request para obtener un device
 * PathParam: Id del dispositivo
 * 
 * Codigos de estado:
 *  -500: Error interno al conectarse a la base
 *  -200: Funcionamiento correcto
 *  -404: No existe el device
 * 
 * Body:
 *  Json con los datos de cada device:
 *       id: number, 
        name: string, 
        description: string, 
        state: number, 
        type: number (1-On/Off, 2-Regulable)
 * 
 */

app.get('/devices/:id', function(req, res, next) {
/*jsonDevices.forEach(element => {
        if(element.id == req.params.id ) {
            return res.status(200).send(JSON.stringify(element));
        } 
    });
    
    return res.status(404).send(null);
*/
    let query = "SELECT * FROM Devices WHERE id = ?";
    utils.query(query, [req.params.id], (error,result, fields) => {
        if(error) return res.status(500).send("Error:"+ error);
        if(result.affectedRows == 0) return res.status(404).send(null);
        return res.status(200).send(JSON.stringify(result));
    });
});

/**
 * Metodo que captura request para eliminar un device
 * PathParam: Id del dispositivo
 * 
 * Codigos de estado:
 *  -500: Error interno al conectarse a la base
 *  -200: Funcionamiento correcto
 *  -404: No existe el device
 * 
 * Body:
 *  empty
 * 
 */
app.delete('/devices/:id', function(req, res, next) {
   /* jsonDevices.forEach( (element, index) => {
           if(element.id == req.params.id ) {
                jsonDevices.splice(index,1)
                return res.status(200).send(JSON.stringify(element));
           } 
       });*/
        
     //  return res.status(404).send(null);
     let deleteSQL = "DELETE FROM Devices WHERE id = ?" ;
    
     utils.query(deleteSQL, [req.params.id],(error, result, fields) => {
        if(error) return res.status(500).send("Error:"+ error);
        if(result.affectedRows == 0) return res.status(404).send(null); 
        return res.status(200).send();
     });
   });


   /**
 * Metodo que captura request para crear device
 * 
 * Codigos de estado:
 *  -500: Error interno al conectarse a la base
 *  -201: Se creo un device exitosamente
 * Request Body:
 *       name: string, 
        description: string, 
        state: number, 
        type: number (1-On/Off, 2-Regulable)
 * 
 * Body:
 *  Json con los datos del device creado:
 *       id: number, 
        name: string, 
        description: string, 
        state: number, 
        type: number (1-On/Off, 2-Regulable)
 * 
 */
app.post('/devices', function (req, res, next) {
    
  //  const DeviceDTO = require('./devicedto.js')
  /*  const device = new DeviceDTO(req.body.id, req.body.name, req.body.description, req.body.state, req.body.type);
    if( jsonDevices.some( element => element.id === device.id )) {
        return res.status(400).send("Ya existe un device con ese id");
    }
    jsonDevices.push(device);*/
    let insertSQL = "INSERT INTO Devices (name,description,state,type) VALUES (?,?,?,?)";
    
    utils.query(insertSQL, [req.body.name, req.body.description, req.body.state, req.body.type],(error, result, fields) => {
        if(error) return res.status(500).send("Error:"+ error);
        return res.status(201).send(req.body);
    });

    


});

/**
 * Metodo que captura request para actualizar device
 * 
 * Codigos de estado:
 *  -500: Error interno al conectarse a la base
 *  -404: No existe device
 *  -200: Se actualizo un device exitosamente
 * Request Body:
 *       name: string, 
        description: string, 
        state: number, 
        type: number (1-On/Off, 2-Regulable)
 * 
 * Body:
 *  Json con los datos del device actualizado:
 *       id: number, 
        name: string, 
        description: string, 
        state: number, 
        type: number (1-On/Off, 2-Regulable)
 * 
 */

app.put('/devices/:id', function (req, res, next) {
    
    /*
    jsonDevices.forEach( (element, index) => {
        if(element.id == req.params.id ) {
             element.name = req.body.name;
             element.description = req.body.description;
             element.state = req.body.state;
             element.type = req.body.type;
             jsonDevices.splice(index,1);
             jsonDevices.push(element);
             return res.status(200).send(JSON.stringify(element));
        } 
    });*/
    let updateSQL = "UPDATE Devices SET name =?,description =?,state =?,type=? WHERE ID = ?";
    
    utils.query(updateSQL, [req.body.name, req.body.description, req.body.state, req.body.type,req.params.id],(error, result, fields) => {
        if(error) return res.status(500).send("Error:"+ error);
        if(result.affectedRows == 0) return res.status(404).send(null);
        
        return res.status(200).send(JSON.stringify(req.body));
    });
    


});

/**
 * Metodo que captura request para actualizar el estado de un device
 * 
 * Codigos de estado:
 *  -500: Error interno al conectarse a la base
 *  -404: No existe device
 *  -200: Se actualizo un device exitosamente
 * Request Body:
 *       state: string
        
 * 
 * Body:
 *  Json con los datos del device actualizado:
 *       id: number, 
         state: number
 * 
 */

app.patch('/devices/:id/state', function (req, res, next) {
    
    /*
    jsonDevices.forEach( (element, index) => {
        if(element.id == req.params.id ) {
             
             element.state = req.body.state;
             jsonDevices.splice(index,1);
             jsonDevices.push(element);
             return res.status(200).send(JSON.stringify(element));
        } 
    });
    
    return res.status(404).send(null);
    */
   let updateSQL = "UPDATE Devices SET state =? WHERE ID = ?";
   utils.query(updateSQL, [req.body.state, req.params.id],(error, result, fields) => {
    if(error) return res.status(500).send("Error:"+ error);
    if(result.affectedRows == 0) return res.status(400).send(null);   
    
    return res.status(200).send(JSON.stringify({id:req.params.id, state: req.body.state}));
   });

});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});


//=======[ End of file ]=======================================================
