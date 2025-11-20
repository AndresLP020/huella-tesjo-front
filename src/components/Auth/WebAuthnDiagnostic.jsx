import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  BugReport,
  CheckCircle,
  Error,
  ExpandMore,
  Computer,
  Usb,
  Fingerprint
} from '@mui/icons-material';
import WebAuthnService from '../../services/webauthnService';

const WebAuthnDiagnostic = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [error, setError] = useState('');

  const runDiagnostic = async () => {
    setLoading(true);
    setError('');
    setDiagnosticResult(null);

    try {
      const result = await WebAuthnService.runDiagnostic();
      setDiagnosticResult(result);
      console.log('📊 Resultado diagnóstico:', result);
    } catch (err) {
      setError(err.message || 'Error ejecutando diagnóstico');
      console.error('❌ Error diagnóstico:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAuthenticatorTypeInfo = (type) => {
    const info = {
      platform: {
        icon: <Computer />,
        name: 'Plataforma (Windows Hello)',
        description: 'Autenticador integrado del sistema operativo'
      },
      'cross-platform': {
        icon: <Usb />,
        name: 'Externo (USB/Bluetooth)',
        description: 'Autenticadores físicos externos'
      },
      any: {
        icon: <Fingerprint />,
        name: 'Cualquiera',
        description: 'Permite ambos tipos de autenticadores'
      }
    };
    return info[type] || info.any;
  };

  const getRecommendation = (diagnostics) => {
    if (!diagnostics) return '';

    if (diagnostics.platform?.canGenerate && !diagnostics['cross-platform']?.canGenerate) {
      return '⚠️ PROBLEMA DETECTADO: Solo funciona autenticador de plataforma. Windows Hello está vinculado a un usuario específico del sistema. Para múltiples usuarios de la app, necesitas usar autenticadores externos.';
    }

    if (!diagnostics.platform?.canGenerate && diagnostics['cross-platform']?.canGenerate) {
      return '✅ RECOMENDACIÓN: Usa autenticadores externos (USB, Bluetooth) para mejor compatibilidad multi-usuario.';
    }

    if (diagnostics.platform?.canGenerate && diagnostics['cross-platform']?.canGenerate) {
      return '✅ ÓPTIMO: Tu dispositivo soporta ambos tipos. Recomendamos usar "cross-platform" para múltiples usuarios.';
    }

    return '❌ PROBLEMA: Ningún tipo de autenticador está disponible.';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <BugReport />
          Diagnóstico de Autenticadores Biométricos
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Este diagnóstico te ayudará a entender por qué otros usuarios no pueden registrar sus huellas en tu dispositivo.
        </Typography>

        {!diagnosticResult && !loading && (
          <Button 
            variant="contained" 
            onClick={runDiagnostic}
            startIcon={<BugReport />}
            fullWidth
            sx={{ mb: 2 }}
          >
            Ejecutar Diagnóstico
          </Button>
        )}

        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" p={3}>
            <CircularProgress />
            <Typography ml={2}>Ejecutando diagnóstico...</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {diagnosticResult && (
          <Box>
            <Alert 
              severity={
                diagnosticResult.diagnostics?.['cross-platform']?.canGenerate ? 'success' : 'warning'
              }
              sx={{ mb: 2 }}
            >
              {getRecommendation(diagnosticResult.diagnostics)}
            </Alert>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Información del Usuario</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Email" 
                      secondary={diagnosticResult.user?.email} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Dispositivos Registrados" 
                      secondary={`${diagnosticResult.user?.totalAuthenticators || 0} dispositivos`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Biometría Habilitada" 
                      secondary={
                        <Chip 
                          label={diagnosticResult.user?.biometricEnabled ? 'Sí' : 'No'}
                          color={diagnosticResult.user?.biometricEnabled ? 'success' : 'default'}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Tipos de Autenticadores</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {Object.entries(diagnosticResult.diagnostics || {}).map(([type, result]) => {
                    const typeInfo = getAuthenticatorTypeInfo(type);
                    return (
                      <ListItem key={type}>
                        <ListItemIcon>
                          {typeInfo.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              {typeInfo.name}
                              {result.canGenerate ? (
                                <CheckCircle color="success" fontSize="small" />
                              ) : (
                                <Error color="error" fontSize="small" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {typeInfo.description}
                              </Typography>
                              {result.error && (
                                <Typography variant="caption" color="error">
                                  Error: {result.error}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Recomendaciones</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {diagnosticResult.recommendations?.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={`${index + 1}. ${rec}`}
                      />
                    </ListItem>
                  ))}
                  <ListItem>
                    <ListItemText 
                      primary="4. Para múltiples usuarios en el mismo dispositivo físico, desactiva Windows Hello o usa autenticadores USB externos."
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cerrar
        </Button>
        {diagnosticResult && (
          <Button 
            onClick={runDiagnostic}
            disabled={loading}
            startIcon={<Fingerprint />}
          >
            Volver a Ejecutar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WebAuthnDiagnostic;