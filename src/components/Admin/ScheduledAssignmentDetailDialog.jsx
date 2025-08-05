import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Chip, Paper, Grid, 
  IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, Select, MenuItem, FormControl, Checkbox, Divider
} from '@mui/material';
import { Close, Edit, CalendarToday, Person, CheckCircle, Warning, Schedule } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { updateTeacherAssignmentStatus } from '../../services/assignmentService';

function ScheduledAssignmentDetailDialog(props) {
  const {
    open,
    onClose,
    assignment,
    getStatusLabel,
    getStatusColor,
    formatDate,
    teachers = [],
    theme: themeProp
  } = props;
  
  const themeFromHook = useTheme();
  // Usamos el tema proporcionado o el hook de useTheme
  const theme = themeProp || themeFromHook;
  
  // Estado para manejar las entregas de los docentes
  const [teacherSubmissions, setTeacherSubmissions] = useState(() => {
    // Inicializamos con datos mock para demostración
    const mockSubmissions = {};
    teachers.forEach((teacher, index) => {
      mockSubmissions[teacher._id || `teacher${index}`] = {
        id: teacher._id || `teacher${index}`,
        name: teacher.name || `Docente ${index + 1}`,
        email: teacher.email || `docente${index + 1}@example.com`,
        status: index % 3 === 0 ? 'entregado' : index % 3 === 1 ? 'pendiente' : 'no_entregado',
        selected: false
      };
    });
    
    // Si no hay teachers del prop, usamos datos de ejemplo
    if (teachers.length === 0) {
      return {
        teacher1: {
          id: 'teacher1',
          name: 'ANDRES LOPEZ PIÑA',
          email: 'andreslopezpina187@gmail.com',
          status: 'pendiente',
          selected: false
        },
        teacher2: {
          id: 'teacher2',
          name: 'aaron estrada martinez',
          email: '1234567890@tesjo.edu.mx',
          status: 'pendiente',
          selected: false
        },
        teacher3: {
          id: 'teacher3',
          name: 'Aaron Estrada Martinez',
          email: '202215048029@tesjo.edu.mx',
          status: 'pendiente',
          selected: false
        },
        teacher4: {
          id: 'teacher4',
          name: 'Andy Lop Pi',
          email: '1234567890987@tesjo.edu.mx',
          status: 'pendiente',
          selected: false
        },
        teacher5: {
          id: 'teacher5',
          name: 'Elizabeth González González',
          email: '202215048034@tesjo.edu.mx',
          status: 'pendiente',
          selected: false
        }
      };
    }
    
    return mockSubmissions;
  });
  
  // Estado para manejar loading de cambios
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const safeGetStatusLabel = getStatusLabel || ((status) => status || 'Sin estado');
  const safeGetStatusColor = getStatusColor || (() => 'default');
  const safeFormatDate = formatDate || ((dateString) => {
    try {
      if (!dateString || dateString === 'Invalid Date') return 'Fecha no disponible';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formateando fecha:', e);
      return 'Fecha inválida';
    }
  });
  
  const selectedAssignment = assignment;

  // Funciones para manejar los estados de los docentes
  const handleStatusChange = async (teacherId, newStatus) => {
    if (!assignment || !assignment._id) {
      console.error('❌ No se puede actualizar: assignment no válido');
      setError('Error: Asignación no válida');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Actualizando estado del docente:', {
        assignmentId: assignment._id,
        teacherId,
        newStatus
      });

      // Llamar al backend para actualizar el estado
      const response = await updateTeacherAssignmentStatus(assignment._id, teacherId, newStatus);
      
      if (response.success) {
        // Actualizar el estado local solo si la llamada al backend fue exitosa
        setTeacherSubmissions(prev => ({
          ...prev,
          [teacherId]: {
            ...prev[teacherId],
            status: newStatus
          }
        }));
        
        console.log('✅ Estado actualizado exitosamente en el backend');
      } else {
        throw new Error(response.error || 'No se pudo actualizar el estado');
      }
    } catch (error) {
      console.error('❌ Error actualizando estado del docente:', error);
      setError(`Error actualizando estado: ${error.message || 'Error desconocido'}`);
      
      // Revertir el cambio local si hubo error
      // No hacer nada aquí porque el estado local no se cambió hasta que el backend confirmó
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeacher = (teacherId) => {
    setTeacherSubmissions(prev => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        selected: !prev[teacherId].selected
      }
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(teacherSubmissions).every(teacher => teacher.selected);
    setTeacherSubmissions(prev => {
      const updated = {};
      Object.keys(prev).forEach(teacherId => {
        updated[teacherId] = {
          ...prev[teacherId],
          selected: !allSelected
        };
      });
      return updated;
    });
  };

  const handleMarkSelectedAsCompleted = () => {
    const selectedTeachers = Object.keys(teacherSubmissions).filter(
      teacherId => teacherSubmissions[teacherId].selected
    );
    
    setTeacherSubmissions(prev => {
      const updated = { ...prev };
      selectedTeachers.forEach(teacherId => {
        updated[teacherId] = {
          ...updated[teacherId],
          status: 'entregado',
          selected: false
        };
      });
      return updated;
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          minHeight: '80vh'
        }
      }}
    >
      {selectedAssignment && (
        <>
          <DialogTitle sx={{ 
            py: 3,
            px: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Person sx={{ fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Control de Asignaciones
              </Typography>
            </Box>
            <IconButton 
              onClick={onClose}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 4 }}>
            {/* Mensaje de error */}
            {error && (
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={error} 
                  color="error" 
                  variant="filled"
                  sx={{ 
                    width: '100%',
                    height: 'auto',
                    '& .MuiChip-label': {
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      py: 1
                    }
                  }}
                />
              </Box>
            )}
            
            {/* Información de la asignación */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
                {selectedAssignment.title}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Chip
                  label={safeGetStatusLabel(selectedAssignment.status)}
                  color={safeGetStatusColor(selectedAssignment.status)}
                  sx={{ 
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontSize: '0.9rem',
                    px: 2,
                    py: 1
                  }}
                />
              </Box>

              <Typography variant="body1" paragraph sx={{ 
                mb: 3,
                lineHeight: 1.8,
                fontSize: '1.1rem'
              }}>
                {selectedAssignment.description}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CalendarToday sx={{ color: theme.palette.primary.main }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Fecha de Entrega:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedAssignment.dueDate ? safeFormatDate(selectedAssignment.dueDate) : 'Sin fecha de entrega'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Schedule sx={{ color: theme.palette.warning.main }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Fecha de Cierre:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedAssignment.publishDate ? safeFormatDate(selectedAssignment.publishDate) : 'Sin fecha de cierre'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Control de docentes */}
            <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ 
                p: 3, 
                background: `linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.info.main} 100%)`,
                color: 'white'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Selecciona los docentes a marcar como completado:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={handleSelectAll}
                    sx={{ 
                      color: 'white', 
                      borderColor: 'white',
                      '&:hover': { 
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'white'
                      }
                    }}
                  >
                    ✓ SELECCIONAR TODOS
                  </Button>
                  <Button
                    variant="text"
                    sx={{ 
                      color: 'white',
                      textDecoration: 'underline',
                      '&:hover': { 
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    VOLVER
                  </Button>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                      <TableCell sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person /> Docente
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Seleccionar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.values(teacherSubmissions).map((teacher) => (
                      <TableRow key={teacher.id} sx={{ '&:hover': { backgroundColor: theme.palette.grey[50] } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ backgroundColor: theme.palette.warning.main }}>
                              <Person />
                            </Avatar>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {teacher.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {teacher.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 160 }}>
                            <Select
                              value={teacher.status}
                              onChange={(e) => handleStatusChange(teacher.id, e.target.value)}
                              disabled={loading}
                              sx={{ 
                                borderRadius: 2,
                                opacity: loading ? 0.6 : 1
                              }}
                            >
                              <MenuItem value="pendiente">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Schedule sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                                  Pendiente
                                </Box>
                              </MenuItem>
                              <MenuItem value="entregado">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CheckCircle sx={{ fontSize: 16, color: theme.palette.success.main }} />
                                  Entregado
                                </Box>
                              </MenuItem>
                              <MenuItem value="entregado_tardio">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Warning sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                                  Entregado con Retraso
                                </Box>
                              </MenuItem>
                              <MenuItem value="no_entregado">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Close sx={{ fontSize: 16, color: theme.palette.error.main }} />
                                  No Entregado
                                </Box>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={teacher.selected}
                            onChange={() => handleSelectTeacher(teacher.id)}
                            color="primary"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </DialogContent>

          <DialogActions sx={{ px: 4, py: 3, justifyContent: 'space-between', backgroundColor: theme.palette.grey[50] }}>
            <Button 
              variant="contained"
              color="success"
              onClick={handleMarkSelectedAsCompleted}
              disabled={!Object.values(teacherSubmissions).some(teacher => teacher.selected)}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontWeight: 'bold'
              }}
              startIcon={<CheckCircle />}
            >
              ✓ MARCAR COMO COMPLETADO
            </Button>
            <Button 
              onClick={onClose}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5
              }}
            >
              CERRAR
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default ScheduledAssignmentDetailDialog;
