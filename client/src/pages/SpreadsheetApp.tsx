import { Grid } from "@/components/spreadsheet/Grid";
import { Toolbar } from "@/components/spreadsheet/Toolbar";
import { FormulaBar } from "@/components/spreadsheet/FormulaBar";

export default function SpreadsheetApp() {
  return (
    <div className="flex flex-col h-screen">
      <Toolbar />
      <FormulaBar />
      <div className="flex-1 overflow-hidden">
        <Grid />
      </div>
    </div>
  );
}
