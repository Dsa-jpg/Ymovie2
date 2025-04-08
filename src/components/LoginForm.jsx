import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {

const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [salt, setSalt] = useState('');
const [loginMessage, setLoginMessage] = useState('');
const navigate = useNavigate();


const  handleSubmit = async () => {

    try {
        const result = await invoke('get_salt',{ username });
        localStorage.setItem("salt",result);
        setSalt(result);

        const resultLogin = await invoke("login",{ username, password, salt });
        localStorage.setItem("token",resultLogin);
        setLoginMessage("The login was succesfull.");
        navigate("/");
    } catch (error) {
        setLoginMessage("The login was not succesfull.")
        console.error("The login wasn't succesfull: ",error)   
    }

}




    
return(

    <div>
        <input
            type="text"
            value={username}
            onChange={e=> setUsername(e.target.value)}
            placeholder='Enter username'
        />
        <input
            type="password"
            value={password}
            onChange={e=> setPassword(e.target.value)}
            placeholder='Enter password'
            
        />
        <button onClick={handleSubmit}>Login</button>
        {loginMessage && <p>{loginMessage}</p>}
    </div>
    )
}


export default LoginForm;