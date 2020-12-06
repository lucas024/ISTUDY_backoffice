import React, { useState, useEffect } from 'react'
import './Table.css'
import Computer from '../Assets/computer.png'
import Avatar from '../Assets/avatar.png'
import Moment from 'react-moment';
import  moment  from "moment";
import app, { firestore } from '../fire';




const Table = (props) => {

    const [time, updateTime] = useState(1800)
    const date = new Date()
    let duration = props.table?props.table.reservation.endTime?moment(props.table.reservation.endTime.toDate()).diff(moment(),"minutes"):null:null
    let fim = props.table?props.table.reservation.endTime?moment(props.table.reservation.endTime.toDate()).hour() + ':' + (moment(props.table.reservation.endTime.toDate()).minute().toString().length<2?"0"+moment(props.table.reservation.endTime.toDate()).minute():moment(props.table.reservation.endTime.toDate()).minute()):null:null
    const [istID, updateIstID] = useState("")
    const [reynaud, updateReynaud] = useState(true)

    const getMinutes = () => {
        let totalSeconds = time
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        if(minutes<10) return(hours.toString() + "h:" + minutes.toString() +"0m")
        return(hours.toString() + "h:" + minutes.toString() +"m")
    }

    const timeChangeHandler = (val) => {
        let current = time
        if(current === 10800 && val===0) {
            current -= 1800
            updateTime(current)
        }
        else if(current>1800 && val===0){
            current -= 1800
            updateTime(current)
        }
        if(current<10800 && val===1){
            current += 1800
            updateTime(current)
        }        
    }

    // Checks if istID meets the requirements
    function checkIstID() {
        console.log(/^([0-9]{6})$/.test(istID))
        return /^([0-9]{6})$/.test(istID) 
    }

    const reservationHandler = (tipo) => {
        let currentTime = moment()
        let finalTime = moment().add(time, 'seconds')
        let finalTimeMinutes = finalTime.minute()
        if(finalTimeMinutes.length===1) finalTimeMinutes = '0' + finalTimeMinutes
        let f = finalTime.hour() + ':' + finalTimeMinutes
        
        duration = finalTime.diff(moment(),"minutes")
        updateIstID(istID)

        const end = finalTime.toDate()
        const init = currentTime.toDate()

        if(tipo === 'new'){
            if(!checkIstID()){
                console.log('The istID inserted does not meet the requirements');
                console.log('Nothing to do...');
                return
            }
            fim = f
        }
        else if(tipo === "extend"){
            var endExtend = moment(fim, 'HH:mm').add(time, "seconds").toDate()
            updateReynaud(true)
        }

        const reservation = {
            endTime: tipo === 'extend' ? endExtend : end,
            initTime: init,
            istID: (tipo === 'checkin' || tipo === 'extend') ? props.table.reservation.istID : istID,
            checked: (tipo === 'checkin' || tipo === 'extend') ? true : false,
        }

        for(const elem of props.buildings){
            if(elem.name===props.currentBuilding.name){
                firestore.collection("tecnico4")
                .doc(elem.id).get().then(res => {
                    let getRooms = res.data().rooms
                    for(const r of getRooms){
                        if(r.name===props.room){
                            let indexRoom = getRooms.findIndex(e =>  {return e.name === r.name})
                            for(const t of r.tables){
                                if(t.name === props.table.name){
                                    let getTables = r.tables
                                    let indexTable = r.tables.findIndex(e =>  {return e.name === t.name})
                                    if(tipo === "new" || tipo === 'checkin' || tipo === "extend"){
                                        getTables[indexTable].reservation = reservation
                                        getTables[indexTable].dirty = true
                                        getRooms[indexRoom] = {
                                            tables:getTables,
                                            name:parseInt(r.name) 
                                        }
                                    }
                                    else if(tipo==="clean"){
                                        getTables[indexTable].dirty = false
                                        getRooms[indexRoom] = {
                                            tables:getTables,
                                            name:parseInt(r.name) 
                                        }
                                    }
                                    else if(tipo === "cancelar" || tipo === 'checkout'){
                                        const cancelReservation = {
                                            endTime: null,
                                            initTime: null,
                                            istID: null,
                                            checked:false,
                                        }

                                        getTables[indexTable].reservation = cancelReservation

                                        if(tipo === 'checkout'){
                                            getTables[indexTable].dirty = true
                                        }
                                        
                                        getRooms[indexRoom] = {
                                            tables:getTables,
                                            name:parseInt(r.name) 
                                        }
                                    }
                                   
                                    firestore.collection('tecnico4').doc(elem.id).update({
                                        rooms: getRooms,
                                        name: elem.name
                                    }).then(() => props.callbackReserva(t))
                                }
                            }
                        }
                    }  
                })                               
            }
        }
    }

    return (
        <div className="table" hidden={props.table?false:true}>
            <p className="table-bye" onClick={() => { props.callback(); updateReynaud(true);}}>X</p>
            {/* MESA LIMPA */}
            <div className="new" hidden={props.table?(props.table.reservation.endTime===null && props.table.dirty===false)?false:true:true}>
                <div className="new-top" >
                    <div className="new-left">
                        <div className="new-id">
                            <p className="new-id-text">IST ID</p>
                            <input className={istID ? checkIstID() ? "new-id-input" : "new-id-input-2" : "new-id-input"} onChange={(e) => updateIstID(e.target.value)}></input>
                        </div>
                        <div className="new-add-time">
                            <p className="new-add-duration">Duração:</p>
                            <div className="new-add-special">
                                <p onClick={() => timeChangeHandler(0)} className="new-add-button">-</p>
                                <p className="new-add-time-display">{getMinutes()}</p>
                                <p onClick={() => timeChangeHandler(1)} className="new-add-button">+</p>
                            </div>
                            <div >
                                <div style={{marginLeft:"15px"}}>
                                    <div style={{display:"flex"}}>
                                        <p style={{color:"#ccc",marginRight:"5px", textAlign:"right" }}>Início:</p>
                                        <Moment format="HH:mm">{date}</Moment>
                                    </div>
                                    <div style={{display:"flex", justifyContent:"flex-end", marginLeft:"auto", marginRight:0}}>
                                        <p style={{color:"#ccc",marginRight:"5px",textAlign:"right"}}>Fim:</p>
                                        <Moment format="HH:mm" add={{ seconds: time }} >{date}</Moment>
                                    </div>
                                </div>
                            </div>
                            
                           
                        </div>
                    </div>  
                    <div className="new-right">
                        <div className="new-right-top">
                            <div className="new-right-top-color" style={{backgroundColor:"#00E070"}}></div>
                            <p className="new-right-top-number">Mesa {props.table?props.table.name:null}</p>
                        </div>
                        <img className="new-right-img" src={Computer} hidden={props.table?props.table.hasPc?false:true:true}></img>
                    </div>       
                </div>
                <div className="new-bot">
                    <div className="new-bot-div">
                        <p className="new-bot-button" onClick={() => reservationHandler("new")}>Confirmar</p>
                        <div className="clean-bot-under-confirmar" style={{backgroundColor:"#00E070"}}></div>

                    </div>
                    
                </div>  
            </div>
            {/* MESA NAO LIMPA SEM RESERVA*/}
            <div hidden={props.table?(props.table.dirty && props.table.reservation.endTime===null)?false:true:true}>
                <div className="new-top" >
                    <div className="new-right">
                        <div className="new-right-top">
                            <div className="new-right-top-color" style={{backgroundColor:"#FFC700"}}></div>
                            <p className="new-right-top-number">Mesa {props.table?props.table.name:null}</p>
                        </div>
                        <img className="new-right-img" src={Computer} hidden={props.table?props.table.hasPc?false:true:true}></img>
                    </div>       
                </div>
                <div className="clean-bot">
                    <p className="new-bot-button" onClick={() => reservationHandler("clean")}>Marcar como “limpa”</p>
                    <div className="clean-bot-under" style={{backgroundColor:"#FFC700"}}></div>
                </div>  
            
            </div>
            {/* MESA OCUPADA SEM CHECK-IN */}
            <div hidden={props.table?props.table.reservation.endTime !== null && props.table.reservation.checked === false?false:true:true}>
            <div className="new-top" >
                    <div className="new-left">
                        <div style={{display:"flex"}}>
                            <img src={Avatar} alt="perfil" className="cancelar-left-img"></img>
                            <div className="cancelar-left-user">
                                <p className="new-id-text-cancelar">{props.table ? props.table.reservation.istID : null}</p>
                                <p className="new-id-text-cancelar-duration"><p style={{color:"#ccc", marginRight:"5PX"}}>Tempo restante:</p>{duration?duration:null} min </p>
                                <p className="new-id-text-cancelar-end"><p style={{color:"#ccc", marginRight:"5PX"}}>Fim:</p>{fim}</p>
                            </div>
                        </div>
                    </div>  
                    <div className="new-right">
                        <div className="new-right-top">
                            <div className="new-right-top-color" style={{backgroundColor:"#FF8A00"}}></div>
                            <p className="new-right-top-number">Mesa {props.table?props.table.name:null}</p>
                        </div>
                        <img className="new-right-img" src={Computer} hidden={props.table?props.table.hasPc?false:true:true}></img>
                    </div>       
                </div>
                <div className="new-bot">
                    <div className="new-bot-div">
                        <p className="new-bot-button" onClick={() => reservationHandler("cancelar")}>Cancelar</p>
                        <div className="clean-bot-under-confirmar" style={{backgroundColor:"#FFC700"}}></div>
                    </div>
                    <div className="new-bot-div">
                        <p className="new-bot-button" onClick={() => reservationHandler("checkin")}>Check-in</p>
                        <div className="clean-bot-under-confirmar" style={{backgroundColor:"#DA1919"}}></div>
                    </div>
                </div>  
                </div>
            {/* MESA OCUPADA*/}
            <div hidden={props.table?props.table.reservation.endTime !== null && props.table.reservation.checked === true?false:true:true}>
            <div className="new-top" >
                    <div className="new-left">
                        <div style={{display:"flex"}}>
                            <img src={Avatar} alt="perfil" className="cancelar-left-img"></img>
                            <div className="cancelar-left-user">
                                <p className="new-id-text-cancelar" ></p>
                                <p className="new-id-text-cancelar">{props.table ? props.table.reservation.istID : null}</p>
                                <p className="new-id-text-cancelar-duration"><p style={{color:"#ccc", marginRight:"5PX"}}>Tempo restante:</p>{duration?duration:null} min </p>
                                <p className="new-id-text-cancelar-end"><p style={{color:"#ccc", marginRight:"5PX"}}>Fim:</p>{fim}</p>
                            </div>
                        </div>
                    </div>  
                    <div className="new-right">
                        <div className="new-right-top">
                            <div className="new-right-top-color" style={{backgroundColor:"#da1919"}}></div>
                            <p className="new-right-top-number">Mesa {props.table?props.table.name:null}</p>
                        </div>
                        <img className="new-right-img" src={Computer} hidden={props.table?props.table.hasPc?false:true:true}></img>
                    </div>       
                </div>
                <div className="new-bot">
                    <div className="new-bot-div">
                        <p className="new-bot-button" onClick={() => reservationHandler("checkout")}>Check-out</p>
                        <div className="clean-bot-under-confirmar" style={{backgroundColor:"#FFC700"}}></div>
                    </div>
                    <div className="new-bot-div">
                        <p className="new-bot-button" style={{backgroundColor: duration >= 30 ? "#CCCCCC": "#FFFFFF", color: duration >= 30 ? "#FFFFFF": "#009DE0"}} onClick={() => {duration <= 30 ? updateReynaud(false) : console.log("Nada");}} >Estender</p>
                        <div className="clean-bot-under-confirmar" style={{backgroundColor: "#DA1919"}}></div>
                    </div>
                </div> 
                <div className="extend" hidden={reynaud}>
                    <div className="new-add-time-extend">
                        <p className="new-add-duration">Duração:</p>
                        <div className="new-add-special">
                            <p onClick={() => timeChangeHandler(0)} className="new-add-button">-</p>
                            <p className="new-add-time-display">{getMinutes()}</p>
                            <p onClick={() => timeChangeHandler(1)} className="new-add-button">+</p>
                        </div>
                        <div >
                            <div style={{marginLeft:"15px"}}>
                                <div style={{display:"flex"}}>
                                    <p style={{color:"#ccc",marginRight:"5px", textAlign:"right" }}>Início:</p>
                                    <Moment format="HH:mm">{date}</Moment>
                                </div>
                                <div style={{display:"flex", justifyContent:"flex-end", marginLeft:"auto", marginRight:0}}>
                                    <p style={{color:"#ccc",marginRight:"5px",textAlign:"right"}}>Fim:</p>
                                    <Moment format="HH:mm" add={{ seconds: time }} >{date}</Moment>
                                </div>
                            </div>
                        </div>                          
                    </div> 
                    <div className="new-bot-div-extend-confirmar">
                            <p className="new-bot-button-confirmar" style={{color:"#FFFFFF", marginTop: "5px", fontWeight: "400", fontSize: "20px"}} onClick={() => reservationHandler("extend")}>Confirmar</p>
                    </div>  
                </div>
            </div>
        </div>
    )
}
export default Table