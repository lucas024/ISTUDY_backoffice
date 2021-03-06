import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import Select from 'react-select'
import Avatar from '../Assets/avatar.png'
import Display from './Display'
import Table from './Table'
import Help from './Help'
import app, { firestore, functions, admin } from '../fire.js'
import moment from 'moment'

const options = [
    { value: 'RNL', label: 'RNL' },
    { value: 'Civil', label: 'Civil' },
    { value: 'Central', label: 'Central' },
    { value: 'torrenorte', label: 'Torre Norte' },
    { value: 'torresul', label: 'Torre Sul' }
]


const Dashboard = () => {
    const [currentBuilding, updateCurrentBuilding] = useState(null); // objeto edificio
    const [currentRoomSelected, updateCurrentRoomSelected] = useState(1); // nome da sala 
    const [currentTables, updateCurrentTables] = useState(); // objeto edificio
    const [buttonLivresSelected, updateButtonLivresSelected] = useState(false); 
    const [buttonComputadorSelected, updateButtonComputadorSelected] = useState(false);
    const [currentTableSelected, updateCurrentTableSelected] = useState(null); 
    const [allBuildings, updateAllBuildings] = useState(null);

    useEffect(() => {
        let arrayAll = []
        firestore
        .collection('tecnico4')
            .get().then(snapshot => {
                    snapshot.forEach(doc => {
                    let aux = doc.data()
                    aux["id"] = doc.id
                    arrayAll.push(aux)
                  })
                  updateAllBuildings(arrayAll)
                  for(const building of arrayAll){
                      if(building.name === "RNL"){
                        updateCurrentBuilding(building)
                        updateCurrentRoomSelected(parseInt(building.rooms[0].name))
                        updateCurrentTables(building.rooms[0].tables)
                        break
                      }
                      
                  }
                  /* window.setInterval(() => verificaEntradas(arrayAll), 10000); */
                })
    }, [])

    

    const verificaEntradas = (arrayAll) => {
        let reservation = {
            initTime:null,
            endTime:null,
            istID:null,
            checked:false
        }
        for(const elem of arrayAll){
            for(const room of elem.rooms){
                for(const table of room.tables){
                    if(table.reservation.endTime){
                        if(moment(table.reservation.endTime).diff(moment())<0){
                            firestore.collection("tecnico4")
                                .doc(elem.id).get().then(res => {
                            let getRooms = res.data().rooms
                            for(const r of getRooms){
                                if(r.name===room.name){
                                    let indexRoom = getRooms.findIndex(e =>  {return e.name === r.name})
                                    for(const t of room.tables){
                                        if(t.name === table.name){
                                            let getTables = room.tables
                                            let indexTable = room.tables.findIndex(e =>  {return e.name === t.name})
                                            getTables[indexTable].reservation = reservation
                                            getTables[indexTable].dirty = true
                                            getRooms[indexRoom] = {
                                                tables:getTables,
                                                name:parseInt(room.name) 
                                            }
                                            firestore.collection('tecnico4').doc(elem.id).update({
                                                rooms: getRooms,
                                                name: elem.name
                                            }).then()
                                        }
                                    }
                                }
                            }
                            
                        })
                    }}
                }
            } 
        }
    }
   
    

    const selectBuildingChangeHandler = (val) => {
        for(const elem of allBuildings){
            if(elem.name === val){
                updateCurrentBuilding(elem)
                updateCurrentRoomSelected(elem.rooms[0].name)
                updateCurrentTables(elem.rooms[0].tables)
                updateCurrentTableSelected(null)
            }
        }
    }

    const mapRoomsToBuilding = () => {
        if(currentBuilding){
            return currentBuilding.rooms.map((sala, key) => {
            let livre = 0, livreN = 0, ocupadaA = 0, ocupada = 0
            sala.tables.forEach(mesa => {
                if(mesa.reservation.endTime === null && mesa.dirty===false) livre++
                else if(mesa.reservation.endTime === null && mesa.dirty===true) livreN++
                else if(mesa.reservation.endTime !== null && mesa.reservation.checked===false) ocupadaA++
                else if(mesa.reservation.endTime !== null && mesa.reservation.checked===true) ocupada++
            })
            return(
                <li className={currentRoomSelected === sala.name ? "barraActive" : "barra"} onClick={() => {
                    updateCurrentRoomSelected(sala.name)
                    updateCurrentTableSelected(null)
                    updateCurrentTables(sala.tables)}}>
                    <p className="barra-nome">Sala {sala.name}</p>
                    <div className="barra-salas-flex">
                        <p style={{visibility:livre>0?"visible":"hidden", backgroundColor:"#00E070"}} className="barra-salas" >{livre}</p>
                        <p  className="barra-salas" style={{visibility:livreN>0?"visible":"hidden",backgroundColor:"#FFDC5F"}} >{livreN}</p>
                        <p style={{visibility:ocupadaA>0?"visible":"hidden", backgroundColor:"#FF8A00"}} className="barra-salas" >{ocupadaA}</p>
                        <p style={{visibility:ocupada>0?"visible":"hidden", backgroundColor:"#DA1919"}} className="barra-salas" >{ocupada}</p>
                    </div>
                </li>
            )
        })
        }
        
    }

    const getBarras = () => {
        let livre = 0, livreN = 0, ocupadaA = 0, ocupada = 0
        if(currentBuilding){
            for(const room of currentBuilding.rooms){
                if(currentRoomSelected === room.name){
                    for(const mesa of room.tables){
                        if(mesa.reservation.endTime === null && mesa.dirty===false) livre++
                        else if(mesa.reservation.endTime === null && mesa.dirty===true) livreN++
                        else if(mesa.reservation.endTime !== null && mesa.reservation.checked===false) ocupadaA++
                        else if(mesa.reservation.endTime !== null && mesa.reservation.checked===true) ocupada++
                    }  
                    return (
                        <div className="barra-salas-flex2" style={{marginTop:"20px"}}>
                            <p className="barra-salas2" style={{backgroundColor:"#00E070"}}>{livre}</p>
                            <p className="barra-salas2" style={{backgroundColor:"#FFDC5F"}}>{livreN}</p>
                            <p className="barra-salas2" style={{backgroundColor:"#FF8A00"}}>{ocupadaA}</p>
                            <p className="barra-salas2" style={{backgroundColor:"#DA1919"}}>{ocupada}</p>
                        </div>
                    )
                }
            }                    
        }
        
    }

    const handleTablePress = (val) => {
        updateCurrentTableSelected(val)
    }

    const handleReservationConfirm = (table1) => {
        let arrayAll = []
        firestore
        .collection('tecnico4')
            .get().then(snapshot => {
                    snapshot.forEach(doc => {
                    let aux = doc.data()
                    aux["id"] = doc.id
                    arrayAll.push(aux)
                  })
                  updateAllBuildings(arrayAll)
                  for(const b of arrayAll){
                      if(b.name === currentBuilding.name){
                          updateCurrentBuilding(b)
                            for(const r of b.rooms){
                                if(parseInt(r.name) === parseInt(currentRoomSelected)){
                                    for(const table of r.tables){
                                        if(table.name?table.name === table1.name:false){
                                            updateCurrentRoomSelected(parseInt(r.name))
                                            updateCurrentTables(r.tables)
                                            updateCurrentTableSelected(table)
                                        }
                                    }
                                    
                                }
                            }
                                
                      }
                  }
                    
                })
        
    }

    return (
        <div className="dashboard">   
            <div className="dashboard-left">                                                                                                                    
                <div className="dashboard-left-top">
                    <Select
                    onChange={e => selectBuildingChangeHandler(e.value)}
                    options={options} 
                    className="dashboard-left-select"
                    placeholder="RNL"
                    styles={{
                        control: (styles, state) => ({
                            ...styles,
                            boxShadow: state.isFocused ? "0 0 0 0.2rem 00A0E4" : 0,
                            borderColor: state.isFocused ? "#00A0E4" : "#00A0E4",
                            "&:hover": {
                            borderColor: state.isFocused ? "#00A0E4" : "#00A0E4",
                            color: "#00A0E4"
                        }
                        })
                    }}
                        />
                    <div className="dashboard-left-rooms">
                        <ul className="list-barras">
                        {mapRoomsToBuilding()}
                        </ul>
                    </div>
                    <div className="dashboard-left-legenda">
                        <div className="dashboard-left-legenda-flex">
                            <div className="dashboard-left-legenda-flex-bola" style={{backgroundColor:"#00E070"}}></div>
                            <p className="dashboard-left-legenda-flex-text">Livre (Limpa)</p>
                        </div>
                        <div className="dashboard-left-legenda-flex">
                            <div className="dashboard-left-legenda-flex-bola" style={{backgroundColor:"#FFDC5F"}}></div>
                            <p className="dashboard-left-legenda-flex-text">Livre (Não Limpa)</p>
                        </div>
                        <div className="dashboard-left-legenda-flex">
                            <div className="dashboard-left-legenda-flex-bola" style={{backgroundColor:"#FF8A00"}}></div>
                            <p className="dashboard-left-legenda-flex-text">Ocupada (Aguarda Check-In)</p>
                        </div>
                        <div className="dashboard-left-legenda-flex">
                            <div className="dashboard-left-legenda-flex-bola" style={{backgroundColor:"#DA1919"}}></div>
                            <p className="dashboard-left-legenda-flex-text">Ocupada (Checked-In)</p>
                        </div>            
                    </div>
                </div>
                <div className="dashboard-left-bot">
                <img src={Avatar} alt="avatar" className="dashboard-left-img"></img>
                <div className="dashboard-left-name">
                    <p className="dashboard-left-name-text">Manuel Vasco</p>
                    <p className="dashboard-left-name-seg">Segurança</p>
                </div>
                <p className="dashboard-left-sair">Sair</p>
                </div>
            </div>
            <div className="dashboard-right">
                <div className="dashboard-right-content">
                    <div className="dashboard-right-top">
                        <div className="dashboard-right-top-left">
                            <p className="dashboard-right-top-left-room">Sala {currentRoomSelected}</p>
                            <p className="dashboard-right-top-left-floor">Piso 1</p>
                            {getBarras()}
                            <div className="dashboard-right-top-left-buttons">
                                <p onClick={() => updateButtonLivresSelected(!buttonLivresSelected)} className={buttonLivresSelected? "dashboard-right-top-left-button-active": "dashboard-right-top-left-button"}>livres</p>
                                <p onClick={() => updateButtonComputadorSelected(!buttonComputadorSelected)} className={buttonComputadorSelected? "dashboard-right-top-left-button-active": "dashboard-right-top-left-button"}>computador</p>
                            </div>
                        </div>
                        <Table
                            currentBuilding={currentBuilding} // objeto edificio
                            room={currentRoomSelected} // nome da sala
                            table={currentTableSelected} // objeto mesa
                            buildings={allBuildings}
                            callback={() => updateCurrentTableSelected(null)}
                            callbackReserva = {(table1) => handleReservationConfirm(table1)}
                            />

                    </div>
                    <div style={{marginTop:"40px"}}>
                        <Display
                            tables={currentTables}
                            callback={(e) => handleTablePress(e)}/>
                    </div>
                    

                </div>
                
            </div>
            <div className="dashboard-help">
                <Help/>
            </div>
        </div>
    )
}

export default Dashboard