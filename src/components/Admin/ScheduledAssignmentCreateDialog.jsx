import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, IconButton, Button, 
  TextField, CircularProgress, FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput,
  FormControlLabel, Switch, Divider
} from '@mui/material';
import { Close, Save, Person, Groups } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const ScheduledAssignmentCreateDialog = ({
  open,
  onClose,
  newAssignment = {},
  handleInputChange = () => {},
  handleCreateAssignment = () => {},
  isCreating = false,
  teachers = [],
  selectedTeachers = [],
  handleTeachersChange = () => {},
  sendToAll = false,
  handleSendToAllChange = () => {},
  theme: themeProp
}) => {
  const themeFromHook = useTheme();
  const theme = themeProp || themeFromHook;
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        }
      }}
    >
      <DialogTitle sx={{ 
        py: 3,
        px: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          ✨ Crear Nueva Asignación Programada
        </Typography>
        <IconButton 
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Título de la Asignación"
            name="title"
            value={newAssignment.title || ''}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            id="description"
            label="Descripción Detallada"
            name="description"
            value={newAssignment.description || ''}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="publishDate"
            label="Fecha de Publicación"
            name="publishDate"
            type="datetime-local"
            value={newAssignment.publishDate || ''}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 3 }}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="dueDate"
            label="Fecha de Entrega"
            name="dueDate"
            type="datetime-local"
            value={newAssignment.dueDate || ''}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 3 }}
          />

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
              Asignación de Docentes
            </Typography>
          </Divider>

          {/* Switch para enviar a todos los docentes */}
          <FormControlLabel
            control={
              <Switch
                checked={sendToAll}
                onChange={handleSendToAllChange}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Groups />
                <Typography>Enviar a todos los docentes</Typography>
              </Box>
            }
            sx={{ mb: 3 }}
          />

          {/* Selector de docentes específicos (solo si no se envía a todos) */}
          {!sendToAll && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="teachers-select-label">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person />
                  Seleccionar Docentes
                </Box>
              </InputLabel>
              <Select
                labelId="teachers-select-label"
                id="teachers-select"
                multiple
                value={selectedTeachers}
                onChange={handleTeachersChange}
                input={<OutlinedInput label="Seleccionar Docentes" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((teacherId) => {
                      const teacher = teachers.find(t => t._id === teacherId);
                      return (
                        <Chip 
                          key={teacherId} 
                          label={teacher ? `${teacher.nombre} ${teacher.apellidoPaterno}` : teacherId}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher._id} value={teacher._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" />
                      <Typography>
                        {teacher.nombre} {teacher.apellidoPaterno} {teacher.apellidoMaterno}
                      </Typography>
                      {teacher.email && (
                        <Typography variant="caption" color="text.secondary">
                          ({teacher.email})
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {!sendToAll && selectedTeachers.length === 0 && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  Por favor selecciona al menos un docente o activa "Enviar a todos"
                </Typography>
              )}
            </FormControl>
          )}

          {/* Información de docentes seleccionados */}
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            backgroundColor: theme.palette.grey[50],
            border: `1px solid ${theme.palette.grey[200]}`
          }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              📋 Resumen de asignación:
            </Typography>
            {sendToAll ? (
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Groups color="primary" />
                Se enviará a <strong>todos los docentes</strong> ({teachers.length} docentes)
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                Se enviará a <strong>{selectedTeachers.length}</strong> docente(s) seleccionado(s)
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 4, py: 3, justifyContent: 'space-between' }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          🚪 Cancelar
        </Button>
        <Button 
          onClick={handleCreateAssignment}
          variant="contained"
          startIcon={isCreating ? <CircularProgress size={18} color="inherit" /> : <Save />}
          disabled={
            isCreating || 
            !newAssignment.title || 
            !newAssignment.description || 
            !newAssignment.publishDate ||
            (!sendToAll && selectedTeachers.length === 0)
          }
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          {isCreating ? '⏳ Creando...' : '💾 Crear Asignación'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduledAssignmentCreateDialog;
