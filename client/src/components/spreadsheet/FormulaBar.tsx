import { Input } from "@/components/ui/input";
import { useSpreadsheetStore } from "@/lib/store";

export function FormulaBar() {
  const { selectedCell, data, updateCell } = useSpreadsheetStore();
  
  const handleFormulaChange = (value: string) => {
    if (!selectedCell) return;
    
    updateCell(selectedCell, {
      value: value,
      formula: value.startsWith("=") ? value : undefined,
    });
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <div className="flex-shrink-0 w-10 font-mono">
        {selectedCell || ""}
      </div>
      <Input
        value={selectedCell ? (data.cells[selectedCell]?.formula || data.cells[selectedCell]?.value || "") : ""}
        onChange={(e) => handleFormulaChange(e.target.value)}
        placeholder="Enter a value or formula (start with =)"
        disabled={!selectedCell}
      />
    </div>
  );
}
