import { Request, Response } from "express";
import { admin } from "../config/firebase-config";

const db = admin.firestore();

export async function createStyleProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId } = req.params;
    const styleProfile = req.body;

    // Validación del parámetro `profileId`
    if (!profileId) {
      return res.status(400).json({ message: 'Missing profileId' });
    }

    // Validar que el usuario esté autenticado
    if (!req.user || !req.user.uid) {
      return res.status(403).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'User is not authenticated',
      });
    }

    // Agregar el campo `createdBy` con el UID del usuario autenticado
    styleProfile.createdBy = req.user.uid;
    styleProfile.dateCreate = new Date();

    // Crear el estilo
    const docRef = await db
      .collection('profiles')
      .doc(profileId)
      .collection('styles')
      .add(styleProfile);

    return res.status(201).json({
      message: 'Style profile created successfully',
      id: docRef.id,
      styleProfile: { id: docRef.id, ...styleProfile },
    });
  } catch (error) {
    console.error('Error creating style profile:', error);
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

    if (!req.user || !req.user.uid) {
      return res.status(403).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'User is not authenticated',
      });
    }

    // Obtener el estilo
    const styleRef = db.collection('profiles').doc(profileId).collection('styles').doc(styleId);
    const styleDoc = await styleRef.get();

    if (!styleDoc.exists) {
      return res.status(404).json({ message: 'Style profile not found' });
    }

    const styleData = styleDoc.data();

    // Validar que el usuario sea el creador del estilo
    if (styleData?.createdBy !== req.user.uid) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'You do not have permission to update this style',
      });
    }

    // Actualizar el estilo
    await styleRef.update({
      ...updatedStyleProfile,
      lastUpdate: new Date(),
    });

    return res.status(200).json({ message: 'Style profile updated successfully' });
  } catch (error) {
    console.error('Error updating style profile:', error);
    return res.status(500).json({ error: 'Error updating style profile', details: error });
  }
}



export async function deleteStyleProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId, styleId } = req.params;

    if (!req.user || !req.user.uid) {
      return res.status(403).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'User is not authenticated',
      });
    }

    // Obtener el estilo
    const styleRef = db.collection('profiles').doc(profileId).collection('styles').doc(styleId);
    const styleDoc = await styleRef.get();

    if (!styleDoc.exists) {
      return res.status(404).json({ message: 'Style profile not found' });
    }

    const styleData = styleDoc.data();

    // Validar que el usuario sea el creador del estilo
    if (styleData?.createdBy !== req.user.uid) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'You do not have permission to delete this style',
      });
    }

    // Eliminar el estilo
    await styleRef.delete();

    return res.status(200).json({ message: 'Style profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting style profile:', error);
    return res.status(500).json({ error: 'Error deleting style profile', details: error });
  }
}


