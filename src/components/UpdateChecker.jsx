import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import React, { useState, useEffect } from 'react';

const UpdateChecker = () => {

    const [checkingUpdate, setCheckingUpdate] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
    const [showProgressBar, setShowProgressBar] = useState(false);


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
            setTimeout(() => setShowProgressBar(false), 3000);
          }
        };
    
        runUpdateCheck();
      }, []);
    
      return (
        <>
          {updateMessage && <p>{updateMessage}</p>}
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
              <style>{`
                @keyframes progressAnim {
                  0% { transform: translateX(-100%); }
                  50% { transform: translateX(-50%); }
                  100% { transform: translateX(0); }
                }
              `}</style>
            </div>
          )}
        </>
      );
    };











export default UpdateChecker;