import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sheets = pgTable("sheets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  data: jsonb("data").notNull(),
});

export const CellValueSchema = z.object({
  value: z.string().optional(),
  formula: z.string().optional(),
  style: z.object({
    bold: z.boolean().optional(),
    italic: z.boolean().optional(),
    fontSize: z.number().optional(),
    color: z.string().optional(),
  }).optional(),
});

export const SheetDataSchema = z.object({
  cells: z.record(z.string(), CellValueSchema),
  rowCount: z.number(),
  colCount: z.number(),
});

export const insertSheetSchema = createInsertSchema(sheets);

export type InsertSheet = z.infer<typeof insertSheetSchema>;
export type Sheet = typeof sheets.$inferSelect;
export type CellValue = z.infer<typeof CellValueSchema>;
export type SheetData = z.infer<typeof SheetDataSchema>;
