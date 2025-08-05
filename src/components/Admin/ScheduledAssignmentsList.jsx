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
  handleViewDetails,
  handleEditAssignment,
  handleDeleteAssignment
}) => {
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
    <Box>
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
                      onClick={() => handleViewDetails(assignment)}
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
    </Box>
  );
};

export default ScheduledAssignmentsList;
