import React from 'react';
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
  Tooltip
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Visibility
} from '@mui/icons-material';

const ScheduledAssignmentsList = ({
  filteredAssignments,
  teachers,
  theme,
  getStatusLabel,
  getStatusColor,
  formatDate,
  formatDateWithTime,
  onEdit,
  onDelete,
  onView
}) => {
  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t._id === teacherId);
    return teacher ? `${teacher.nombre} ${teacher.apellidoPaterno} ${teacher.apellidoMaterno}` : 'Docente no encontrado';
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                Título
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                Descripción
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                Docente Asignado
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                Estado
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                Fecha de Entrega
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                Fecha de Cierre
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.map((assignment) => (
              <TableRow key={assignment._id} hover>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {assignment.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: '0.85rem',
                      maxWidth: '300px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {assignment.description || 'Sin descripción'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {assignment.assignedTo && assignment.assignedTo.length > 0 ? 
                      `${assignment.assignedTo[0].nombre} ${assignment.assignedTo[0].apellidoPaterno} ${assignment.assignedTo[0].apellidoMaterno}` :
                      'Sin asignar'
                    }
                  </Typography>
                  {assignment.assignedTo && assignment.assignedTo.length > 1 && (
                    <Typography variant="caption" color="text.secondary">
                      +{assignment.assignedTo.length - 1} más
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(assignment.status, assignment.dueDate, assignment.closeDate)}
                    color={getStatusColor(assignment.status, assignment.dueDate, assignment.closeDate)}
                    size="small"
                    sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDateWithTime(assignment.dueDate)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDateWithTime(assignment.closeDate)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="Ver detalles">
                      <IconButton size="small" color="primary" onClick={() => onView(assignment)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" color="info" onClick={() => onEdit(assignment)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => onDelete(assignment._id)}>
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

      {filteredAssignments.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 6,
          backgroundColor: theme.palette.grey[50],
          borderRadius: 2,
          mt: 2
        }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No hay asignaciones programadas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Las asignaciones aparecerán aquí una vez que sean creadas
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ScheduledAssignmentsList;
