"use client";

import { blockConfigs, type BlockType } from "@/lib/workflow-types";
import { BlockIcon } from "./block-icon";
import { GripVertical } from "lucide-react";

interface SidebarProps {
  onAddBlock: (type: BlockType) => void;
}

export function Sidebar({ onAddBlock }: SidebarProps) {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">工具组件</h2>
        <p className="text-sm text-muted-foreground mt-1">拖拽组件到画布</p>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <div className="flex flex-col gap-2">
          {Object.values(blockConfigs).map((config) => (
            <button
              key={config.type}
              onClick={() => onAddBlock(config.type)}
              className="group flex items-center gap-3 p-3 bg-secondary/50 hover:bg-secondary rounded-lg border border-transparent hover:border-border transition-all duration-200 cursor-grab active:cursor-grabbing"
            >
              <div className="opacity-0 group-hover:opacity-50 transition-opacity">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className={`p-2 rounded-lg ${config.color} text-white shadow-sm`}>
                <BlockIcon icon={config.icon} className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{config.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{config.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          点击组件添加到工作流
        </div>
      </div>
    </aside>
  );
}
