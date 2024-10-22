"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useDeleteLayers } from "@/hooks/useDeleteLayers";
import { useSelectionBounds } from "@/hooks/useSelectionBounds";
import { useMutation, useSelf } from "@/liveblocks.config";
import { Camera, Color } from "@/types/canvas";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";
import { memo, useState } from "react";
import { ColorPicker } from "./colorPicker";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((self) => self.presence.selection);
    const [strokeWidth, setStrokeWidth] = useState(1); 
    const deleteLayers = useDeleteLayers();
    const selectionBounds = useSelectionBounds();

    const handleMoveToBack = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");

        const indices: number[] = [];

        const arr = liveLayerIds.toImmutable();

        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = 0; i < indices.length; i++) {
          liveLayerIds.move(indices[i], i);
        }
      },
      [selection]
    );

    const handleMoveToFront = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");

        const indices: number[] = [];

        const arr = liveLayerIds.toImmutable();

        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
          liveLayerIds.move(
            indices[i],
            arr.length - 1 - (indices.length - 1 - i)
          );
        }
      },
      [selection]
    );
    const handleStrokeWidthChange = useMutation(
      ({ storage }, width: number) => {
        const liveLayers = storage.get("layers");

        selection.forEach((id) => {
          liveLayers.get(id)?.set("width", width);
        });
      },
      [selection]
    );
    const handleColorChange = useMutation(
      ({ storage }, fill: Color) => {
        console.log(fill)
        const liveLayers = storage.get("layers");
        setLastUsedColor(fill);

        selection.forEach((id) => {
          liveLayers.get(id)?.set("fill", fill);
        });
      },
      [selection, setLastUsedColor]
    );

    if (!selectionBounds) return null;

    return (
      <div
        className="fixed top-1/2 right-4 p-3 rounded-xl bg-white shadow-sm border flex select-none"
        style={{
          transform: "translateY(-50%)",
        }}
      >
        <ColorPicker onChange={handleColorChange} />
        <div className="flex flex-col gap-y-0.5 ml-10">
          <Hint label="Bring to front">
            <Button variant="board" size="icon" onClick={handleMoveToFront}>
              <BringToFront />
            </Button>
          </Hint>
          <Hint label="Bring to back" side="bottom">
            <Button variant="board" size="icon" onClick={handleMoveToBack}>
              <SendToBack />
            </Button>
          </Hint>
        </div>
        <div className="flex items-center pl-2 ml-2 border-l">
          <Hint label="Delete">
            <Button variant="board" size="icon" onClick={deleteLayers}>
              <Trash2 />
            </Button>
          </Hint>
        </div>
        {/* <div className="flex items-center pl-2 ml-2 border-l">
          <Hint label="Stroke Width">
            <input
              type="range"
              min="1"
              max="1000"
              value={strokeWidth}
              onChange={(e) => {
                const width = Number(e.target.value);
                setStrokeWidth(width);
                handleStrokeWidthChange(width);
              }}
            />
          </Hint>
        </div> */}
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";
