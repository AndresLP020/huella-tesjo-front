import React from 'react';

const TestComponent = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ color: '#333' }}>🎉 React está funcionando!</h1>
      <p style={{ color: '#666' }}>Si ves esto, el frontend está cargando correctamente.</p>
      <div style={{ 
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#e8f5e8',
        borderRadius: '5px',
        border: '1px solid #4caf50'
      }}>
        <p>✅ Fecha actual: {new Date().toLocaleString()}</p>
        <p>✅ Puerto: 5174</p>
        <p>✅ Estado: Funcionando</p>
      </div>
    </div>
  );
};

export default TestComponent;
