import { Request, Response } from "express";
import { admin } from "../config/firebase-config";
import { Profile } from "../types/profile";

const db = admin.firestore();
const collectionProfiles = "profiles";

/**
 * Service to create a new profile.
 */
export async function createProfile(req: Request, res: Response) {
  const newProfile: Profile = req.body;

  try {
    // Validación: Verificar si el usuario ya existe
    const profilesRef = db.collection("profiles");
    const querySnapshot = await profilesRef.where("userName", "==", newProfile.userName).get();

    if (!querySnapshot.empty) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Añadir valores generados automáticamente
    newProfile.createAt = new Date(); // Fecha de creación
    newProfile.status = true; // Estado activo por defecto

    // Crear el nuevo perfil
    const docRef = await profilesRef.add(newProfile);

    // Devolver el perfil completo incluyendo el ID generado
    const createdProfile = { id: docRef.id, ...newProfile };

    return res.status(201).json({
      message: "Profile created successfully",
      profile: createdProfile,
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    return res.status(500).json({
      error: "Error creating profile",
      details: error,
    });
  }
}


/**
 * Service to fetch a profile by ID.
 */
export async function getProfileById(req: Request, res: Response): Promise<Response> {
  const profileId = req.params.id;

  try {
    const profileRef = db.collection("profiles").doc(profileId);
    const doc = await profileRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Profile not found" }); // Retorno explícito
    }

    return res.status(200).json({ id: doc.id, ...doc.data() }); // Retorno explícito
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      error: "Error fetching profile",
      details: error,
    }); // Retorno explícito
  }
}



/**
 * Service to fetch all profiles.
 */
export async function getAllProfiles(req: Request, res: Response) {
  try {
    const snapshot = await db.collection(collectionProfiles).get();
    const profiles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({
      error: "Error fetching profiles",
      details: error,
    });
  }
}

/**
 * Service to update a profile.
 */
export async function updateProfile(req: Request, res: Response) {
  const { id } = req.params;
  const updatedProfile: Partial<Profile> = req.body;

  try {
    await db.collection(collectionProfiles).doc(id).update(updatedProfile);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      error: "Error updating profile",
      details: error,
    });
  }
}

/**
 * Service to delete a profile.
 */
export async function deleteProfile(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await db.collection(collectionProfiles).doc(id).delete();
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({
      error: "Error deleting profile",
      details: error,
    });
  }
}

/**
 * Service to fetch all profiles by UUID.
 */
export async function getProfilesByUuid(req: Request, res: Response) {
  const uuid = req.query.uuid as string; // Obtener el UUID de los parámetros de consulta

  if (!uuid) {
    return res.status(400).json({ error: "UUID is required" });
  }

  try {
    // Buscar perfiles que coincidan con el UUID
    const profilesRef = db.collection("profiles");
    const querySnapshot = await profilesRef.where("uuid", "==", uuid).get();

    // Si no hay perfiles, devuelve una lista vacía
    if (querySnapshot.empty) {
      return res.status(200).json({
        message: "No profiles found for the given UUID",
        profiles: [],
      });
    }

    // Extraer y devolver datos de los documentos encontrados
    const profiles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      message: "Profiles fetched successfully",
      profiles,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error,
    });
  }
}

export async function getProfileByUsername(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { username } = req.query;

    // Validar que se haya proporcionado un nombre de usuario
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid "username" query parameter' });
    }

    // Buscar el primer perfil con el nombre de usuario
    const snapshot = await db
      .collection('profiles')
      .where('userName', '==', username) // Búsqueda exacta
      .limit(1) // Solo el primer resultado
      .get();

    // Si no hay resultados
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No profile found with the given username' });
    }

    // Obtener el primer documento
    const doc = snapshot.docs[0];
    const profile = { id: doc.id, ...doc.data() };

    return res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile by username:', error);
    return res.status(500).json({ error: 'Error fetching profile by username', details: error });
  }
}

