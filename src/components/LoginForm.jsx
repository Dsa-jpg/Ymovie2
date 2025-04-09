import React, { useState, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Toast } from 'primereact/toast';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [salt, setSalt] = useState('');
   
    const toast = useRef(null); // Definujeme referenci na toast


    const handleSubmit = async () => {
        try {
            const result = await invoke('get_salt', { username });
            localStorage.setItem('salt', result);
            setSalt(result);

            const resultLogin = await invoke('login', { username, password, salt });
            localStorage.setItem('token', resultLogin);

            const token = localStorage.getItem('token')
            const resultUserData = await invoke('get_user_data',{token})
            

            // Ukázání toastu o úspěšném přihlášení
            toast.current.show({
                severity: 'success', 
                summary: 'Login Successful',
                detail: 'You have successfully logged in.',
                life: 3000,
            });

            toast.current.show({
                severity: 'info', 
                summary: 'The userdata',
                detail: `The Vip is until: ${resultUserData}`,
                life: 3000,
            })

        } catch (error) {


            // Ukázání toastu o neúspěšném přihlášení
            toast.current.show({
                severity: 'warn', // Varovná zpráva (žlutá barva)
                summary: 'Login Failed',
                detail: 'There was an error during login.',
                life: 3000,
            });

            console.error("The login wasn't successful: ", error);
        }
    };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" /> {/* Přidání toast komponenty */}
            <div className="card flex justify-content-center">
                <FloatLabel className="p-float-label">
                    <label htmlFor="username">Username</label>
                    <InputText
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    
                </FloatLabel>

                <FloatLabel className="p-float-label">
                    <label htmlFor="password">Password</label>
                    <InputText
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                </FloatLabel>

                <button onClick={handleSubmit}>Login</button>
            </div>
        </div>
    );
};


export default LoginForm;
