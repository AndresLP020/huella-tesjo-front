import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    IconButton,
    Button,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Chip,
    Grid,
    TextField,
    Fab,
    Tooltip,
    Paper,
    Divider,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { 
    Close, 
    Schedule, 
    Add, 
    Edit, 
    Delete,
    CalendarToday,
    Person,
    Description,
    Refresh,
    Search,
    Visibility,
    Save,
    Cancel
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    getScheduledAssignments,
    scheduleAssignment
} from '../../services/assignmentService';
import ScheduledAssignmentsList from './ScheduledAssignments                </motion.div>
            </Dialog>

            {/* Dialog de confirmación de eliminación */}
            <Dialog
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: theme.shadows[10]
                    }
                }}
            >
                <DialogTitle sx={{ 
                    py: 2,
                    px: 3,
                    background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Confirmar Eliminación
                    </Typography>
                    <IconButton 
                        onClick={() => setShowDeleteDialog(false)}
                        sx={{ color: 'white' }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        ¿Estás seguro de que quieres eliminar la siguiente asignación?
                    </Typography>
                    {assignmentToDelete && (
                        <Box sx={{ 
                            p: 2, 
                            backgroundColor: theme.palette.grey[100], 
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.error.light}`
                        }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.error.dark }}>
                                {assignmentToDelete.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {assignmentToDelete.description}
                            </Typography>
                        </Box>
                    )}
                    <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 'medium' }}>
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ 
                    p: 3,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    gap: 2,
                    justifyContent: 'flex-end'
                }}>
                    <Button
                        onClick={() => setShowDeleteDialog(false)}
                        variant="outlined"
                        sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem',
                            minWidth: '120px',
                            height: '48px',
                            px: 3
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={confirmDeleteAssignment}
                        variant="contained"
                        color="error"
                        sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem',
                            minWidth: '120px',
                            height: '48px',
                            px: 3,
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: theme.shadows[6]
                            }
                        }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>)t';

const ScheduledAssignmentsSimple = ({ open, onClose, teachers = [] }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [scheduledAssignments, setScheduledAssignments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        description: '',
        publishDate: '',
        dueDate: '',
        closeDate: '',
        status: 'scheduled'
    });

    useEffect(() => {
        if (open) {
            loadScheduledAssignments();
        }
    }, [open]);

    const loadScheduledAssignments = async () => {
        try {
            setLoading(true);
            setError('');
            setIsRefreshing(true);
            console.log('🔄 Cargando asignaciones programadas...');
            
            const response = await getScheduledAssignments();
            console.log('📥 Respuesta recibida:', response);
            
            if (response.success) {
                setScheduledAssignments(response.data?.assignments || []);
                console.log('✅ Asignaciones programadas cargadas:', response.data?.assignments?.length || 0);
            } else {
                throw new Error(response.error || 'Error desconocido');
            }
        } catch (error) {
            console.error('❌ Error cargando asignaciones programadas:', error);
            setError('Error cargando asignaciones programadas: ' + (error.message || 'Error desconocido'));
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        loadScheduledAssignments();
    };

    const handleViewDetails = (assignment) => {
        setSelectedAssignment(assignment);
        setShowDetailDialog(true);
    };

    const handleEditAssignment = (assignment) => {
        // Rellenar el formulario con los datos de la asignación
        setNewAssignment({
            title: assignment.title || '',
            description: assignment.description || '',
            publishDate: assignment.publishDate ? assignment.publishDate.slice(0, 16) : '',
            dueDate: assignment.dueDate ? assignment.dueDate.slice(0, 16) : '',
            closeDate: assignment.closeDate ? assignment.closeDate.slice(0, 16) : '',
            status: assignment.status || 'scheduled'
        });
        setSelectedAssignment(assignment);
        setShowCreateDialog(true);
    };

    const handleDeleteAssignment = (assignment) => {
        setAssignmentToDelete(assignment);
        setShowDeleteDialog(true);
    };

    const confirmDeleteAssignment = () => {
        if (assignmentToDelete) {
            // Eliminar de la lista local (simulación)
            const updatedAssignments = scheduledAssignments.filter(a => a._id !== assignmentToDelete._id);
            setScheduledAssignments(updatedAssignments);
            
            console.log('🗑️ Asignación eliminada:', assignmentToDelete.title);
            
            // Cerrar dialog y limpiar estado
            setShowDeleteDialog(false);
            setAssignmentToDelete(null);
        }
    };

    const handleCreateNew = () => {
        setSelectedAssignment(null);
        setNewAssignment({
            title: '',
            description: '',
            publishDate: '',
            dueDate: '',
            closeDate: '',
            status: 'scheduled'
        });
        setShowCreateDialog(true);
    };

    const handleCreateAssignment = async () => {
        try {
            setIsCreating(true);
            
            // Validar campos obligatorios
            if (!newAssignment.title || !newAssignment.description || !newAssignment.publishDate) {
                throw new Error('Título, descripción y fecha de publicación son obligatorios');
            }

            const isEditing = selectedAssignment && selectedAssignment._id;

            if (isEditing) {
                // Actualizar asignación existente (simulación local)
                const updatedAssignments = scheduledAssignments.map(assignment => 
                    assignment._id === selectedAssignment._id 
                        ? { 
                            ...assignment, 
                            ...newAssignment,
                            publishDate: newAssignment.publishDate + ':00.000Z',
                            dueDate: newAssignment.dueDate ? newAssignment.dueDate + ':00.000Z' : assignment.dueDate,
                            closeDate: newAssignment.closeDate ? newAssignment.closeDate + ':00.000Z' : assignment.closeDate
                        }
                        : assignment
                );
                setScheduledAssignments(updatedAssignments);
                console.log('✅ Asignación actualizada:', newAssignment.title);
            } else {
                // Crear nueva asignación (simulación local)
                const newId = 'temp_' + Date.now();
                const newAssignmentData = {
                    _id: newId,
                    ...newAssignment,
                    publishDate: newAssignment.publishDate + ':00.000Z',
                    dueDate: newAssignment.dueDate ? newAssignment.dueDate + ':00.000Z' : null,
                    closeDate: newAssignment.closeDate ? newAssignment.closeDate + ':00.000Z' : null,
                    assignedTeachers: []
                };
                setScheduledAssignments(prev => [newAssignmentData, ...prev]);
                console.log('✅ Nueva asignación creada:', newAssignment.title);
            }

            // Limpiar formulario y cerrar dialog
            setShowCreateDialog(false);
            setSelectedAssignment(null);
            setNewAssignment({
                title: '',
                description: '',
                publishDate: '',
                dueDate: '',
                closeDate: '',
                status: 'scheduled'
            });

        } catch (error) {
            console.error('❌ Error procesando asignación:', error);
            setError('Error procesando asignación: ' + error.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleInputChange = (field, value) => {
        setNewAssignment(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatDate = (dateString) => {
        try {
            if (!dateString || dateString === 'Invalid Date') return 'Fecha inválida';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Fecha inválida';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'draft': return 'warning';
            case 'scheduled': return 'info';
            case 'expired': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Activa';
            case 'draft': return 'Borrador';
            case 'scheduled': return 'Programada';
            case 'expired': return 'Expirada';
            default: return status || 'Sin estado';
        }
    };

    // Filtrar asignaciones según el término de búsqueda
    const filteredAssignments = scheduledAssignments.filter(assignment =>
        assignment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                        minHeight: '80vh',
                        boxShadow: theme.shadows[10]
                    }
                }}
            >
                <DialogTitle sx={{ 
                    py: 2,
                    px: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '12px 12px 0 0'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                    >
                        <Schedule sx={{ fontSize: 24 }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
                            Asignaciones Programadas
                        </Typography>
                    </motion.div>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Actualizar">
                            <IconButton 
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                sx={{ 
                                    color: 'white',
                                    '&:hover': { 
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        transform: 'scale(1.1)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                        <IconButton 
                            onClick={onClose}
                            sx={{ 
                                color: 'white',
                                '&:hover': { 
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    transform: 'scale(1.1)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ p: 2 }}>
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
                                    {error}
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Barra de búsqueda mejorada */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Paper 
                            elevation={2}
                            sx={{ 
                                p: 2, 
                                mb: 2, 
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                                border: `1px solid ${theme.palette.divider}`
                            }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={9}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Buscar asignaciones programadas por título o descripción..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: theme.palette.background.paper,
                                                height: '44px',
                                                fontSize: '0.9rem',
                                                '&:hover fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Paper 
                                        sx={{ 
                                            p: 1.5, 
                                            textAlign: 'center',
                                            borderRadius: 2,
                                            backgroundColor: theme.palette.primary.main,
                                            color: 'white',
                                            height: '44px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                            {filteredAssignments.length}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontSize: '0.7rem', lineHeight: 1 }}>
                                            de {scheduledAssignments.length} asignaciones
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Paper>
                    </motion.div>

                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}
                        >
                            <Box textAlign="center">
                                <CircularProgress size={60} thickness={4} />
                                <Typography sx={{ mt: 2, fontSize: '1rem', color: 'text.secondary' }}>
                                    {isRefreshing ? 'Actualizando asignaciones...' : 'Cargando asignaciones programadas...'}
                                </Typography>
                            </Box>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {filteredAssignments.length === 0 ? (
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        p: 4, 
                                        textAlign: 'center', 
                                        borderRadius: 3,
                                        background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.background.paper} 100%)`,
                                        border: `2px dashed ${theme.palette.divider}`
                                    }}
                                >
                                    <Schedule sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        {searchTerm ? 'No se encontraron asignaciones' : 'No hay asignaciones programadas'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {searchTerm 
                                            ? 'Intenta con otros términos de búsqueda o revisa la ortografía' 
                                            : 'Crea tu primera asignación programada haciendo clic en el botón + en la esquina inferior derecha'
                                        }
                                    </Typography>
                                </Paper>
                            ) : (
                                <ScheduledAssignmentsList
                                    filteredAssignments={filteredAssignments}
                                    teachers={teachers}
                                    theme={theme}
                                    getStatusLabel={getStatusLabel}
                                    getStatusColor={getStatusColor}
                                    formatDate={formatDate}
                                    handleViewDetails={handleViewDetails}
                                    handleEditAssignment={handleEditAssignment}
                                    handleDeleteAssignment={handleDeleteAssignment}
                                />
                            )}
                        </motion.div>
                    )}

                    {/* Botón flotante mejorado para crear nueva asignación */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                                        <Fab
                            color="primary"
                            onClick={handleCreateNew}
                            sx={{
                                position: 'fixed',
                                bottom: 24,
                                right: 24,
                                zIndex: 1000,
                                width: 56,
                                height: 56,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                    boxShadow: theme.shadows[6]
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: theme.shadows[3]
                            }}
                        >
                            <Add sx={{ fontSize: 28 }} />
                        </Fab>
                    </motion.div>
                </DialogContent>
            </Dialog>

            {/* Diálogo de detalles mejorado */}
            <Dialog
                open={showDetailDialog}
                onClose={() => setShowDetailDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                        boxShadow: theme.shadows[10]
                    }
                }}
            >
                <AnimatePresence>
                    {selectedAssignment && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <DialogTitle sx={{ 
                                py: 2,
                                px: 3,
                                background: `linear-gradient(135deg, ${theme.palette.info.dark} 0%, ${theme.palette.info.main} 100%)`,
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {selectedAssignment.title}
                                </Typography>
                                <IconButton 
                                    onClick={() => setShowDetailDialog(false)}
                                    sx={{ color: 'white' }}
                                >
                                    <Close />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box mb={2}>
                                    <Chip
                                        label={getStatusLabel(selectedAssignment.status)}
                                        color={getStatusColor(selectedAssignment.status)}
                                        sx={{ 
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: 1,
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                </Box>
                                
                                <Typography variant="body1" paragraph sx={{ 
                                    whiteSpace: 'pre-line',
                                    lineHeight: 1.6,
                                    fontSize: '0.9rem'
                                }}>
                                    {selectedAssignment.description}
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Paper 
                                            elevation={1}
                                            sx={{ 
                                                p: 2,
                                                borderRadius: 2,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.primary.main}10 100%)`,
                                                border: `1px solid ${theme.palette.primary.light}`
                                            }}
                                        >
                                            <Typography variant="subtitle1" sx={{ 
                                                mb: 1.5,
                                                fontWeight: 'bold',
                                                color: 'primary.main',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                fontSize: '0.9rem'
                                            }}>
                                                <CalendarToday sx={{ fontSize: 18 }} />
                                                Cronograma
                                            </Typography>
                                            <Box sx={{ '& > *': { mb: 1.5 } }}>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                        Fecha de Publicación:
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                        {selectedAssignment.publishDate ? formatDate(selectedAssignment.publishDate) : 'Sin fecha'}
                                                    </Typography>
                                                </Box>
                                                {selectedAssignment.dueDate && (
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                            Fecha de Entrega:
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                            {formatDate(selectedAssignment.dueDate)}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {selectedAssignment.closeDate && (
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                            Fecha de Cierre:
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                            {formatDate(selectedAssignment.closeDate)}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Paper 
                                            elevation={1}
                                            sx={{ 
                                                p: 2,
                                                borderRadius: 2,
                                                background: `linear-gradient(135deg, ${theme.palette.info.light}20 0%, ${theme.palette.info.main}10 100%)`,
                                                border: `1px solid ${theme.palette.info.light}`
                                            }}
                                        >
                                            <Typography variant="subtitle1" sx={{ 
                                                mb: 1.5,
                                                fontWeight: 'bold',
                                                color: 'info.main',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                fontSize: '0.9rem'
                                            }}>
                                                <Description sx={{ fontSize: 18 }} />
                                                Detalles
                                            </Typography>
                                            <Box sx={{ '& > *': { mb: 1.5 } }}>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                        Estado:
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                        {getStatusLabel(selectedAssignment.status)}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                        Docentes asignados:
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                        {teachers.length} docentes
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                        ID de Asignación:
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                                        {selectedAssignment._id || 'Sin ID'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions sx={{ 
                                p: 3,
                                borderTop: `1px solid ${theme.palette.divider}`,
                                gap: 2
                            }}>
                                <Button
                                    color="info"
                                    variant="contained"
                                    startIcon={<Edit />}
                                    sx={{ 
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '0.9rem',
                                        minWidth: '140px',
                                        height: '40px',
                                        px: 2
                                    }}
                                >
                                    Editar Asignación
                                </Button>
                                <Button 
                                    onClick={() => setShowDetailDialog(false)}
                                    variant="outlined"
                                    sx={{ 
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '0.9rem',
                                        minWidth: '100px',
                                        height: '40px',
                                        px: 2
                                    }}
                                >
                                    Cerrar
                                </Button>
                            </DialogActions>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Dialog>

            {/* Diálogo de creación de nueva asignación */}
            <Dialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                        boxShadow: theme.shadows[10],
                        minHeight: '600px',
                        maxHeight: '90vh'
                    }
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                >
                    <DialogTitle sx={{ 
                        py: 2,
                        px: 3,
                        background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {selectedAssignment && selectedAssignment._id ? 'Editar Asignación Programada' : 'Nueva Asignación Programada'}
                        </Typography>
                        <IconButton 
                            onClick={() => setShowCreateDialog(false)}
                            sx={{ color: 'white' }}
                        >
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: 4, backgroundColor: 'transparent' }}>
                        <Box sx={{ 
                            backgroundColor: 'white', 
                            borderRadius: 2, 
                            p: 3,
                            boxShadow: theme.shadows[1],
                            border: `1px solid ${theme.palette.divider}`
                        }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Título de la Asignación"
                                        value={newAssignment.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        variant="outlined"
                                        required
                                        sx={{ 
                                            '& .MuiInputBase-root': {
                                                height: '56px',
                                                fontSize: '1rem'
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '1rem'
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Descripción"
                                        value={newAssignment.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        required
                                        sx={{ 
                                            '& .MuiInputBase-root': {
                                                fontSize: '1rem',
                                                lineHeight: '1.5'
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '1rem'
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Fecha de Publicación"
                                        type="datetime-local"
                                        value={newAssignment.publishDate}
                                        onChange={(e) => handleInputChange('publishDate', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        required
                                        sx={{ 
                                            '& .MuiInputBase-root': {
                                                height: '56px',
                                                fontSize: '1rem'
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '1rem'
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Fecha de Entrega"
                                        type="datetime-local"
                                        value={newAssignment.dueDate}
                                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ 
                                            '& .MuiInputBase-root': {
                                                height: '56px',
                                                fontSize: '1rem'
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '1rem'
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Fecha de Cierre"
                                        type="datetime-local"
                                        value={newAssignment.closeDate}
                                        onChange={(e) => handleInputChange('closeDate', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ 
                                            '& .MuiInputBase-root': {
                                                height: '56px',
                                                fontSize: '1rem'
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '1rem'
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ 
                                        '& .MuiInputBase-root': {
                                            height: '56px',
                                            fontSize: '1rem'
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontSize: '1rem'
                                        }
                                    }}>
                                        <InputLabel>Estado</InputLabel>
                                        <Select
                                            value={newAssignment.status}
                                            onChange={(e) => handleInputChange('status', e.target.value)}
                                            label="Estado"
                                        >
                                            <MenuItem value="scheduled">Programada</MenuItem>
                                            <MenuItem value="draft">Borrador</MenuItem>
                                            <MenuItem value="active">Activa</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ 
                        p: 4,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        gap: 2,
                        justifyContent: 'flex-end',
                        backgroundColor: 'white'
                    }}>
                        <Button
                            onClick={() => setShowCreateDialog(false)}
                            variant="outlined"
                            startIcon={<Cancel />}
                            sx={{ 
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                minWidth: '140px',
                                height: '48px',
                                px: 3,
                                borderColor: theme.palette.grey[400],
                                color: theme.palette.grey[700],
                                '&:hover': {
                                    borderColor: theme.palette.grey[600],
                                    backgroundColor: theme.palette.grey[50]
                                }
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateAssignment}
                            variant="contained"
                            startIcon={<Save />}
                            disabled={isCreating || !newAssignment.title || !newAssignment.description || !newAssignment.publishDate}
                            sx={{ 
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                minWidth: '160px',
                                height: '48px',
                                px: 3,
                                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                                    transform: 'translateY(-1px)',
                                    boxShadow: theme.shadows[6]
                                },
                                '&:disabled': {
                                    background: theme.palette.grey[300],
                                    color: theme.palette.grey[500]
                                }
                            }}
                        >
                            {isCreating 
                                ? (selectedAssignment && selectedAssignment._id ? 'Actualizando...' : 'Creando...') 
                                : (selectedAssignment && selectedAssignment._id ? 'Actualizar Asignación' : 'Crear Asignación')
                            }
                        </Button>
                    </DialogActions>
                </motion.div>
            </Dialog>
        </>
    );
};

export default ScheduledAssignmentsSimple;
