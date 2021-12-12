var M;

class Main implements EventListenerObject,GETResponseListener, POSTResponseListener, DELETEResponseListener, PATCHResponseListener, PutResponseListener {

    restFramework: RestFramework;
    devices: Array<Device> = [];
    originalDevice: Device;

    constructor() {
        this.restFramework = new RestFramework();
        this.restFramework.requestGET("http://localhost:8000/devices", this);
        let container = document.getElementById("spa_container");
        container.addEventListener("click", this);
    }

    /**
     * Manejador de todos los eventos sobre el document
     */

    handleEvent(evt: Event) {
        console.log(evt);
        let element = <HTMLInputElement>evt.target;
   
        if(evt.type === "click") {

          if(element.id.startsWith("delete")) {
               console.log(element);
               console.log(element.getAttribute('deviceid')); 
               this.restFramework.requestDEL(`http://localhost:8000/devices/${element.getAttribute('deviceid')}`,this);
               
           }


           if(element.id === "upd_device_cancel") {
            let modal = <any>document.getElementById("update_modal");
            let elems = document.querySelectorAll('.modal');
            let instances = M.Modal.init(elems, {});
            let instance = M.Modal.getInstance(modal);
            instance.close();
        }

        if(element.id === "upd_modify_device_save") {
            let txtName = (<HTMLInputElement>document.getElementById("txt_dev_name")).value;
            let txtDescription = (<HTMLInputElement>document.getElementById("txt_dev_description")).value;
            let type = (<HTMLSelectElement>document.getElementById("select_device_type")).value;
            this.originalDevice = this.devices.find(d => d.id === Number(element.getAttribute('deviceid'))) ;
            let deviceUpdated = {  
                id : this.originalDevice.id,
                name : txtName,
                type : Number(type),
                description : txtDescription,
                state : this.originalDevice.state}
          
            console.log(element.getAttribute('deviceid'));
            this.restFramework.requestPUT(`http://localhost:8000/devices/${element.getAttribute('deviceid')}`,this, deviceUpdated);

        } 
           if(element.id.startsWith("update_")) {

                    let modal = <any>document.getElementById("update_modal");
                    let elems = document.querySelectorAll('.modal');
                    let instances = M.Modal.init(elems, {});
                    let instance = M.Modal.getInstance(modal);
                    let txtName = <HTMLInputElement>document.getElementById("txt_dev_name");
                    let txtDescription = <HTMLInputElement>document.getElementById("txt_dev_description");
    
                    txtName.value = element.getAttribute('devicename');
                    console.log(element.getAttribute('deviceDescription'));
                    txtDescription.value = element.getAttribute('deviceDescription');
    
                    let type = <HTMLSelectElement>document.getElementById("select_device_type");
                    type.value = element.getAttribute('devicetype');
    
                    elems = document.querySelectorAll('select');
                    instances = M.FormSelect.init(elems, {});
    
                    let btnGuardar = <any>document.getElementById("upd_modify_device_save");
                    btnGuardar.setAttribute("deviceid",element.getAttribute('deviceid'));
                   
    
                    instance.open();



               
            
        }

        if(element.id.startsWith("btn_switch_")) {
            let switchElement = <any>document.getElementById("switch_"+element.getAttribute('deviceid'));
            let status = {
                state : (switchElement.checked)?1:0
            }
            this.restFramework.requestPATCH(`http://localhost:8000/devices/${switchElement.getAttribute('deviceid')}/state`,this,status)
        }


        if(element.id.startsWith("btn_range_")) {
            let range = <any>document.getElementById('range_'+ element.getAttribute('deviceid'));
            
            let status = {
                state : range.value
            }
            this.restFramework.requestPATCH(`http://localhost:8000/devices/${element.getAttribute('deviceid')}/state`,this,status)
        }

        if(element.id.startsWith("range_")) {
            let txtRange = <any>document.getElementById('textInput'+ element.getAttribute('deviceid'));
            txtRange.innerHTML = element.value;
        }


        if(element.id.startsWith("btnNewDevice")) {
            let modal = <any>document.getElementById("create_modal");
            let elems = document.querySelectorAll('.modal');
            let instances = M.Modal.init(elems, {dismissible:false, preventScrolling:true, onCloseEnd() {
                document.body.style.overflow = '';
              }});
            let instance = M.Modal.getInstance(modal);
            let txtName = <HTMLInputElement>document.getElementById("create_dev_name");
            let txtDescription = <HTMLInputElement>document.getElementById("create_dev_description");

            txtName.value = "";
            txtDescription.value = "";
            let type = <HTMLSelectElement>document.getElementById("create_device_type");
            type.value = "1";

            elems = document.querySelectorAll('select');
            instances = M.FormSelect.init(elems, {});


            instance.open();

        }


        if(element.id === "create_device_cancel") {
            let modal = <any>document.getElementById("create_modal");
            let elems = document.querySelectorAll('.modal');
            let instances = M.Modal.init(elems, {});
            let instance = M.Modal.getInstance(modal);
            instance.close();
        }

        if(element.id === "create_device_save") {
            let txtName = (<HTMLInputElement>document.getElementById("create_dev_name")).value;
            let txtDescription = (<HTMLInputElement>document.getElementById("create_dev_description")).value;
            let type = (<HTMLSelectElement>document.getElementById("create_device_type")).value;
            
       

            let newDevice = {  
                name : txtName,
                type : Number(type),
                description : txtDescription,
                state : 0}
          
            this.restFramework.requestPOST('http://localhost:8000/devices',this, newDevice);
        }

    }

    }

