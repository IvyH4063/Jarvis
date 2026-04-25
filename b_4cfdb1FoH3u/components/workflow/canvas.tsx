"use client";

import { type WorkflowBlock as WorkflowBlockType } from "@/lib/workflow-types";
import { WorkflowBlock } from "./workflow-block";

interface CanvasProps {
  blocks: WorkflowBlockType[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
}

export function Canvas({ blocks, selectedBlockId, onSelectBlock }: CanvasProps) {
  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Grid background pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)
          `,
          backgroundSize: "24px 24px",
        }}
      />
      
      {/* Connection lines SVG */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="currentColor"
              className="text-primary/60"
            />
          </marker>
        </defs>
        
        {/* Draw connection lines between consecutive blocks */}
        {blocks.slice(0, -1).map((block, index) => {
          const nextBlock = blocks[index + 1];
          const startX = block.position.x + 220;
          const startY = block.position.y + 40;
          const endX = nextBlock.position.x;
          const endY = nextBlock.position.y + 40;
          
          const midX = (startX + endX) / 2;
          
          return (
            <g key={`connection-${block.id}`}>
              <path
                d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="8,4"
                className="text-primary/40"
                markerEnd="url(#arrowhead)"
              />
              {/* Animated dot along path */}
              <circle r="4" className="fill-primary/60">
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  path={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                />
              </circle>
            </g>
          );
        })}
      </svg>
      
      {/* Workflow blocks */}
      {blocks.map((block) => (
        <WorkflowBlock
          key={block.id}
          block={block}
          isSelected={selectedBlockId === block.id}
          onClick={() => onSelectBlock(block.id)}
        />
      ))}
      
      {/* Empty state */}
      {blocks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-muted-foreground text-lg">从左侧拖拽组件开始构建工作流</div>
            <p className="text-sm text-muted-foreground/60 mt-2">或点击组件添加到画布</p>
          </div>
        </div>
      )}
    </div>
  );
}
