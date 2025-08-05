import React, { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography, 
  Chip, 
  Box, 
  IconButton, 
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Avatar,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Visibility, 
  Close,
  CheckCircle,
  AccessTime,
  Cancel,
  Person,
  Assignment,
  Save
} from '@mui/icons-material';


const ScheduledAssignmentsList = ({
  filteredAssignments,
  teachers,
  theme,
  getStatusLabel,
  getStatusColor,
  formatDate,
  handleViewDetails,
  handleEditAssignment,
  handleDeleteAssignment
}) => {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [teacherSubmissions, setTeacherSubmissions] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  // Simulamos los datos de entregas de docentes
  const generateTeacherSubmissions = (assignment) => {
    return teachers.map((teacher, index) => ({
      id: teacher._id || `teacher-${index}`,
      name: teacher.name || teacher.fullName || `Docente ${index + 1}`,
      email: teacher.email || `docente${index + 1}@tesjo.edu.mx`,
      status: 'pending', // pending, completed, late, not_delivered
      submissionDate: null,
      notes: ''
    }));
  };

  const handleOpenDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setTeacherSubmissions(generateTeacherSubmissions(assignment));
    setSelectedTeachers([]);
    setShowDetailsDialog(true);
  };

  const handleStatusChange = (teacherId, newStatus) => {
    setTeacherSubmissions(prev => 
      prev.map(submission => 
        submission.id === teacherId 
          ? { ...submission, status: newStatus, submissionDate: newStatus !== 'pending' ? new Date().toISOString() : null }
          : submission
      )
    );
  };

  const handleSelectTeacher = (teacherId) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeachers.length === teacherSubmissions.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(teacherSubmissions.map(t => t.id));
    }
  };

  const handleMarkAsCompleted = () => {
    selectedTeachers.forEach(teacherId => {
      handleStatusChange(teacherId, 'completed');
    });
    setSelectedTeachers([]);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle sx={{ color: theme.palette.success.main }} />;
      case 'late': return <AccessTime sx={{ color: theme.palette.warning.main }} />;
      case 'not_delivered': return <Cancel sx={{ color: theme.palette.error.main }} />;
      default: return <Assignment sx={{ color: theme.palette.grey[500] }} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Entregado';
      case 'late': return 'Entregado Tarde';
      case 'not_delivered': return 'No Entregado';
      default: return 'Pendiente';
    }
  };

  const getSubmissionStatusColor = (status) => {
    switch (status) {
      case 'completed': return theme.palette.success.main;
      case 'late': return theme.palette.warning.main;
      case 'not_delivered': return theme.palette.error.main;
      default: return theme.palette.warning.main;
    }
  };

  console.log('Asignaciones recibidas:', filteredAssignments);
  if (!Array.isArray(filteredAssignments) || filteredAssignments.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="text.secondary">
          No hay asignaciones programadas para mostrar.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                Título
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                Estado
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                Fecha de Publicación
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                Fecha de Entrega
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                Docentes
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredAssignments.map((assignment, index) => (
            <TableRow 
              key={assignment._id || index}
              hover
              sx={{
                '&:nth-of-type(odd)': {
                  backgroundColor: theme.palette.action.hover,
                },
                '&:hover': {
                  backgroundColor: theme.palette.primary.light + '20',
                },
                transition: 'background-color 0.2s ease'
              }}
            >
              <TableCell>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {assignment.title || 'Sin título'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      maxWidth: '300px'
                    }}
                  >
                    {assignment.description || 'Sin descripción disponible'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(assignment.status)}
                  color={getStatusColor(assignment.status)}
                  size="small"
                  sx={{ 
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem'
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {assignment.publishDate ? formatDate(assignment.publishDate) : 'Sin fecha'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {assignment.dueDate ? formatDate(assignment.dueDate) : 'Sin fecha'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {teachers.length} docentes
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Tooltip title="Ver detalles">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDetails(assignment)}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => handleEditAssignment(assignment)}
                      sx={{
                        backgroundColor: theme.palette.info.main,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: theme.palette.info.dark,
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteAssignment(assignment)}
                      sx={{
                        backgroundColor: theme.palette.error.main,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: theme.palette.error.dark,
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

      {/* Diálogo de Control de Asignaciones */}
      <Dialog
      open={showDetailsDialog}
      onClose={() => setShowDetailsDialog(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        py: 2,
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Person sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Control de Asignaciones
          </Typography>
        </Box>
        <IconButton 
          onClick={() => setShowDetailsDialog(false)}
          sx={{ color: 'white' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {selectedAssignment && (
          <Box>
            {/* Detalles de la Asignación */}
            <Box sx={{ 
              p: 3, 
              backgroundColor: theme.palette.grey[50],
              borderBottom: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 'bold' }}>
                {selectedAssignment.title}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Descripción:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedAssignment.description || 'Sin descripción'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Fechas importantes:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    📅 Publicación: {selectedAssignment.publishDate ? formatDate(selectedAssignment.publishDate) : 'Sin fecha'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    📋 Entrega: {selectedAssignment.dueDate ? formatDate(selectedAssignment.dueDate) : 'Sin fecha'}
                  </Typography>
                  <Typography variant="body2">
                    🔚 Cierre: {selectedAssignment.closeDate ? formatDate(selectedAssignment.closeDate) : 'Sin fecha'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Control de Entregas */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                Selecciona los docentes a marcar como completado:
              </Typography>

              {/* Botones de Control */}
              <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleSelectAll}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  {selectedTeachers.length === teacherSubmissions.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                </Button>
                
                {selectedTeachers.length > 0 && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleMarkAsCompleted}
                    startIcon={<CheckCircle />}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Marcar como Completado ({selectedTeachers.length})
                  </Button>
                )}
              </Box>

              {/* Lista de Docentes */}
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                {/* Encabezado */}
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: theme.palette.grey[100],
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={1}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        👤
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        Docente
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        Email
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        Estado
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        Acciones
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        Seleccionar
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Lista de Docentes */}
                <CardContent sx={{ p: 0 }}>
                  {teacherSubmissions.map((submission, index) => (
                    <Box key={submission.id}>
                      <Box sx={{ p: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={1}>
                            <Avatar sx={{ 
                              bgcolor: theme.palette.primary.main,
                              width: 40,
                              height: 40
                            }}>
                              <Person />
                            </Avatar>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {submission.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="text.secondary">
                              {submission.email}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Chip
                              icon={getStatusIcon(submission.status)}
                              label={getStatusText(submission.status)}
                              size="small"
                              sx={{
                                backgroundColor: `${getSubmissionStatusColor(submission.status)}20`,
                                color: getSubmissionStatusColor(submission.status),
                                border: `1px solid ${getSubmissionStatusColor(submission.status)}40`,
                                fontWeight: 'bold'
                              }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <FormControl size="small" fullWidth>
                              <Select
                                value={submission.status}
                                onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                                sx={{ fontSize: '0.875rem' }}
                              >
                                <MenuItem value="pending">⏳ Pendiente</MenuItem>
                                <MenuItem value="completed">✅ Entregado</MenuItem>
                                <MenuItem value="late">⚠️ Entregado Tarde</MenuItem>
                                <MenuItem value="not_delivered">❌ No Entregado</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={1}>
                            <input
                              type="checkbox"
                              checked={selectedTeachers.includes(submission.id)}
                              onChange={() => handleSelectTeacher(submission.id)}
                              style={{ transform: 'scale(1.2)' }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                      {index < teacherSubmissions.length - 1 && <Divider />}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.grey[50],
        justifyContent: 'space-between'
      }}>
        <Typography variant="body2" color="text.secondary">
          Total de docentes: {teacherSubmissions.length} | 
          Completados: {teacherSubmissions.filter(t => t.status === 'completed').length} |
          Pendientes: {teacherSubmissions.filter(t => t.status === 'pending').length}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Guardar Cambios
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowDetailsDialog(false)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Cerrar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default ScheduledAssignmentsList;
