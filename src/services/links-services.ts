import { Request, Response } from "express";
import { admin } from "../config/firebase-config";
import { Timestamp } from "firebase-admin/firestore";
import { Link } from "../types/link";

const db = admin.firestore();

/**
 * Service to create a new link for a specific profile.
 */
export async function addLink(req: Request, res: Response) {
  const profileId = req.params.profileId; // ID del perfil
  const newLink: Link = req.body;

  try {
    newLink.createdAt = Timestamp.now();

    const docRef = await db
      .collection("profiles")
      .doc(profileId)
      .collection("links")
      .add(newLink);

    res.status(201).json({
      message: "Link added successfully",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error adding link:", error);
    res.status(500).json({
      error: "Error adding link",
      details: error,
    });
  }
}

/**
 * Service to fetch a link by ID for a specific profile.
 */
export async function getLinkById(req: Request, res: Response): Promise<Response> {
  const profileId = req.params.profileId;
  const linkId = req.params.linkId;

  try {
    const linkRef = db
      .collection("profiles")
      .doc(profileId)
      .collection("links")
      .doc(linkId);
    const doc = await linkRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Link not found" }); // Devuelve un resultado explícito
    }

    return res.status(200).json({ id: doc.id, ...doc.data() }); // Devuelve el enlace
  } catch (error) {
    console.error("Error fetching link:", error);
    return res.status(500).json({
      error: "Error fetching link",
      details: error,
    }); // Ahora hay un `return` explícito
  }
}


/**
 * Service to fetch all links for a specific profile.
 */
export async function getAllLinks(req: Request, res: Response) {
  const profileId = req.params.profileId;

  try {
    const snapshot = await db
      .collection("profiles")
      .doc(profileId)
      .collection("links")
      .get();

    const links = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({
      error: "Error fetching links",
      details: error,
    });
  }
}

/**
 * Service to update a link for a specific profile.
 */
export async function updateLink(req: Request, res: Response) {
  const profileId = req.params.profileId;
  const linkId = req.params.linkId;
  const updatedLink: Partial<Link> = req.body;

  try {
    await db
      .collection("profiles")
      .doc(profileId)
      .collection("links")
      .doc(linkId)
      .update(updatedLink);

    res.status(200).json({ message: "Link updated successfully" });
  } catch (error) {
    console.error("Error updating link:", error);
    res.status(500).json({
      error: "Error updating link",
      details: error,
    });
  }
}

/**
 * Service to delete a link for a specific profile.
 */
export async function deleteLink(req: Request, res: Response) {
  const profileId = req.params.profileId;
  const linkId = req.params.linkId;

  try {
    await db
      .collection("profiles")
      .doc(profileId)
      .collection("links")
      .doc(linkId)
      .delete();

    res.status(200).json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({
      error: "Error deleting link",
      details: error,
    });
  }
}

