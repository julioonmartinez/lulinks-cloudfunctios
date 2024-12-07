import { Request, Response } from 'express';
import * as stylesProfileService from '../services/styles-profile-service';

export async function createStyleProfile(req: Request, res: Response) {
  await stylesProfileService.createStyleProfile(req, res);
}

export async function getStyleProfileById(req: Request, res: Response) {
  await stylesProfileService.getStyleProfileById(req, res);
}

export async function getAllStyleProfiles(req: Request, res: Response) {
  await stylesProfileService.getAllStyleProfiles(req, res);
}

export async function updateStyleProfile(req: Request, res: Response) {
  await stylesProfileService.updateStyleProfile(req, res);
}

export async function deleteStyleProfile(req: Request, res: Response) {
  await stylesProfileService.deleteStyleProfile(req, res);
}

