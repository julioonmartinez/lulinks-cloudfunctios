import { Request, Response } from "express";
import * as linkService from "../services/links-services";

/**
 * Handler to add a new link for a specific profile.
 */
export async function addLink(req: Request, res: Response) {
  await linkService.addLink(req, res);
}

/**
 * Handler to fetch a link by ID for a specific profile.
 */
export async function getLinkById(req: Request, res: Response) {
  await linkService.getLinkById(req, res);
}

/**
 * Handler to fetch all links for a specific profile.
 */
export async function getAllLinks(req: Request, res: Response) {
  await linkService.getAllLinks(req, res);
}

/**
 * Handler to update a link for a specific profile.
 */
export async function updateLink(req: Request, res: Response) {
  await linkService.updateLink(req, res);
}

/**
 * Handler to delete a link for a specific profile.
 */
export async function deleteLink(req: Request, res: Response) {
  await linkService.deleteLink(req, res);
}
