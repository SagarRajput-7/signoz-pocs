import "./App.css";
import { EnhancedSelect } from "./components/EnhancedSelect";

function App() {
  return (
    <>
      <h1>Vite + React</h1>
      <div>
        <EnhancedSelect
          options={["Option 1", "Option 2", "Custom Option"]}
          placeholder="Search or select..."
          onApplySelection={(value) => console.log("Selected:", value)}
        />
      </div>
    </>
  );
}

export default App;
