import { Request, Response } from 'express';
import { admin } from '../config/firebase-config';

const db = admin.firestore();

export async function createWidget(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId } = req.params;
    const widget = req.body;

    if (!profileId) {
      return res.status(400).json({ message: 'Missing profileId in params' });
    }

    // Agregar fechas
    widget.dateCreate = new Date();
    widget.lastUpdate = new Date();

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
export async function updateWidget(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId, widgetId } = req.params;
    const updatedWidget = { ...req.body, lastUpdate: new Date() };

    if (!profileId || !widgetId) {
      return res.status(400).json({ message: 'Missing profileId or widgetId in params' });
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
export async function deleteWidget(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { profileId, widgetId } = req.params;

    if (!profileId || !widgetId) {
      return res.status(400).json({ message: 'Missing profileId or widgetId in params' });
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

