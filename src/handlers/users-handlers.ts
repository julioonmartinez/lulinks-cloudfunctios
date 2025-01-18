import { Request, Response } from 'express';

import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
  } from '../services/users-service';
  
  export async function handleCreateUser(req: Request, res: Response) {
    await createUser(req, res);
  }
  
  export async function handleGetAllUsers(req: Request, res: Response) {
    await getAllUsers(req, res);
  }
  
  export async function handleGetUserById(req: Request, res: Response) {
    await getUserById(req, res);
  }
  
  export async function handleUpdateUser(req: Request, res: Response) {
    await updateUser(req, res);
  }
  
  export async function handleDeleteUser(req: Request, res: Response) {
    await deleteUser(req, res);
  }
  