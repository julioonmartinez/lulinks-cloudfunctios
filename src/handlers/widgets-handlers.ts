import { Request, Response } from 'express';

import {
    createWidget,
    getAllWidgets,
    getWidgetsByType,
    getActiveWidgets,
    updateWidget,
    deleteWidget,
  } from '../services/widgets-service';
  
  export async function handleCreateWidget(req: Request, res: Response) {
    await createWidget(req, res);
  }
  
  export async function handleGetAllWidgets(req: Request, res: Response) {
    await getAllWidgets(req, res);
  }
  
  export async function handleGetWidgetsByType(req: Request, res: Response) {
    await getWidgetsByType(req, res);
  }
  
  export async function handleGetActiveWidgets(req: Request, res: Response) {
    await getActiveWidgets(req, res);
  }
  
  export async function handleUpdateWidget(req: Request, res: Response) {
    await updateWidget(req, res);
  }
  
  export async function handleDeleteWidget(req: Request, res: Response) {
    await deleteWidget(req, res);
  }
  
  