import React, { useState } from 'react';
import '../Login.css';
import '../App.css';
import { Container } from 'react-bootstrap';
import API_URL from '../config/api';
import { useNavigate } from 'react-router-dom';


function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [firstname, setFirstname] = useState("")
    const [aftername, setAftername] = useState("")
    const [error, setError] = useState("")

    const navig = useNavigate()

    const registrerSubmit = async (e) => {
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
        if(password == "") {
            document.getElementById("errorUsername").
           style.display = "block"
        } else {
            document.getElementById("errorUsername").
           style.display = "none"            
        }
        if(username == "") {
            document.getElementById("errorFirstname").
           style.display = "block"
        } else {
            document.getElementById("errorFirstname").
           style.display = "none"            
        }
        if(password == "") {
            document.getElementById("errorAftername").
           style.display = "block"
        } else {
            document.getElementById("errorAftername").
           style.display = "none"            
        }

        if(email != "" && password != "" && username != "" && firstname != "" && aftername != "") {
            const data = {
                email: email,
                password: password,
                username: username,
                firstname: firstname,
                aftername: aftername
            }
            try {
                const response = await fetch(`${API_URL}/api/loginApi/registerPost`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(data)
                });
                if(!response.ok) {
                    setError("E-post eller passord er feil eller at brukeren ikke eksisterer")
                }

                const getData = await response.json()
                sessionStorage.setItem("user", JSON.stringify(getData))
                navig("/")
            }
            catch (error) {
                setError("Nettverket er ustabilt eller er offline nå foreløpig. Prøv igjen snere {error}")
            }
        }
    }

    return (
        <Container className="py-4 content-under-navbar">
            <div className='containerLogin'>
                <div className='divBox'>
                    <h1>Registrer deg</h1>
                    <p>Registrer deg hos Aplzz og start din reise!</p>
                    {error && <div style={{color: "red"}}>{error}</div>}
                    <form onSubmit={registrerSubmit}>
                        <div className='containerInput'>
                            <div className='info'>Legg til e-post</div>
                            <input className='inputLogin' 
                            id="emailInput"
                            value={email} onChange={(e) => setEmail(e.target.value)} 
                            placeholder='example@www.com' 
                            type="email"></input>
                            <div className='errorMessage' id='errorEmail'>E-post er tomt</div>
                        </div>
                        <div className='containerInput'>
                            <div className='info'>Lag et passord</div>
                            <input type="password"
                            className='inputLogin' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}  
                            placeholder='******'></input>
                            <div className='errorMessage' id='errorPassword'>Passordet er tomt</div>
                        </div>
                        <div className='containerInput'>
                            <div className='info'>Lag et brukernavn</div>
                            <input type="text"
                            className='inputLogin' 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}  
                            placeholder='Brukernavn f.eks bruker1234'></input>
                            <div className='errorMessage' id='errorUsername'>Brukernavn er tomt</div>
                        </div>
                        <div className='containerInput'>
                            <div className='info'>Fornavn</div>
                            <input type="text"
                            className='inputLogin' 
                            value={firstname} 
                            onChange={(e) => setFirstname(e.target.value)}  
                            placeholder='Fornavnet ditt'></input>
                            <div className='errorMessage' id='errorFirstname'>Fornavnet er tomt</div>
                        </div>
                        <div className='containerInput'>
                            <div className='info'>Etternavnet</div>
                            <input type="text"
                            className='inputLogin' 
                            value={aftername} 
                            onChange={(e) => setAftername(e.target.value)}  
                            placeholder='Etternavnet ditt'></input>
                            <div className='errorMessage' id='errorAftername'>Etternavnet er tomt</div>
                        </div>
                        <button className='btn-primary' type='submit'>Registrer deg</button> eller <a>Logg inn</a>
                    </form>
                </div>
            </div>
            
        </Container>
    )
}

export default Register;