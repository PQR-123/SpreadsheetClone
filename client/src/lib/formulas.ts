import { evaluate } from "mathjs";
import { CellValue } from "@shared/schema";

type CellMap = Record<string, CellValue>;

export function getCellAddress(row: number, col: number): string {
  const colLetter = String.fromCharCode(65 + col);
  return `${colLetter}${row + 1}`;
}

export function parseCellAddress(address: string): [number, number] {
  const col = address.match(/[A-Z]+/)?.[0];
  const row = address.match(/\d+/)?.[0];
  if (!col || !row) throw new Error("Invalid cell address");
  return [parseInt(row) - 1, col.charCodeAt(0) - 65];
}

export function evaluateFormula(formula: string, cells: CellMap): string {
  try {
    if (!formula.startsWith("=")) return formula;

    let expression = formula.substring(1);
    
    // Handle built-in functions
    const functions = {
      SUM: (range: string) => {
        const values = getCellRange(range, cells);
        return values.reduce((sum, v) => sum + (Number(v) || 0), 0);
      },
      AVERAGE: (range: string) => {
        const values = getCellRange(range, cells);
        const sum = values.reduce((s, v) => s + (Number(v) || 0), 0);
        return sum / values.length;
      },
      MAX: (range: string) => {
        const values = getCellRange(range, cells);
        return Math.max(...values.map(v => Number(v) || 0));
      },
      MIN: (range: string) => {
        const values = getCellRange(range, cells);
        return Math.min(...values.map(v => Number(v) || 0));
      },
      COUNT: (range: string) => {
        const values = getCellRange(range, cells);
        return values.filter(v => !isNaN(Number(v))).length;
      },
      TRIM: (text: string) => text.trim(),
      UPPER: (text: string) => text.toUpperCase(),
      LOWER: (text: string) => text.toLowerCase()
    };

    // Replace cell references with values
    expression = expression.replace(/[A-Z]+\d+/g, (match) => {
      const value = cells[match]?.value || "0";
      return isNaN(Number(value)) ? `"${value}"` : value;
    });

    // Handle function calls
    Object.entries(functions).forEach(([name, func]) => {
      expression = expression.replace(
        new RegExp(`${name}\\((.*?)\\)`, "g"),
        (_, args) => String(func(args))
      );
    });

    return String(evaluate(expression));
  } catch (error) {
    return "#ERROR";
  }
}

function getCellRange(range: string, cells: CellMap): string[] {
  const [start, end] = range.split(":");
  if (!end) return [cells[start]?.value || ""];

  const [startRow, startCol] = parseCellAddress(start);
  const [endRow, endCol] = parseCellAddress(end);

  const values: string[] = [];
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const addr = getCellAddress(row, col);
      values.push(cells[addr]?.value || "");
    }
  }
  return values;
}
