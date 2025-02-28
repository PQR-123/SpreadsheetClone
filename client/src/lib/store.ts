import { create } from "zustand";
import { CellValue, SheetData } from "@shared/schema";
import { evaluateFormula, parseCellAddress } from "./formulas";

interface SpreadsheetState {
  data: SheetData;
  selectedCell: string | null;
  copyCell: CellValue | null;
  setSelectedCell: (cell: string | null) => void;
  updateCell: (addr: string, value: Partial<CellValue>) => void;
  setCopyCell: (cell: CellValue | null) => void;
  addRow: () => void;
  addColumn: () => void;
  deleteRow: (index: number) => void;
  deleteColumn: (index: number) => void;
}

export const useSpreadsheetStore = create<SpreadsheetState>((set, get) => ({
  data: {
    cells: {},
    rowCount: 50,
    colCount: 26,
  },
  selectedCell: null,
  copyCell: null,

  setSelectedCell: (cell) => set({ selectedCell: cell }),
  
  setCopyCell: (cell) => set({ copyCell: cell }),

  updateCell: (addr, value) => {
    set((state) => {
      const newCells = { ...state.data.cells };
      
      newCells[addr] = {
        ...newCells[addr],
        ...value,
      };

      // Recalculate dependent cells
      Object.entries(newCells).forEach(([cellAddr, cell]) => {
        if (cell.formula?.includes(addr)) {
          newCells[cellAddr] = {
            ...cell,
            value: evaluateFormula(cell.formula, newCells),
          };
        }
      });

      return {
        data: {
          ...state.data,
          cells: newCells,
        },
      };
    });
  },

  addRow: () => set((state) => ({
    data: {
      ...state.data,
      rowCount: state.data.rowCount + 1,
    },
  })),

  addColumn: () => set((state) => ({
    data: {
      ...state.data,
      colCount: state.data.colCount + 1,
    },
  })),

  deleteRow: (index) => set((state) => {
    const newCells = { ...state.data.cells };
    
    // Remove cells in the deleted row
    Object.keys(newCells).forEach((addr) => {
      const [row] = parseCellAddress(addr);
      if (row === index) {
        delete newCells[addr];
      }
    });

    return {
      data: {
        ...state.data,
        cells: newCells,
        rowCount: state.data.rowCount - 1,
      },
    };
  }),

  deleteColumn: (index) => set((state) => {
    const newCells = { ...state.data.cells };
    
    // Remove cells in the deleted column
    Object.keys(newCells).forEach((addr) => {
      const [, col] = parseCellAddress(addr);
      if (col === index) {
        delete newCells[addr];
      }
    });

    return {
      data: {
        ...state.data,
        cells: newCells,
        colCount: state.data.colCount - 1,
      },
    };
  }),
}));