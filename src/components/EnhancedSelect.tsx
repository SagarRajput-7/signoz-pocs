import React, { useState, useEffect, useRef } from "react";

interface EnhancedSelectProps {
  options: string[];
  placeholder?: string;
  onApplySelection?: (value?: string) => void;
  className?: string;
}

export const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  options,
  placeholder = "Search...",
  onApplySelection,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update filtered options whenever the search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredOptions(options);
      return;
    }

    const regex = new RegExp(searchTerm, "i");
    const matches = options.filter((opt) => regex.test(opt));
    const nonMatches = options.filter((opt) => !regex.test(opt));

    setFilteredOptions([...matches, ...nonMatches]);
  }, [searchTerm, options]);

  const applySelection = (value?: string, isCustom: boolean = false) => {
    if (value === undefined) {
      setSearchTerm(value);
      setShowDropdown(false);
      setSelectedIndex(null);
      onApplySelection?.(value);
      return;
    }
    if (isCustom && value.trim() !== "" && !customOptions.includes(value)) {
      setCustomOptions([value]);
    }

    setSearchTerm(value);
    setShowDropdown(false);
    setSelectedIndex(null);
    onApplySelection?.(value);
  };

  useEffect(() => {
    if (searchTerm) {
      setCustomOptions([searchTerm]);
    }
  }, [searchTerm]);

  const applySelectionOnActions = () => {
    const allOptions = [...filteredOptions, ...customOptions];
    if (selectedIndex !== null) {
      applySelection(allOptions[selectedIndex]);
    } else if (
      searchTerm &&
      searchTerm?.trim() !== "" &&
      !filteredOptions.includes(searchTerm)
    ) {
      applySelection(searchTerm, true);
    } else {
      applySelection(undefined);
    }
  };

  // Close dropdown on outside click and apply selection correctly
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (showDropdown) {
          // Only apply selection if a valid selection was made
          if (selectedIndex !== null) {
            const allOptions = [...filteredOptions, ...customOptions];
            applySelection(allOptions[selectedIndex]);
          } else if (
            searchTerm &&
            searchTerm.trim() !== "" &&
            !filteredOptions.includes(searchTerm)
          ) {
            // If search term exists and is not in filtered options, treat it as a custom entry
            applySelection(searchTerm, true);
          }
        }

        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showDropdown, selectedIndex, filteredOptions, customOptions, searchTerm]);

  const renderOption = (option: string, isCustom?: boolean) => {
    const highlightMatch = (text: string) => {
      const regex = new RegExp(searchTerm || "", "i");
      const parts = text.split(regex);
      const match = text.match(regex)?.[0] || "";

      return (
        <>
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {i < parts.length - 1 && (
                <span className="font-bold text-blue-500">{match}</span>
              )}
            </React.Fragment>
          ))}
        </>
      );
    };

    return (
      <div
        key={option}
        className={`cursor-pointer px-3 py-2 hover:bg-gray-100 ${
          isCustom ? "italic text-gray-500" : ""
        } ${
          selectedIndex === getIndexForOption(option, isCustom)
            ? "bg-blue-100"
            : ""
        }`}
        onClick={() => applySelection(option, isCustom)}
      >
        {highlightMatch(option)}
      </div>
    );
  };

  // Helper function to get the correct index across both lists
  const getIndexForOption = (option: string, isCustom?: boolean) => {
    if (isCustom) {
      return filteredOptions.length + customOptions.indexOf(option);
    }
    return filteredOptions.indexOf(option);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allOptions = [...filteredOptions, ...customOptions];

    if (e.key === "Enter" || e.key === "Escape") {
      applySelectionOnActions();
    } else if (e.key === "ArrowDown") {
      if (selectedIndex === null || selectedIndex === allOptions.length - 1) {
        setSelectedIndex(0);
      } else {
        setSelectedIndex(selectedIndex + 1);
      }
    } else if (e.key === "ArrowUp") {
      if (selectedIndex === null || selectedIndex === 0) {
        setSelectedIndex(allOptions.length - 1);
      } else {
        setSelectedIndex(selectedIndex - 1);
      }
    }
  };

  const handleInputClick = () => {
    if (!showDropdown) {
      setShowDropdown(true);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          value={searchTerm}
          placeholder={placeholder}
          className="w-full border border-gray-300 bg-white rounded-md px-4 py-2 pr-10 text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onClick={handleInputClick}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!showDropdown) {
              setShowDropdown(true);
            }
          }}
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <button
            className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 bg-transparent p-1 rounded-full"
            onClick={() => setSearchTerm("")}
            aria-label="Clear input"
          >
            ✕
          </button>
        )}
      </div>
      {showDropdown && (
        <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-2 max-h-60 overflow-y-auto border border-gray-200">
          {filteredOptions.length > 0 && (
            <div>
              {filteredOptions.map((option) => (
                <div key={option}>{renderOption(option)}</div>
              ))}
            </div>
          )}

          {searchTerm &&
            !filteredOptions
              .map((item) => item.toLowerCase())
              .includes(searchTerm.toLowerCase()) && (
              <>
                <div className="my-2 border-t border-gray-300" />
                <div className="text-sm text-gray-500 px-3 py-2">
                  Manually Added Options:
                </div>
                {renderOption(searchTerm, true)}
              </>
            )}
        </div>
      )}
    </div>
  );
};
