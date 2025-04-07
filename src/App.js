import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

function App() {
  const [username, setUsername] = useState('');
  const [salt, setSalt] = useState('');
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [showProgressBar, setShowProgressBar] = useState(false);

  const handleSubmit = async () => {
    try {
      const result = await invoke('get_salt', { username });
      setSalt(result);
      localStorage.setItem('salt', result);
    } catch (error) {
      console.error('Error fetching salt:', error);
    }
  };

  useEffect(() => {
    const runUpdateCheck = async () => {
      try {
        setCheckingUpdate(true);
        setShowProgressBar(true);
        const update = await check();
        if (update && update.shouldUpdate) {
          setUpdateMessage(`Dostupná nová verze: ${update.manifest?.version}, stahuji...`);
          await update.downloadAndInstall();
          await relaunch();
        } else {
          setUpdateMessage('Aplikace je aktuální.');
        }
      } catch (e) {
        console.error('Chyba při kontrole aktualizace:', e);
        setUpdateMessage('Nepodařilo se zkontrolovat aktualizace.');
      } finally {
        setCheckingUpdate(false);
        setTimeout(() => setShowProgressBar(false), 3000); // schovej po 3s
      }
    };

    runUpdateCheck();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
      />
      <button onClick={handleSubmit}>Get Salt</button>
      <div>{salt && `Salt: ${salt}`}</div>

      {/* Update message (volitelné) */}
      {updateMessage && <p style={{ marginTop: 10 }}>{updateMessage}</p>}

      {/* Progress bar vpravo dole */}
      {showProgressBar && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 200,
          height: 8,
          backgroundColor: '#eee',
          borderRadius: 5,
          overflow: 'hidden',
          boxShadow: '0 0 5px rgba(0,0,0,0.3)',
        }}>
          <div style={{
            width: checkingUpdate ? '100%' : '0%',
            height: '100%',
            backgroundColor: '#4caf50',
            animation: 'progressAnim 2s infinite'
          }} />
        </div>
      )}

      {/* Animace pro progress bar */}
      <style>
        {`
          @keyframes progressAnim {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
