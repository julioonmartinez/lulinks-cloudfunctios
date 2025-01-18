import { Request, Response } from 'express';
import { admin } from '../config/firebase-config';

const db = admin.firestore();

// Validar que el usuario tenga acceso al perfil
async function validateWidgetOwnership(
  profileId: string,
  widgetId: string,
  userId: string
): Promise<boolean> {
  const widgetDoc = await db
    .collection('profiles')
    .doc(profileId)
    .collection('widgets')
    .doc(widgetId)
    .get();

  if (!widgetDoc.exists) {
    return false; // El widget no existe
  }

  const widgetData = widgetDoc.data();
  return widgetData?.createdBy === userId; // Verifica que el usuario es el creador del widget
}


export async function createWidget(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId } = req.params;
    const widget = req.body;
    const userId = req.user?.uid;

    if (!profileId) {
      return res.status(400).json({ message: 'Missing profileId in params' });
    }

    // Agregar campos necesarios
    widget.dateCreate = new Date();
    widget.lastUpdate = new Date();
    widget.createdBy = userId; // Establecer el creador del widget

    // Crear el widget en Firestore
    const docRef = await db
      .collection('profiles')
      .doc(profileId)
      .collection('widgets')
      .add(widget);

    return res.status(201).json({
      message: 'Widget created successfully',
      id: docRef.id,
      widget: { id: docRef.id, ...widget },
    });
  } catch (error) {
    console.error('Error creating widget:', error);
    return res.status(500).json({ error: 'Error creating widget', details: error });
  }
}


export async function getWidgetsByType(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId } = req.params;
    const { type } = req.query;

    if (!profileId || !type) {
      return res.status(400).json({ message: 'Missing profileId or type in query/params' });
    }

    const snapshot = await db
      .collection('profiles')
      .doc(profileId)
      .collection('widgets')
      .where('type', '==', type)
      .get();

    const widgets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(widgets);
  } catch (error) {
    console.error('Error fetching widgets by type:', error);
    return res.status(500).json({ error: 'Error fetching widgets by type', details: error });
  }
}
export async function getActiveWidgets(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId } = req.params;

    if (!profileId) {
      return res.status(400).json({ message: 'Missing profileId in params' });
    }

    const snapshot = await db
      .collection('profiles')
      .doc(profileId)
      .collection('widgets')
      .where('active', '==', true)
      .get();

    const widgets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(widgets);
  } catch (error) {
    console.error('Error fetching active widgets:', error);
    return res.status(500).json({ error: 'Error fetching active widgets', details: error });
  }
}
// El resto de las funciones necesitan validación de ownership
export async function updateWidget(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId, widgetId } = req.params;
    const userId = req.user?.uid;
    const updatedWidget = { ...req.body, lastUpdate: new Date() };

    if (!profileId || !widgetId) {
      return res.status(400).json({ message: 'Missing profileId or widgetId in params' });
    }

    // Validar que el usuario es propietario del widget
    const isOwner = await validateWidgetOwnership(profileId, widgetId, userId!);
    if (!isOwner) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this widget' });
    }

    await db
      .collection('profiles')
      .doc(profileId)
      .collection('widgets')
      .doc(widgetId)
      .update(updatedWidget);

    return res.status(200).json({ message: 'Widget updated successfully' });
  } catch (error) {
    console.error('Error updating widget:', error);
    return res.status(500).json({ error: 'Error updating widget', details: error });
  }
}

// Validar ownership en las demás funciones
export async function deleteWidget(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId, widgetId } = req.params;
    const userId = req.user?.uid;

    if (!profileId || !widgetId) {
      return res.status(400).json({ message: 'Missing profileId or widgetId in params' });
    }

    // Validar que el usuario es propietario del widget
    const isOwner = await validateWidgetOwnership(profileId, widgetId, userId!);
    if (!isOwner) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this widget' });
    }

    await db
      .collection('profiles')
      .doc(profileId)
      .collection('widgets')
      .doc(widgetId)
      .delete();

    return res.status(200).json({ message: 'Widget deleted successfully' });
  } catch (error) {
    console.error('Error deleting widget:', error);
    return res.status(500).json({ error: 'Error deleting widget', details: error });
  }
}

export async function getAllWidgets(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId } = req.params;

    // Validar que `profileId` esté presente
    if (!profileId) {
      return res.status(400).json({ message: 'Missing profileId in params' });
    }

    // Obtener todos los widgets de la subcolección
    const snapshot = await db
      .collection('profiles')
      .doc(profileId)
      .collection('widgets')
      .get();

    // Mapear los widgets a un arreglo
    const widgets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(widgets);
  } catch (error) {
    console.error('Error fetching all widgets:', error);
    return res.status(500).json({ error: 'Error fetching all widgets', details: error });
  }
}

export async function getWidgetById(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId, widgetId } = req.params;

    if (!profileId || !widgetId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing profileId or widgetId in params',
      });
    }

    // Obtener el widget
    const doc = await db
      .collection('profiles')
      .doc(profileId)
      .collection('widgets')
      .doc(widgetId)
      .get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Widget not found',
      });
    }

    const widget = { id: doc.id, ...doc.data() };

    return res.status(200).json({
      status: 'success',
      message: 'Widget fetched successfully',
      widget,
    });
  } catch (error) {
    console.error('Error fetching widget by ID:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error fetching widget by ID',
      details: error,
    });
  }
}



