"use client";

import { Check } from "lucide-react";
import { useState } from "react";

interface CustomCheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  className = "",
}: CustomCheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleClick = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onCheckedChange) {
      onCheckedChange(newCheckedState);
    }
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      className={`
        h-4 w-4 rounded border border-black 
        flex items-center justify-center
        ${isChecked ? "bg-blue-900" : "bg-white"}
        ${className}
      `}
      onClick={handleClick}
    >
      {isChecked && <Check className="h-3 w-3 text-white" />}
    </button>
  );
}
