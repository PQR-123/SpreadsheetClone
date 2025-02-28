import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { SheetDataSchema, insertSheetSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  app.post("/api/sheets", async (req, res) => {
    try {
      const data = insertSheetSchema.parse(req.body);
      const sheet = await storage.createSheet(data);
      res.json(sheet);
    } catch (error) {
      res.status(400).json({ error: "Invalid sheet data" });
    }
  });

  app.get("/api/sheets/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const sheet = await storage.getSheet(id);

    if (!sheet) {
      res.status(404).json({ error: "Sheet not found" });
      return;
    }

    res.json(sheet);
  });

  app.put("/api/sheets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = SheetDataSchema.parse(req.body);
      const sheet = await storage.updateSheet(id, data);
      res.json(sheet);
    } catch (error) {
      res.status(400).json({ error: "Invalid sheet data" });
    }
  });

  app.delete("/api/sheets/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteSheet(id);
    res.status(204).end();
  });

  return httpServer;
}