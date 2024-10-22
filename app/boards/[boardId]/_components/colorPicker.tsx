"use client";

import { useState } from "react";
import { ColorPicker as ReactColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

import { Color } from "@/types/canvas";

interface ColorPickerProps {
  onChange: (color: Color) => void;
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  const [color, setColor] = useColor( "#000000");

  const handleColorChange = (newColor: any) => {
    setColor(newColor);
    const { r, g, b } = newColor.rgb;
    onChange({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
  };
  

  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
      <ReactColorPicker height={200} color={color} onChange={handleColorChange}   />
    </div>
  );
};