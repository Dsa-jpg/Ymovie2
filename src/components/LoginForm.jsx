import React, { useState, useRef, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Toast } from 'primereact/toast';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import "./LoginForm.css"

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [salt, setSalt] = useState('');
    const [logged, setLogged] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // ⬅️ přidaný loading state

    const toast = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const salt = localStorage.getItem('salt');
        const storedUsername = localStorage.getItem('username');

        if (token && salt && storedUsername) {
            setLogged(true);
        }
        setIsLoading(false); // ⬅️ ukončí načítání
    }, []);

    const handleSubmit = async () => {
        try {
            const result = await invoke('get_salt', { username });
            localStorage.setItem('salt', result);
            setSalt(result);

            const resultLogin = await invoke('login', { username, password, salt });
            localStorage.setItem('token', resultLogin);
            localStorage.setItem('username', username);

            const token = localStorage.getItem('token');
            const resultUserData = await invoke('get_user_data', { token });

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
            });

            setLogged(true);

        } catch (error) {
            toast.current.show({
                severity: 'warn',
                summary: 'Login Failed',
                detail: 'There was an error during login.',
                life: 3000,
            });

            console.error("The login wasn't successful: ", error);
        }
    };

    if (isLoading) {
        return null; // nebo třeba <div>Načítání...</div> pokud chceš loader
    }

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            {!logged && (
                <div className="card flex justify-content-center">
                    <FloatLabel className="p-float-label">
                        <label htmlFor="username" className='user'>Username</label>
                        <InputText
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </FloatLabel>

                    <FloatLabel className="p-float-label">
                        <label htmlFor="password" className='pass'>Password</label>
                        <InputText
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FloatLabel>

                    <button onClick={handleSubmit}>Login</button>
                </div>
            )}
        </div>
    );
};

export default LoginForm;
