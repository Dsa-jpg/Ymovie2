import React, { useState, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Toast } from 'primereact/toast';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [salt, setSalt] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const toast = useRef(null); // Definujeme referenci na toast


    const handleSubmit = async () => {
        try {
            const result = await invoke('get_salt', { username });
            localStorage.setItem('salt', result);
            setSalt(result);

            const resultLogin = await invoke('login', { username, password, salt });
            localStorage.setItem('token', resultLogin);
            setLoginMessage('The login was successful.');

            // Ukázání toastu o úspěšném přihlášení
            toast.current.show({
                severity: 'success', // Úspěšná zpráva (zelená barva)
                summary: 'Login Successful',
                detail: 'You have successfully logged in.',
                life: 3000,
            });

        } catch (error) {
            setLoginMessage('The login was not successful.');

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
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
            />
            <button onClick={handleSubmit}>Login</button>
            {loginMessage && <p>{loginMessage}</p>}
        </div>
    );
};

export default LoginForm;
