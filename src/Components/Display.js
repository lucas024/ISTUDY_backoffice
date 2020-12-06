import React, {useState, useEffect, useRef} from 'react'
import DisplayBox from './DisplayBox';
import './Display.css'


const Display = (props) => {

    const setDisplayLeft = () => {
        if(props.tables){
                let publications = props.tables
            if(publications){
                return publications.map((item, i) => {
                let side = (i%4)
                if(side === 0)
                    return (
                        <div onClick={() => props.callback(item)}>
                            <DisplayBox
                            item={item}
                            index={i}
                            current={props.currentTableSelected}
                            />
                        </div>
                    )
            })
            }
        }
        
    }

    const setDisplayMiddle = () => {
        if(props.tables){
            let publications = props.tables

        if(publications){
            return publications.map((item, i) => {
            let side = (i%4)
            if(side === 1)
                return (
                    <div onClick={() => props.callback(item)}>
                        <DisplayBox
                        item={item}
                        index={i}
                        current={props.currentTableSelected}
                        callbackReserva={props.callbackReserva}
                        />
                    </div>
                )
        })
        }
        }
        
    }
    const setDisplayRight = () => {
        if(props.tables){
            let publications = props.tables

        if(publications){
            return publications.map((item, i) => {
            let side = (i%4)
            if(side === 2)
                return (
                    <div onClick={() => props.callback(item)}>
                        <DisplayBox
                        item={item}
                        index={i}
                        current={props.currentTableSelected}
                        callbackReserva={props.callbackReserva}
                        />
                    </div>
                    
                )
        })
        }
        }
        
    }
    const setDisplayRight1 = () => {
        if(props.tables){
            let publications = props.tables

        if(publications){
            return publications.map((item, i) => {
            let side = (i%4)
            if(side === 3)
                return (
                    <div onClick={() => props.callback(item)}>
                        <DisplayBox
                        item={item}
                        index={i}
                        current={props.currentTableSelected}
                        callbackReserva={props.callbackReserva}
                        />
                    </div>
                )
        })
        }
        }
        
    }
    return(
        <div>
            <div className="display">
                <div className="fila-left">
                    {setDisplayLeft()}
                </div>
                <div className="fila-middleLeft">
                    {setDisplayMiddle()}
                </div>
                <div className="fila-middleRight">
                    {setDisplayRight()}
                </div>
                <div className="fila-right">
                    {setDisplayRight1()}
                </div>
            </div>

        </div>
        
    )
}

export default Display
