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
} from "./handlers/profile-handlers";

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

export default app;
