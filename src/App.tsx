import { useState } from "react";
import "./App.css";
import { EnhancedSelect } from "./components/EnhancedSelect";
import { optionsData } from "./data/single-select-data";

function App() {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  );
  return (
    <div className="flex flex-col items-center h-screen">
      <header className="w-full text-center py-4 bg-gray-100 shadow-md">
        <h1 className="text-2xl font-bold">SigNoz POCs</h1>
      </header>
      <div className="flex-grow flex items-center justify-center flex-col">
        <h3 className="text-xl font-semibold mb-4">Single Select</h3>
        <EnhancedSelect
          options={optionsData}
          placeholder="Search or select..."
          onApplySelection={(value) => {
            console.log("Selected:", value);
            setSelectedValue(value);
          }}
        />
        <h3 className="text-xl font-semibold mt-8 mb-4">{`Selected: ${selectedValue}`}</h3>
      </div>
    </div>
  );
}

export default App;
