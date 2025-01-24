export interface Statistics {
    id?: string; // ID de la estadística
    profileId?: string; // ID del perfil asociado
    widgetId?: string; // ID del widget asociado
    views: number; // Total de visualizaciones
    uniqueViews: number; // Visualizaciones únicas
    clicks: number; // Total de clics
    shares?: number; // Total de veces compartido
    engagement?: {
      likes: number;
      comments: number;
    };
    conversions?: number; // Conversiones (si aplica)
    averageTimeSpent?: number; // Tiempo promedio en segundos
    createdAt: Date; // Fecha de creación de las estadísticas
    updatedAt?: Date; // Última actualización
    uniqueIds: string[];
  }
  