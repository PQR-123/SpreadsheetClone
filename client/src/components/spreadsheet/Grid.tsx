import { useCallback, useEffect, useState } from "react";
import { getCellAddress, parseCellAddress } from "@/lib/formulas";
import { useSpreadsheetStore } from "@/lib/store";
import { Input } from "@/components/ui/input";

export function Grid() {
  const { data, selectedCell, updateCell, setSelectedCell } = useSpreadsheetStore();
  const [editValue, setEditValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleCellClick = useCallback((addr: string) => {
    setSelectedCell(addr);
    setIsEditing(false);
  }, [setSelectedCell]);

  const handleCellDoubleClick = useCallback((addr: string) => {
    setSelectedCell(addr);
    setIsEditing(true);
    setEditValue(data.cells[addr]?.formula || data.cells[addr]?.value || "");
  }, [data.cells, setSelectedCell]);

  const handleCellKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!selectedCell) return;

    if (e.key === "Enter") {
      if (!isEditing) {
        setIsEditing(true);
        setEditValue(data.cells[selectedCell]?.formula || data.cells[selectedCell]?.value || "");
      } else {
        setIsEditing(false);
        updateCell(selectedCell, {
          value: editValue,
          formula: editValue.startsWith("=") ? editValue : undefined,
        });
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  }, [selectedCell, isEditing, editValue, data.cells, updateCell]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const [row, col] = parseCellAddress(selectedCell);
      
      switch (e.key) {
        case "ArrowUp":
          if (row > 0) setSelectedCell(getCellAddress(row - 1, col));
          break;
        case "ArrowDown":
          if (row < data.rowCount - 1) setSelectedCell(getCellAddress(row + 1, col));
          break;
        case "ArrowLeft":
          if (col > 0) setSelectedCell(getCellAddress(row, col - 1));
          break;
        case "ArrowRight":
          if (col < data.colCount - 1) setSelectedCell(getCellAddress(row, col + 1));
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, data.rowCount, data.colCount, setSelectedCell]);

  return (
    <div className="overflow-auto h-full">
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="w-10 h-8 bg-gray-100 border border-gray-300"></th>
            {Array.from({ length: data.colCount }).map((_, i) => (
              <th key={i} className="w-32 h-8 bg-gray-100 border border-gray-300">
                {String.fromCharCode(65 + i)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: data.rowCount }).map((_, row) => (
            <tr key={row}>
              <td className="w-10 h-8 bg-gray-100 border border-gray-300 text-center">
                {row + 1}
              </td>
              {Array.from({ length: data.colCount }).map((_, col) => {
                const addr = getCellAddress(row, col);
                const cell = data.cells[addr];
                const isSelected = addr === selectedCell;

                return (
                  <td
                    key={col}
                    className={`relative border border-gray-300 ${
                      isSelected ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleCellClick(addr)}
                    onDoubleClick={() => handleCellDoubleClick(addr)}
                  >
                    {isSelected && isEditing ? (
                      <Input
                        className="absolute inset-0 w-full h-full border-2 border-blue-500"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleCellKeyDown}
                        autoFocus
                      />
                    ) : (
                      <div
                        className={`px-2 py-1 ${cell?.style?.bold ? "font-bold" : ""} ${
                          cell?.style?.italic ? "italic" : ""
                        }`}
                        style={{
                          fontSize: cell?.style?.fontSize,
                          color: cell?.style?.color,
                        }}
                      >
                        {cell?.value || ""}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}