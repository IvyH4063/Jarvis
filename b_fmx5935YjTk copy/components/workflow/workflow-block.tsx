"use client";

import { cn } from "@/lib/utils";
import { blockConfigs, type WorkflowBlock as WorkflowBlockType } from "@/lib/workflow-types";
import { BlockIcon } from "./block-icon";
import { GripVertical } from "lucide-react";

interface WorkflowBlockProps {
  block: WorkflowBlockType;
  isSelected: boolean;
  onClick: () => void;
}

export function WorkflowBlock({ block, isSelected, onClick }: WorkflowBlockProps) {
  const config = blockConfigs[block.type];

  return (
    <div
      onClick={onClick}
      className={cn(
        "absolute flex items-center gap-3 p-4 bg-card rounded-xl border-2 shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg group",
        isSelected
          ? "border-primary shadow-lg ring-4 ring-primary/20"
          : "border-border hover:border-primary/50"
      )}
      style={{
        left: block.position.x,
        top: block.position.y,
        minWidth: 200,
      }}
    >
      <div className="opacity-0 group-hover:opacity-50 transition-opacity cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className={cn("p-2.5 rounded-lg text-white shadow-sm", config.color)}>
        <BlockIcon icon={config.icon} className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium text-foreground">{config.title}</p>
        <p className="text-sm text-muted-foreground">{config.description}</p>
      </div>
    </div>
  );
}
