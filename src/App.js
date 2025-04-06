import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';


function App() {
  const [username, setUsername] = useState('');
  const [salt, setSalt] = useState('');
  
  const handleSubmit = async () => {
    try {
      // Ensure invoke is called when Tauri is available
      
        const result = await invoke('get_salt', { username });
        setSalt(result); // Set the salt from the result
        localStorage.setItem('salt', result);
      
    } catch (error) {
      console.error('Error fetching salt:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
      />
      <button onClick={handleSubmit}>Get Salt</button>
      <div>{salt && `Salt: ${salt}`}</div>
    </div>
  );
}

export default App;
