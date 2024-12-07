import * as express from "express";
import { corsHandler } from "./config/cors";
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
} from './handlers/styles-profile-handlers';

import {
  handleCreateWidget,
  handleGetAllWidgets,
  handleGetWidgetsByType,
  handleGetActiveWidgets,
  handleUpdateWidget,
  handleDeleteWidget,
} from './handlers/widgets-handlers';

const app = express();
app.use(express.json());
app.use(corsHandler);

// Link Routes
app.post("/api/profile/:profileId/link", addLink); // Crear un enlace
app.get("/api/profile/:profileId/link/:linkId", getLinkById); // Obtener un enlace
app.get("/api/profile/:profileId/links", getAllLinks); // Obtener todos los enlaces
app.put("/api/profile/:profileId/link/:linkId", updateLink); // Actualizar un enlace
app.delete("/api/profile/:profileId/link/:linkId", deleteLink); // Eliminar un enlace



// Profile Routes
app.post("/api/createProfile", createProfile); // Crear un perfil
app.get("/api/getProfile/:id", getProfileById); // Obtener perfil por ID
app.get("/api/getProfiles", getAllProfiles); // Obtener todos los perfiles
app.put("/api/updateProfile/:id", updateProfile); // Actualizar perfil
app.delete("/api/deleteProfile/:id", deleteProfile); // Eliminar perfil
app.get("/api/getProfilesByUuid", getProfilesByUuid);

// Styles Routes
app.post('/api/profile/:profileId/styles', createStyleProfile); // Crear un estilo
app.get('/api/profile/:profileId/styles/:styleId', getStyleProfileById); // Obtener un estilo por ID
app.get('/api/profile/:profileId/styles', getAllStyleProfiles); // Obtener todos los estilos
app.put('/api/profile/:profileId/styles/:styleId', updateStyleProfile); // Actualizar un estilo
app.delete('/api/profile/:profileId/styles/:styleId', deleteStyleProfile); // Eliminar un estilo


// Ruta para buscar un perfil por nombre de usuario
app.get('/api/profiles/by-username', handleGetProfileByUsername);

//Routes widgets
app.post('/api/profile/:profileId/widgets', handleCreateWidget); // Crear un widget
app.get('/api/profile/:profileId/widgets', handleGetAllWidgets); // Obtener todos los widgets
app.get('/api/profile/:profileId/widgets/type', handleGetWidgetsByType); // Obtener widgets por tipo
app.get('/api/profile/:profileId/widgets/active', handleGetActiveWidgets); // Obtener widgets activos
app.put('/api/profile/:profileId/widgets/:widgetId', handleUpdateWidget); // Actualizar un widget
app.delete('/api/profile/:profileId/widgets/:widgetId', handleDeleteWidget); // Eliminar un widget

export default app;
