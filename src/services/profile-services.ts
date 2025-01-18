import { Request, Response } from "express";
import { admin } from "../config/firebase-config";
import { Profile } from "../types/profile";

const db = admin.firestore();
const collectionProfiles = "profiles";

/**
 * Service to create a new profile.
 */
export async function createProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  const newProfile: Profile = req.body;

  try {
    // Validar que el usuario esté autenticado
    if (!req.user || !req.user.uid) {
      return res.status(403).json({
        status: "error",
        code: "UNAUTHORIZED",
        message: "User is not authenticated",
      });
    }

    // Normalizar el nombre de usuario
    if (!newProfile.userName || typeof newProfile.userName !== "string") {
      return res.status(400).json({
        status: "error",
        code: "VALIDATION_ERROR",
        message: "Invalid or missing 'userName' field",
      });
    }

    newProfile.userName = newProfile.userName.trim().toLowerCase();

    // Verificar si el nombre de usuario ya existe
    const profilesRef = db.collection("profiles");
    const querySnapshot = await profilesRef.where("userName", "==", newProfile.userName).get();

    if (!querySnapshot.empty) {
      return res.status(400).json({
        status: "error",
        code: "USER_EXISTS",
        message: "UserName already exists",
      });
    }

    // Agregar el campo `createdBy` con el ID del usuario autenticado
    newProfile.createdBy = req.user.uid;
    newProfile.createAt = new Date();
    newProfile.status = true;

    // Crear el perfil
    const docRef = await profilesRef.add(newProfile);

    return res.status(201).json({
      status: "success",
      message: "Profile created successfully",
      data: { id: docRef.id, ...newProfile },
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "Error creating profile",
      details: errorMessage,
    });
  }
}



/**
 * Service to fetch a profile by ID.
 */
export async function getProfileById(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  const profileId = req.params.id;

  try {
    const profileRef = db.collection(collectionProfiles).doc(profileId);
    const doc = await profileRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        status: "error",
        code: "PROFILE_NOT_FOUND",
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Profile fetched successfully",
      data: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching profile",
      details: errorMessage,
    });
  }
}



/**
 * Service to fetch all profiles.
 */
export async function getAllProfiles(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const snapshot = await db.collection(collectionProfiles).get();
    const profiles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      status: "success",
      message: "Profiles fetched successfully",
      data: profiles,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching profiles",
      details: errorMessage,
    });
  }
}

/**
 * Service to update a profile.
 */
export async function updateProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  const { id } = req.params;
  const updatedProfile: Partial<Profile> = req.body;

  try {
    // Validar que el usuario esté autenticado
    if (!req.user || !req.user.uid) {
      return res.status(403).json({
        status: "error",
        code: "UNAUTHORIZED",
        message: "User is not authenticated",
      });
    }

    // Obtener el perfil para validar la propiedad
    const profileRef = db.collection(collectionProfiles).doc(id);
    const profileDoc = await profileRef.get();

    if (!profileDoc.exists) {
      return res.status(404).json({
        status: "error",
        code: "PROFILE_NOT_FOUND",
        message: "Profile not found",
      });
    }

    const profileData = profileDoc.data();

    // Validar que el usuario autenticado sea el propietario
    if (profileData?.createdBy !== req.user.uid) {
      return res.status(403).json({
        status: "error",
        code: "FORBIDDEN",
        message: "You do not have permission to update this profile",
      });
    }

    // Actualizar el perfil
    await profileRef.update({
      ...updatedProfile,
      lastUpdate: new Date(),
    });

    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "Error updating profile",
      details: errorMessage,
    });
  }
}



/**
 * Service to delete a profile.
 */
export async function deleteProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  const { id } = req.params;

  try {
    // Validar que el usuario esté autenticado
    if (!req.user || !req.user.uid) {
      return res.status(403).json({
        status: "error",
        code: "UNAUTHORIZED",
        message: "User is not authenticated",
      });
    }

    // Obtener el perfil para validar la propiedad
    const profileRef = db.collection(collectionProfiles).doc(id);
    const profileDoc = await profileRef.get();

    if (!profileDoc.exists) {
      return res.status(404).json({
        status: "error",
        code: "PROFILE_NOT_FOUND",
        message: "Profile not found",
      });
    }

    const profileData = profileDoc.data();

    // Validar que el usuario autenticado sea el propietario
    if (profileData?.createdBy !== req.user.uid) {
      return res.status(403).json({
        status: "error",
        code: "FORBIDDEN",
        message: "You do not have permission to delete this profile",
      });
    }

    // Eliminar el perfil
    await profileRef.delete();

    return res.status(200).json({
      status: "success",
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "Error deleting profile",
      details: errorMessage,
    });
  }
}

/**
 * Service to fetch all profiles by UUID.
 */
export async function getProfilesByUuid(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  const uuid = req.query.uuid as string;

  if (!uuid) {
    return res.status(400).json({
      status: "error",
      code: "VALIDATION_ERROR",
      message: "UUID is required",
    });
  }

  try {
    const profilesRef = db.collection(collectionProfiles);
    const querySnapshot = await profilesRef.where("uuid", "==", uuid).get();

    const profiles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      status: "success",
      message: "Profiles fetched successfully",
      data: profiles,
    });
  } catch (error) {
    console.error("Error fetching profiles by UUID:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching profiles by UUID",
      details: errorMessage,
    });
  }
}

export async function getProfileByUsername(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
      return res.status(400).json({
        status: "error",
        code: "VALIDATION_ERROR",
        message: "Missing or invalid 'username' query parameter",
      });
    }

    const snapshot = await db
      .collection(collectionProfiles)
      .where("userName", "==", username.toLowerCase().trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        status: "error",
        code: "PROFILE_NOT_FOUND",
        message: "No profile found with the given username",
      });
    }

    const profile = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

    return res.status(200).json({
      status: "success",
      message: "Profile fetched successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Error fetching profile by username:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching profile by username",
      details: errorMessage,
    });
  }
}

