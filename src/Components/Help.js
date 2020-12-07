import React, { useState } from 'react'
import './Help.css'
import info from '../Assets/information.png'
import arrow from '../Assets/double-arrow.png'

const Help = () => {
    const [show, updateShow] = useState(true)

    return (
        <div className="help">
            <p className="ajuda" onClick={() => updateShow(!show)}>Ajuda
                <img src={arrow} className="info-icon" onClick={() => updateShow(!show)}/>
            </p> 
            <div className="help-menu" hidden={show}>
                <p className="nova-reserva">Nova Reserva </p>
                <ol className="lista">
                    <li>Selecione a mesa livre pretendida</li>
                    <li>Inserir número do aluno</li>
                    <li>Confirme no botão “Confirmar”</li>
                </ol>
                <p className="nova-reserva">Check in</p>
                <ol className="lista">
                    <li>Selecione a mesa do aluno.</li>
                    <li>Confirme no botão “Check-in”.</li>
                </ol>
                <p className="nova-reserva">Cancelamento</p>
                <ol className="lista">
                    <li>Selecione a mesa que pretende cancelar a reserva.</li>
                    <li>Prima o botão “Cancelar”.</li>
                </ol>
                <p className="nova-reserva">Estender sessão</p>
                <ol className="lista">
                    <li>Selecione a mesa que pretende estender a reservar.</li>
                    <li>Prima o botão “Estender”</li>
                </ol>
                <p className="nova-reserva">Marcar como “limpa”</p>
                <ol className="lista">
                    <li>Selecione a mesa que pretende marcar como “limpa”.</li>
                    <li>Prima o botão “marcar como limpa”.</li>
                </ol>
            </div>
        </div>
    )
}

export default Help