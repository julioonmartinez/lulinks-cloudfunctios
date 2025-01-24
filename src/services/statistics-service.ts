import { admin } from "../config/firebase-config";
import { Statistics } from "../types/statistics";

const db = admin.firestore();
const collectionStatistics = "statistics";

/**
 * Incrementa las estadísticas de visualizaciones o clics.
 */
export async function updateStatistics({
  type,
  profileId,
  widgetId,
  uniqueId, // Identificador único del visitante
}: {
  type: "views" | "clicks";
  profileId: string;
  widgetId?: string;
  uniqueId?: string; // Puede ser el UID del usuario, IP, o cookie.
}): Promise<void> {
  try {
    const query = db
      .collection(collectionStatistics)
      .where("profileId", "==", profileId)
      .where("widgetId", "==", widgetId || '');

    const snapshot = await query.get();

    if (snapshot.empty) {
      // Crea nuevas estadísticas si no existen
      const newStats: Statistics = {
        profileId,
        widgetId: widgetId || '',
        views: type === "views" ? 1 : 0,
        clicks: type === "clicks" ? 1 : 0,
        uniqueViews: uniqueId ? 1 : 0, // Incrementa si hay un ID único
        createdAt: new Date(),
        updatedAt: new Date(),
        // uniqueIds: uniqueId ? [uniqueId] : [], // Guarda la lista de IDs únicos
        uniqueIds: uniqueId ? [uniqueId] : [],
      };
      await db.collection(collectionStatistics).add(newStats);
    } else {
      const doc = snapshot.docs[0];
      const stats = doc.data() as Statistics;

      // Verifica si el uniqueId ya está registrado
      const isUnique =
        uniqueId && stats.uniqueIds && !stats.uniqueIds.includes(uniqueId);

      await doc.ref.update({
        [type]: (stats[type] || 0) + 1,
        uniqueViews: isUnique ? (stats.uniqueViews || 0) + 1 : stats.uniqueViews,
        uniqueIds: isUnique ? [...(stats.uniqueIds || []), uniqueId] : stats.uniqueIds,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error updating statistics:", error);
    throw new Error("Failed to update statistics");
  }
}


  

/**
 * Obtiene las estadísticas asociadas a un perfil o widget.
 */
export async function getStatistics(profileId: string, widgetId?: string): Promise<Statistics | null> {
  try {
    const query = db
      .collection(collectionStatistics)
      .where("profileId", "==", profileId)
      .where("widgetId", "==", widgetId || '');

    const snapshot = await query.get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data() as Statistics;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw new Error("Failed to fetch statistics");
  }
}
