import React, { useState } from 'react';
import Cookies from 'js-cookie';
import '../Login.css';
import '../App.css';
import { Container } from 'react-bootstrap';
import { Form, Input } from 'react-bootstrap';
import API_URL from '../config/api';
import { useNavigate } from 'react-router-dom';


function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const navig = useNavigate()

    const loginSubmit = async (e) => {
        e.preventDefault();
        if(email == "") {
           document.getElementById("errorEmail").
           style.display = "block"
           document.getElementById("emailInput").
           style.borderColor = "red"
        } else {
            document.getElementById("errorEmail").
           style.display = "none"
            document.getElementById("emailInput").
           style.borderColor = "#817d7d"
        }
        if(password == "") {
            document.getElementById("errorPassword").
           style.display = "block"
        } else {
            document.getElementById("errorPassword").
           style.display = "none"            
        }

        if(email != "" && password != "") {
            const data = {
                email: email,
                password: password
            }
            try {
                const response = await fetch(`${API_URL}/api/loginApi/loginPost`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(data)
                });
                if(!response.ok) {
                    setError("Det var noe feil med nettverket eller server, prøv igjen")
                }

                const getData = await response.json()
                Cookies.set("user", JSON.stringify(getData.token))
                navig("/")
            }
            catch (error) {
                setError("Nettverket er ustabilt eller er offline nå foreløpig. Prøv igjen snere {error}", error)
            }
        }
    }

    return (
        <Container className="py-4 content-under-navbar">
            <div className='containerLogin'>
                <div className='divBox'>
                    <h1>Logg inn</h1>
                    <p>Logg inn hos Aplzz og start din reise!</p>
                    {error && <div style={{color: "red"}}>{error}</div>}
                    <form onSubmit={loginSubmit}>
                        <div className='containerInput'>
                            <div className='info'>E-post</div>
                            <input className='inputLogin' 
                            id="emailInput"
                            value={email} onChange={(e) => setEmail(e.target.value)} 
                            placeholder='example@www.com' 
                            type="email"></input>
                            <div className='errorMessage' id='errorEmail'>E-post er tomt</div>
                        </div>
                        <div className='containerInput'>
                            <div className='info'>Passord</div>
                            <input type="password"
                            className='inputLogin' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}  
                            placeholder='******'></input>
                            <div className='errorMessage' id='errorPassword'>Passordet er tomt!</div>
                        </div>
                        <button className='btn-primary' type='submit'>Logg inn</button> eller registrer deg
                    </form>
                </div>
            </div>
            
        </Container>
    )
}

export default Login;