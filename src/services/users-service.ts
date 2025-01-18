import { Request, Response } from 'express';
import { admin } from '../config/firebase-config';
import { Timestamp } from 'firebase-admin/firestore';

const db = admin.firestore();

// Función para crear un usuario
export async function createUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { uid, ...userData } = req.body;

    if (!uid) {
      return res.status(400).json({
        status: "error",
        code: "VALIDATION_ERROR",
        message: "Missing uid in request body", 
      });
    }

    userData.dateCreate = Timestamp.now();
    userData.lastUpdate = Timestamp.now();

    await db.collection("users").doc(uid).set(userData);

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: { id: uid, ...userData },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "Error creating user",
      details: errorMessage,
    });
  }
}

export async function getAllUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const snapshot = await db.collection('users').get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      status: 'success',
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);

    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';

    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error fetching users',
      details: errorMessage,
    });
  }
}



// Función para obtener un usuario por ID
export async function getUserById(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { userId } = req.params;

    if (!req.user || req.user.uid !== userId) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'You are not authorized to access this user',
      });
    }

    const doc = await db.collection('users').doc(userId).get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'User fetched successfully',
      data: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error fetching user by ID',
      details: errorMessage,
    });
  }
}


// Función para actualizar un usuario
export async function updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { userId } = req.params;
    const updatedUser = { ...req.body, lastUpdate: Timestamp.now() };

    if (!req.user || req.user.uid !== userId) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'You are not authorized to update this user',
      });
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    await userRef.update(updatedUser);

    return res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error updating user',
      details: errorMessage,
    });
  }
}



// Función para eliminar un usuario
export async function deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  try {
    const { userId } = req.params;

    if (!req.user || req.user.uid !== userId) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'You are not authorized to delete this user',
      });
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    await userRef.delete();

    return res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error deleting user',
      details: errorMessage,
    });
  }
}


  
