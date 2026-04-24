"use client";

import { useState, useCallback } from "react";
import { type BlockType, type WorkflowBlock } from "@/lib/workflow-types";
import { TopBar } from "./top-bar";
import { Sidebar } from "./sidebar";
import { Canvas } from "./canvas";
import { SettingsPanel } from "./settings-panel";

// Initial workflow for demo
const initialBlocks: WorkflowBlock[] = [
  {
    id: "block-1",
    type: "email-reader",
    title: "邮件读取器",
    description: "读取并解析收件箱邮件",
    position: { x: 60, y: 80 },
  },
  {
    id: "block-2",
    type: "ai-generator",
    title: "AI 生成器",
    description: "使用 AI 处理和生成内容",
    position: { x: 340, y: 180 },
  },
  {
    id: "block-3",
    type: "calendar",
    title: "日历调度器",
    description: "安排和管理日程事件",
    position: { x: 620, y: 80 },
  },
  {
    id: "block-4",
    type: "notification",
    title: "通知发送器",
    description: "发送通知到多个渠道",
    position: { x: 900, y: 180 },
  },
];

export function WorkflowBuilder() {
  const [blocks, setBlocks] = useState<WorkflowBlock[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  const handleAddBlock = useCallback((type: BlockType) => {
    const newBlock: WorkflowBlock = {
      id: `block-${Date.now()}`,
      type,
      title: "",
      description: "",
      position: {
        x: 60 + (blocks.length % 4) * 280,
        y: 80 + Math.floor(blocks.length / 4) * 150,
      },
    };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  }, [blocks.length]);

  const handleSelectBlock = useCallback((id: string) => {
    setSelectedBlockId(id);
  }, []);

  const handleDeleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  }, [selectedBlockId]);

  const handleDuplicateBlock = useCallback((id: string) => {
    const block = blocks.find((b) => b.id === id);
    if (block) {
      const newBlock: WorkflowBlock = {
        ...block,
        id: `block-${Date.now()}`,
        position: {
          x: block.position.x + 40,
          y: block.position.y + 40,
        },
      };
      setBlocks((prev) => [...prev, newBlock]);
      setSelectedBlockId(newBlock.id);
    }
  }, [blocks]);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    // Simulate running
    setTimeout(() => {
      setIsRunning(false);
      alert("工作流运行完成！");
    }, 2000);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar onRun={handleRun} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onAddBlock={handleAddBlock} />
        
        <Canvas
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={handleSelectBlock}
        />
        
        <SettingsPanel
          selectedBlock={selectedBlock}
          onDeleteBlock={handleDeleteBlock}
          onDuplicateBlock={handleDuplicateBlock}
        />
      </div>

      {/* Running overlay */}
      {isRunning && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-2xl shadow-2xl border border-border flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/30 rounded-full" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">正在运行工作流...</p>
              <p className="text-sm text-muted-foreground mt-1">请稍候</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
