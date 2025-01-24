import { Request, Response } from "express";
import * as statisticsService from "../services/statistics-service";

export async function handleUpdateStatistics(req: Request, res: Response) {
  const { profileId, widgetId, type, uniqueId } = req.body; // Asegúrate de extraer uniqueId también

  // Validación de parámetros
  if (!profileId || !type) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields: 'profileId' or 'type'",
    });
  }

  if (type !== "views" && type !== "clicks") {
    return res.status(400).json({
      status: "error",
      message: "Invalid value for 'type'. Must be 'views' or 'clicks'.",
    });
  }

  if (!uniqueId) {
    return res.status(400).json({
      status: "error",
      message: "Missing required field: 'uniqueId'",
    });
  }

  try {
    // Llama al servicio para actualizar estadísticas
    await statisticsService.updateStatistics({
      type,
      profileId,
      widgetId,
      uniqueId, // Asegúrate de pasar el uniqueId al servicio
    });

    return res.status(200).json({
      status: "success",
      message: "Statistics updated successfully",
    });
  } catch (error) {
    console.error("Error in handleUpdateStatistics:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update statistics",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}


export async function handleGetStatistics(req: Request, res: Response) {
  const { profileId, widgetId } = req.query; // Obtener los parámetros desde query

  // Validación de parámetros
  if (!profileId) {
    return res.status(400).json({
      status: "error",
      message: "Missing required field: 'profileId'",
    });
  }

  try {
    // Llama al servicio para obtener estadísticas
    const statistics = await statisticsService.getStatistics(profileId as string, widgetId as string);

    if (!statistics) {
      return res.status(404).json({
        status: "error",
        message: "Statistics not found for the given profileId and widgetId",
      });
    }

    return res.status(200).json({
      status: "success",
      data: statistics,
    });
  } catch (error) {
    console.error("Error in handleGetStatistics:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch statistics",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}