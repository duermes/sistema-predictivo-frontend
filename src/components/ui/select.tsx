"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  values: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  values,
  onValuesChange,
  placeholder = "Seleccionar...",
  disabled = false,
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter((option) =>
    values.includes(option.value)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    // Toggle selection
    if (values.includes(optionValue)) {
      onValuesChange(values.filter((value) => value !== optionValue));
    } else {
      onValuesChange([...values, optionValue]);
    }
  };

  const removeValue = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from opening
    onValuesChange(values.filter((value) => value !== optionValue));
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={cn("relative w-full", className)} ref={selectRef}>
      <div
        onClick={toggleDropdown}
        className={cn(
          "flex items-center flex-wrap min-h-[38px] w-full px-3 py-2 text-left bg-white border rounded-md",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-gray-50",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOptions.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
              >
                <span>{option.label}</span>
                <button
                  type="button"
                  onClick={(e) => removeValue(option.value, e)}
                  className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <div className="ml-auto">
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "transform rotate-180"
            )}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1" role="listbox" aria-multiselectable="true">
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={values.includes(option.value)}
                className={cn(
                  "px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center",
                  values.includes(option.value) && "bg-blue-50 text-blue-900"
                )}
                onClick={() => handleSelect(option.value)}
              >
                <div
                  className={cn(
                    "w-4 h-4 border rounded mr-2 flex items-center justify-center",
                    values.includes(option.value)
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  )}
                >
                  {values.includes(option.value) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
