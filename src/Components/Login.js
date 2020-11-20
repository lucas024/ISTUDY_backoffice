import React from 'react'
import './Login.css'
import istLogo from '../Assets/IST_C.png'
import fundo from '../Assets/alameda-presente2.jpg'


const Login = () => {
    return(
        <div style={{
            background: `url(${fundo})`,
          }} className="login">
            <div className="login-box"> 
                <p className="login-box-logo">ISTUDY</p>
                <div className="login-box-input"> 
                    <div className="login-box-input-user">
                        <p className="login-box-input-grey">Admin ID</p>
                        <input type="text" className="login-box-input-user-input"></input>
                    </div>
                    <div className="login-box-input-password">
                        <p className="login-box-input-grey">Password</p>
                        <input type="password" className="login-box-input-user-input"></input>
                    </div>
                </div>
                <p className="login-box-button">LOGIN</p>
                <img src={istLogo} className="login-box-tecnico"/>
            </div>
            <div className="login-footer">

            </div>
        </div>
    )
}

export default Login