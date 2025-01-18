import { Request, Response, NextFunction } from "express";
import { admin } from "../config/firebase-config"; // Configuración de Firebase Admin SDK

// Extender el tipo Request para incluir la propiedad "user"
declare global {
  namespace Express {
    interface Request {
      user?: { uid: string }; // Agregar propiedad `user` al tipo Request
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token); // Verificar el token con Firebase
    req.user = { uid: decodedToken.uid }; // Adjuntar el UID al objeto `req`
    return next(); // Continuar con el siguiente middleware o handler
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token", details: error });
  }
}

