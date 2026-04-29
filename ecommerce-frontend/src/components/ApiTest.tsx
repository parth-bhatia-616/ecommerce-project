import React, { useState } from 'react';
import { authAPI } from '../services/api';

const ApiTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testRegister = async () => {
    setLoading(true);
    setResult('Testing register...');
    
    try {
      const response = await authAPI.register({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'Test123!',
        confirmPassword: 'Test123!'
      });
      
      setResult(`SUCCESS: ${JSON.stringify(response, null, 2)}`);
    } catch (error: any) {
      setResult(`ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing login...');
    
    try {
      const response = await authAPI.login({
        email: 'admin@vertex.com',
        password: 'Admin123!'
      });
      
      setResult(`SUCCESS: ${JSON.stringify(response, null, 2)}`);
    } catch (error: any) {
      setResult(`ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: 'white', margin: '20px', borderRadius: '8px' }}>
      <h2>API Test</h2>
      <button onClick={testRegister} disabled={loading} style={{ marginRight: '10px' }}>
        Test Register
      </button>
      <button onClick={testLogin} disabled={loading} style={{ marginRight: '10px' }}>
        Test Login
      </button>
      <button onClick={() => setResult('')}>
        Clear
      </button>
      
      {loading && <p>Loading...</p>}
      
      {result && (
        <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px', borderRadius: '4px' }}>
          {result}
        </pre>
      )}
    </div>
  );
};

export default ApiTest;
