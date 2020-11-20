import React, { useState, useEffect } from 'react'
import './Display.css'
import Computer from '../Assets/computer.png'
import Avatar from '../Assets/avatar.png'


const DisplayBox = (props) => {

    const item = props.item
    const index = props.index
    const current = props.current
    /* fazer um if se o current selected table name === this table name */

    return(
            <div className="display-box">
                <div className="display-box-top">
                    <p className="display-box-top-titulo">{index+1} </p>
                    <img hidden={!item.hasPc} src={Computer} className="display-box-top-img" alt="hasPC"></img>
                </div>
            <div className="display-box-bottom">
                <div className="display-box-user">
                    <img hidden={item.reservation?!item.reservation.istID:true} src={Avatar} className="display-box-user-photo" alt="userPhoto"></img>
                    <div className="display-box-right-user">
                        <p className="display-box-right-user-name"></p>
                        <p className="display-box-right-user-name">{item.reservation?item.reservation.istID:null}</p>
                    </div>
                </div>
                <div style={{backgroundColor:item.reservation?(item.reservation.endTime===null && item.dirty===false)?"#00E070":
                            (item.reservation.endTime===null && item.dirty===true)?"#FFDC5F":
                            (item.reservation.endTime!==null && item.reservation.checked===false)?"#FF8A00":
                            "#DA1919":"white"}} className="display-box-bottom-color">

                </div>      

        </div>
                
       
            </div>
            
 
  
    )
}

export default DisplayBox