    handleDELETEResponse(status: number, response: string) {
        this.refresh();
        console.log(response);
    }

    handleGETResponse(status: number, response: string) {
        console.log('response' + response);
        if( status == 200 ) {
            let devicesList = document.getElementById('devicesList');
            this.devices = JSON.parse(response);
            this.devices.forEach( device => {
                devicesList.innerHTML += this.showDeviceCard(device);
            })


        }
    }

    handlePATCHResponse(status: number, response: string) {
        console.log(response);
        this.refresh();
    }

    handlePOSTResponse(status: number, response: string) {
        if(status === 201) {
            let device = JSON.parse(response);
            this.devices.push(device);
            let devicesList = document.getElementById('devicesList');
            devicesList.innerHTML += this.showDeviceCard(device);
        }
       console.log(this.devices);
    }

    handlePutResponse(status: number, response: string) {
        this.refresh();
    }

    /**
     * 
     * @param devices : Device a mostrar en una card
     * Se mostrara como dato principal el nombre, y los detalles en una reveal card 
     * De acuerdo al tipo de dispositivo se podra regular mediante un slice o con un check para apagar/prender
     * Para confirmar el cambio de estado se debera usar el boton flotante de check
     * Tambien en el footer estaran las opciones para eliminar o abrir el modal de actualizacion
     * Referencia:  https://materializecss.com/cards.html
     * 
     */
    showDeviceCard( device : Device):string {
       let card = `
       <div class="col s6 m6">
         <div class="card sticky-action small blue" id=card${device.id}>
           <div class="card-content white-text">
             <span class="card-title activator white-text text-darken-4">${device.name}<i class="material-icons right">more_vert</i></span>`;
             if(device.type ===1 ) {
                card +=    `
                <div class="switch card_control">
                <label>
                    OFF
                    <input type="checkbox" id="switch_${device.id}" ${(device.state)? "checked": ""} deviceid="${device.id}">
                    <span class="lever"></span>
                    ON
                </label>
                    <button class="btn-floating btn-small red" title="Confirmar estado">
                        <i class="large material-icons"id="btn_switch_${device.id}" deviceid="${device.id}" >check</i>
                    </button>
                </div>`;
            } else {
                card += `
                <div class="row s6 m6">
                <input type="range" style="width: 100px;" id="range_${device.id}" min="0" max="100" value = ${device.state} deviceid="${device.id}"  step = 10>
                <output  class = "label" id="textInput${device.id}" >${device.state}</output>
                <button class="btn-floating btn-small red" title="Confirmar intensidad">
                    <i class="large material-icons" id="btn_range_${device.id}" deviceid="${device.id}" >check</i>
                </button></div>`;
            }
            card += `
             
             </div>
             <div class="card-reveal">
             <span class="card-title grey-text text-darken-4">Descripcion<i class="material-icons right">close</i></span>
             <p>${device.description}</p>`;
             if(device.type === 1) {
                 card += 'Tipo: ON/OFF';
             } else {
                 card += 'Tipo: Regulable';   
             }
           card += `</div>
           <div class="card-action">
             <a  id="update_${device.id}" deviceid=${device.id} devicename="${device.name}" devicedescription="${device.description}" devicetype=${device.type} >Actualizar</a>
             <a  id="delete_${device.id}" deviceid=${device.id}>Eliminar</a>
           </div>
         </div>
       </div>`;

     return card;
    }

/**
 * Limpia la pantalla y lista nuevamente los datos
 */
    refresh() {
        this.devices = [];
        let devicesList = document.getElementById('devicesList');
        devicesList.innerHTML = null;
        this.restFramework.requestGET("http://localhost:8000/devices", this);
    }

}





window.onload = function () {
    let main : Main = new Main();

    let create_button = this.document.getElementById("btnNewDevice");
    create_button.addEventListener("click", main);
    
    
}