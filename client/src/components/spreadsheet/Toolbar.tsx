import { Button } from "@/components/ui/button";
import { useSpreadsheetStore } from "@/lib/store";
import { parseCellAddress } from "@/lib/formulas";
import { CellValue } from "@shared/schema";
import { 
  Bold, Italic, Plus, Trash2,
  Type, FileUp, FileDown
} from "lucide-react";

export function Toolbar() {
  const { selectedCell, updateCell, data, addRow, addColumn, deleteRow, deleteColumn } = useSpreadsheetStore();

  const toggleStyle = (style: keyof Required<CellValue>["style"]) => {
    if (!selectedCell) return;
    
    const currentStyle = data.cells[selectedCell]?.style || {};
    updateCell(selectedCell, {
      style: {
        ...currentStyle,
        [style]: !currentStyle[style],
      },
    });
  };

  const handleFontSize = (increment: number) => {
    if (!selectedCell) return;
    
    const currentStyle = data.cells[selectedCell]?.style || {};
    const currentSize = currentStyle.fontSize || 14;
    
    updateCell(selectedCell, {
      style: {
        ...currentStyle,
        fontSize: currentSize + increment,
      },
    });
  };

  const [selectedRow, selectedCol] = selectedCell 
    ? parseCellAddress(selectedCell)
    : [-1, -1];

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => toggleStyle("bold")}
        disabled={!selectedCell}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => toggleStyle("italic")}
        disabled={!selectedCell}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleFontSize(-1)}
        disabled={!selectedCell}
      >
        <Type className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleFontSize(1)}
        disabled={!selectedCell}
      >
        <Type className="h-5 w-5" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <Button
        variant="ghost"
        size="icon"
        onClick={addRow}
      >
        <Plus className="h-4 w-4" />
        <FileDown className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={addColumn}
      >
        <Plus className="h-4 w-4" />
        <FileUp className="h-4 w-4 rotate-90" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteRow(selectedRow)}
        disabled={selectedRow === -1}
      >
        <Trash2 className="h-4 w-4" />
        <FileDown className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteColumn(selectedCol)}
        disabled={selectedCol === -1}
      >
        <Trash2 className="h-4 w-4" />
        <FileUp className="h-4 w-4 rotate-90" />
      </Button>
    </div>
  );
}