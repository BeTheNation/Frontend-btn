"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface LeverageSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export default function LeverageSelector({
  value,
  onChange,
}: LeverageSelectorProps) {
  const handleChange = (newValue: number[]) => {
    const roundedValue = Math.round(newValue[0]);
    onChange(roundedValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between space-x-2">
        <Button
          variant={value === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(1)}
          className="flex-1"
        >
          1x
        </Button>
        <Button
          variant={value === 2 ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(2)}
          className="flex-1"
        >
          2x
        </Button>
        <Button
          variant={value === 3 ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(3)}
          className="flex-1"
        >
          3x
        </Button>
        <Button
          variant={value === 5 ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(5)}
          className="flex-1"
        >
          5x
        </Button>
      </div>
      <div className="pt-2">
        <Slider
          value={[value]}
          min={1}
          max={5}
          step={1}
          onValueChange={handleChange}
        />
      </div>
      <div className="text-right text-sm font-medium">{value}x</div>
    </div>
  );
}
