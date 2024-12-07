import { Request, Response } from "express";
import * as profileService from "../services/profile-services";

/**
 * Handler to create a new profile.
 */
export async function createProfile(req: Request, res: Response) {
  await profileService.createProfile(req, res);
}

/**
 * Handler to fetch a profile by ID.
 */
export async function getProfileById(req: Request, res: Response) {
  await profileService.getProfileById(req, res);
}

/**
 * Handler to fetch all profiles.
 */
export async function getAllProfiles(req: Request, res: Response) {
  await profileService.getAllProfiles(req, res);
}

/**
 * Handler to update a profile.
 */
export async function updateProfile(req: Request, res: Response) {
  await profileService.updateProfile(req, res);
}

/**
 * Handler to delete a profile by ID.
 */
export async function deleteProfile(req: Request, res: Response) {
  await profileService.deleteProfile(req, res);
}

/**
 * Handler to fetch all profiles by UUID.
 */
export async function getProfilesByUuid(req: Request, res: Response) {
  await profileService.getProfilesByUuid(req, res);
}

export async function handleGetProfileByUsername(req: Request, res: Response) {
  await profileService.getProfileByUsername(req, res);
}
