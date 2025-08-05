import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
    Alert
} from '@mui/material';
import { Close as CloseIcon, Assignment } from '@mui/icons-material';

const AsignationSimple = ({ open, onClose }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('Asignación creada exitosamente (simulación)');
            onClose();
        }, 1000);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                }
            }}
        >
            <DialogTitle sx={{ 
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assignment />
                    <Typography variant="h6">
                        Nueva Asignación
                    </Typography>
                </Box>
                <IconButton 
                    onClick={onClose}
                    sx={{ color: 'white' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Assignment sx={{ fontSize: 64, color: '#1976d2', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Crear Nueva Asignación
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Herramienta para crear y gestionar asignaciones para docentes.
                    </Typography>
                    
                    <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="body2">
                            🚧 <strong>En desarrollo:</strong> Formulario completo de asignaciones próximamente
                        </Typography>
                    </Alert>
                    
                    <Box sx={{ 
                        p: 2, 
                        bgcolor: '#e3f2fd', 
                        borderRadius: 2,
                        border: '1px solid #bbdefb'
                    }}>
                        <Typography variant="body2">
                            <strong>Funcionalidades incluidas:</strong>
                            <br />• Asignación a múltiples docentes
                            <br />• Fechas de entrega personalizables
                            <br />• Adjuntos y recursos
                            <br />• Notificaciones automáticas
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
                <Button 
                    onClick={onClose} 
                    variant="outlined"
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                        }
                    }}
                >
                    {loading ? 'Creando...' : 'Crear Asignación (Demo)'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AsignationSimple;
