import * as express from "express";
import { corsHandler } from "./config/cors";
import { authenticate } from "./middlewares/authenticate"; // Importamos el middleware `authenticate`

import {
  addLink,
  getLinkById,
  getAllLinks,
  updateLink,
  deleteLink,
} from "./handlers/links-handlers";

import {
  createProfile,
  getProfileById,
  getAllProfiles,
  updateProfile,
  deleteProfile,
  getProfilesByUuid,
  handleGetProfileByUsername,
} from "./handlers/profile-handlers";

import {
  createStyleProfile,
  getStyleProfileById,
  getAllStyleProfiles,
  updateStyleProfile,
  deleteStyleProfile,
} from "./handlers/styles-profile-handlers";

import {
  handleCreateWidget,
  handleGetAllWidgets,
  handleGetWidgetsByType,
  handleGetActiveWidgets,
  handleUpdateWidget,
  handleDeleteWidget,
  handleGetWidgetById,
} from "./handlers/widgets-handlers";

import {
  handleCreateUser,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUser,
  handleDeleteUser,
} from "./handlers/users-handlers";
import { handleGetStatistics, handleUpdateStatistics } from "./handlers/statistics-handlers";

const app = express();
app.use(express.json());
app.use(corsHandler);

// Routes requiring authentication
// Protect these routes with the `authenticate` middleware
// Profile Routes
app.post("/api/createProfile", authenticate, createProfile); // Crear un perfil
app.get("/api/getProfile/:id", authenticate, getProfileById); // Obtener perfil por ID
app.get("/api/getProfiles", authenticate, getAllProfiles); // Obtener todos los perfiles
app.put("/api/updateProfile/:id", authenticate, updateProfile); // Actualizar perfil
app.delete("/api/deleteProfile/:id", authenticate, deleteProfile); // Eliminar perfil
app.get("/api/getProfilesByUuid", authenticate, getProfilesByUuid);

// Styles Routes
app.post('/api/profile/:profileId/styles', authenticate, createStyleProfile); // Crear un estilo
app.get('/api/profile/:profileId/styles',  getAllStyleProfiles); // Obtener todos los estilos
app.put('/api/profile/:profileId/styles/:styleId', authenticate, updateStyleProfile); // Actualizar un estilo
app.delete('/api/profile/:profileId/styles/:styleId', authenticate, deleteStyleProfile); // Eliminar un estilo
//no aunthenticate
app.get('/api/profile/:profileId/styles/:styleId', getStyleProfileById); // Obtener un estilo por ID

// Widgets Routes
app.post('/api/profile/:profileId/widgets', authenticate, handleCreateWidget); // Crear un widget
app.get('/api/profile/:profileId/widgets', authenticate, handleGetAllWidgets); // Obtener todos los widgets
app.get('/api/profile/:profileId/widgets/type', authenticate, handleGetWidgetsByType); // Obtener widgets por tipo
app.put('/api/profile/:profileId/widgets/:widgetId', authenticate, handleUpdateWidget); // Actualizar un widget
app.delete('/api/profile/:profileId/widgets/:widgetId', authenticate, handleDeleteWidget); // Eliminar un widget
//no authenticate
app.get('/api/profile/:profileId/widgets/active', handleGetActiveWidgets); // Obtener widgets activos
app.get('/api/profile/:profileId/widgets/:widgetId', handleGetWidgetById); // Obtener un widget por su ID


// Links Routes
app.post("/api/profile/:profileId/link", authenticate, addLink); // Crear un enlace
app.get("/api/profile/:profileId/link/:linkId", authenticate, getLinkById); // Obtener un enlace
app.get("/api/profile/:profileId/links", authenticate, getAllLinks); // Obtener todos los enlaces
app.put("/api/profile/:profileId/link/:linkId", authenticate, updateLink); // Actualizar un enlace
app.delete("/api/profile/:profileId/link/:linkId", authenticate, deleteLink); // Eliminar un enlace

// Rutas para usuarios
app.post('/api/users', authenticate, handleCreateUser); // Crear un usuario
app.get('/api/users', authenticate, handleGetAllUsers); // Obtener todos los usuarios
app.get('/api/users/:userId', authenticate, handleGetUserById); // Obtener un usuario por ID
app.put('/api/users/:userId', authenticate, handleUpdateUser); // Actualizar un usuario
app.delete('/api/users/:userId', authenticate, handleDeleteUser); // Eliminar un usuario

// Public routes (no authentication required)
app.get('/api/profiles/by-username', handleGetProfileByUsername); // Ruta pública para buscar perfiles por nombre de usuario

//statistics
app.post("/api/statistics/update", handleUpdateStatistics); // Ruta para actualizar estadísticas
app.get("/api/statistics", handleGetStatistics); // Ruta para obtener estadísticas
export default app;
