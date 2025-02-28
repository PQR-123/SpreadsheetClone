import { Sheet, InsertSheet, SheetData } from "@shared/schema";

export interface IStorage {
  getSheet(id: number): Promise<Sheet | undefined>;
  createSheet(sheet: InsertSheet): Promise<Sheet>;
  updateSheet(id: number, data: SheetData): Promise<Sheet>;
  deleteSheet(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private sheets: Map<number, Sheet>;
  private currentId: number;

  constructor() {
    this.sheets = new Map();
    this.currentId = 1;
  }

  async getSheet(id: number): Promise<Sheet | undefined> {
    return this.sheets.get(id);
  }

  async createSheet(sheet: InsertSheet): Promise<Sheet> {
    const id = this.currentId++;
    const newSheet = { ...sheet, id };
    this.sheets.set(id, newSheet);
    return newSheet;
  }

  async updateSheet(id: number, data: SheetData): Promise<Sheet> {
    const sheet = await this.getSheet(id);
    if (!sheet) throw new Error("Sheet not found");

    const updatedSheet = {
      ...sheet,
      data,
    };
    this.sheets.set(id, updatedSheet);
    return updatedSheet;
  }

  async deleteSheet(id: number): Promise<void> {
    this.sheets.delete(id);
  }
}

export const storage = new MemStorage();
