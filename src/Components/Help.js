import React from 'react'
import './Help.css'

const Help = () => {
    return (
        <div className="help">
            <p className="ajuda">Ajuda</p>
            <p className="nova-reserva">Nova Reserva</p>
            <ol className="lista">
                <li>Selecione a mesa livre pretendida</li>
                <li>Inserir nome e número do aluno</li>
                <li>Confirme no botão “Reservar”
(A nova reserva terá o check-in feito imediatamente e de forma automática)</li>
            </ol>
            <p className="nova-reserva">Check in</p>
            <ol className="lista">
                <li>Selecione a mesa do aluno.</li>
                <li>Confirme no botão “Check-in”.</li>
            </ol>
            <p className="nova-reserva">Cancelamento </p>
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
    )
}

export default Help