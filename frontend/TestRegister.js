import React, { useState } from 'react';
import axios from 'axios';

export const TestRegister = () => {
  const [result, setResult] = useState('');

  const testRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Test User',
        email: 'test' + Date.now() + '@test.com',
        password: '123456'
      });
      
      console.log('Success:', response.data);
      setResult('SUCCESS! Check console. Token: ' + (response.data.data.token ? 'YES' : 'NO'));
      
      // Save token
      localStorage.setItem('token', response.data.data.token);
      
    } catch (error) {
      console.error('Error:', error);
      setResult('ERROR: ' + error.message);
    }
  };

  return (
    <div style={{ padding: 50, textAlign: 'center' }}>
      <h1>Test Registration</h1>
      <button 
        onClick={testRegister}
        style={{ 
          padding: '20px 40px', 
          fontSize: 20, 
          background: '#0d9488', 
          color: 'white',
          border: 'none',
          borderRadius: 10,
          cursor: 'pointer'
        }}
      >
        TEST REGISTER
      </button>
      <p style={{ marginTop: 20, fontSize: 18 }}>{result}</p>
    </div>
  );
};