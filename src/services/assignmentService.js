import axios from 'axios';

const API_URL = 'http://localhost:3001/api/assignments';

// Configurar token de autorización
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

// Funciones para el admin
export const getAdminAllAssignments = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/all`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener las asignaciones' };
    }
};

export const getAdminAssignmentStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/stats`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener las estadísticas' };
    }
};

export const markAssignmentCompletedByAdmin = async (assignmentId) => {
    try {
        const response = await axios.patch(
            `${API_URL}/admin/${assignmentId}/complete`,
            {},
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al marcar como completada' };
    }
};

export const updateAssignmentByAdmin = async (assignmentId, assignmentData) => {
    try {
        const response = await axios.put(
            `${API_URL}/admin/${assignmentId}`,
            assignmentData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al actualizar la asignación' };
    }
};

// Nuevas funciones para gestión de estados de docentes
export const getTeachersStatusForAssignment = async (assignmentId) => {
    try {
        const response = await axios.get(
            `${API_URL}/${assignmentId}/teachers-status`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener los estados de los docentes' };
    }
};

export const updateTeacherStatusInAssignment = async (assignmentId, teacherId, status) => {
    try {
        const response = await axios.patch(
            `${API_URL}/${assignmentId}/teacher-status`,
            { teacherId, status },
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al actualizar el estado del docente' };
    }
};

// Funciones para usuarios generales
export const getAllAssignments = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener las asignaciones' };
    }
};

export const getUserAssignments = async () => {
    try {
        const response = await axios.get(`${API_URL}/my-assignments`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener mis asignaciones' };
    }
};

export const updateAssignmentStatus = async (assignmentId, status) => {
    try {
        const response = await axios.patch(
            `${API_URL}/${assignmentId}/status`,
            { status },
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al actualizar el estado' };
    }
};

export const getAssignmentById = async (assignmentId) => {
    try {
        const response = await axios.get(`${API_URL}/${assignmentId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener la asignación' };
    }
};

export const getUserDashboardStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/dashboard-stats`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener las estadísticas del dashboard' };
    }
};

export const getFilteredAssignments = async (filters) => {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await axios.get(`${API_URL}/filtered?${queryParams}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener las asignaciones filtradas' };
    }
};

// Funciones para docentes
export const getTeacherAssignmentStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/teacher/stats`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener las estadísticas del docente' };
    }
};

export const getTeacherFilteredAssignments = async (filters) => {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await axios.get(`${API_URL}/teacher/assignments?${queryParams}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener las asignaciones del docente' };
    }
};

// Alias para compatibilidad
export const getTeacherAssignments = getTeacherFilteredAssignments;

// Función para obtener estadísticas de todos los docentes
export const getAllTeachersStats = async () => {
    // Por ahora devolvemos un objeto vacío ya que esta ruta no existe en el backend
    // TODO: Implementar la ruta /admin/teachers-stats en el backend si es necesaria
    return { teachers: [], totalTeachers: 0 };
};

export const markAssignmentCompleted = async (assignmentId) => {
    try {
        const response = await axios.patch(
            `${API_URL}/teacher/${assignmentId}/complete`,
            {},
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al marcar como completada' };
    }
};

// Función para crear asignaciones
export const createAssignment = async (assignmentData) => {
    try {
        const response = await axios.post(`${API_URL}/`, assignmentData, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al crear la asignación' };
    }
};

export default {
    getAdminAllAssignments,
    getAdminAssignmentStats,
    markAssignmentCompletedByAdmin,
    updateAssignmentByAdmin,
    getTeachersStatusForAssignment,
    updateTeacherStatusInAssignment,
    getAllAssignments,
    getUserAssignments,
    updateAssignmentStatus,
    getAssignmentById,
    getUserDashboardStats,
    getFilteredAssignments,
    getTeacherAssignmentStats,
    getTeacherFilteredAssignments,
    getTeacherAssignments,
    getAllTeachersStats,
    markAssignmentCompleted,
    createAssignment
};
