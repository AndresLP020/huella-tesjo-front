import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Sistema de Seguimiento de Docentes
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Bienvenido al sistema de gestión y seguimiento de actividades docentes
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            onClick={() => navigate('/register')}
          >
            Registrarse
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;
