import { Request, Response } from "express";
import { admin } from "../config/firebase-config";

const db = admin.firestore();

export async function createStyleProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const profileId = req.params.profileId; // Tomar el `profileId` de los params
    const styleProfile = req.body; // Tomar el objeto del estilo del body

    // Validación del parámetro `profileId`
    if (!profileId) {
      return res.status(400).json({ message: 'Missing profileId' });
    }

    // Crear el estilo como subdocumento dentro del perfil
    const docRef = await db
      .collection('profiles')
      .doc(profileId)
      .collection('styles')
      .add(styleProfile);

    // Respuesta de éxito
    return res.status(201).json({
      message: 'Style profile created successfully',
      id: docRef.id,
      styleProfile: { id: docRef.id, ...styleProfile },
    });
  } catch (error) {
    console.error('Error creating style profile:', error);

    // Respuesta de error
    return res.status(500).json({ error: 'Error creating style profile', details: error });
  }
}



export async function getStyleProfileById(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  
  try {
    const { profileId, styleId } = req.params;

    // Obtener el documento del estilo
    const doc = await db
      .collection('profiles')
      .doc(profileId)
      .collection('styles')
      .doc(styleId)
      .get();

    // Si no existe, devuelve un error 404
    if (!doc.exists) {
      return res.status(404).json({ message: 'Style profile not found' });
    }

    // Devuelve el documento si existe
    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching style profile:', error);

    // Manejo de errores
    return res.status(500).json({ error: 'Error fetching style profile', details: error });
  }
}


export async function getAllStyleProfiles(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId } = req.params;

    // Validación de `profileId`
    if (!profileId) {
      return res.status(400).json({ message: 'Missing profileId in params' });
    }

    const snapshot = await db
      .collection('profiles')
      .doc(profileId)
      .collection('styles')
      .get();

    const stylesProfiles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(stylesProfiles);
  } catch (error) {
    console.error('Error fetching styles profiles:', error);

    // Manejo de errores
    return res.status(500).json({ error: 'Error fetching styles profiles', details: error });
  }
}


export async function updateStyleProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId, styleId } = req.params;
    const updatedStyleProfile = req.body;

    // Validación de `profileId` y `styleId`
    if (!profileId || !styleId) {
      return res.status(400).json({ message: 'Missing profileId or styleId in params' });
    }

    await db
      .collection('profiles')
      .doc(profileId)
      .collection('styles')
      .doc(styleId)
      .update(updatedStyleProfile);

    return res.status(200).json({ message: 'Style profile updated successfully' });
  } catch (error) {
    console.error('Error updating style profile:', error);

    // Manejo de errores
    return res.status(500).json({ error: 'Error updating style profile', details: error });
  }
}


export async function deleteStyleProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId, styleId } = req.params;

    // Validación de `profileId` y `styleId`
    if (!profileId || !styleId) {
      return res.status(400).json({ message: 'Missing profileId or styleId in params' });
    }

    await db
      .collection('profiles')
      .doc(profileId)
      .collection('styles')
      .doc(styleId)
      .delete();

    return res.status(200).json({ message: 'Style profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting style profile:', error);

    // Manejo de errores
    return res.status(500).json({ error: 'Error deleting style profile', details: error });
  }
}


