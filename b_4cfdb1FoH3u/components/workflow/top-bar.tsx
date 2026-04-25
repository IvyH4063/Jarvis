"use client";

import { Button } from "@/components/ui/button";
import { Play, Save, Undo, Redo, Zap } from "lucide-react";

interface TopBarProps {
  onRun: () => void;
}

export function TopBar({ onRun }: TopBarProps) {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">FlowAI</span>
        </div>
        
        {/* Divider */}
        <div className="h-6 w-px bg-border" />
        
        {/* Workflow name */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">工作流:</span>
          <span className="text-sm font-medium text-foreground">邮件自动处理流程</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* History actions */}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Redo className="h-4 w-4" />
        </Button>
        
        <div className="h-6 w-px bg-border mx-2" />
        
        {/* Save */}
        <Button variant="outline" size="sm">
          <Save className="h-4 w-4 mr-2" />
          保存
        </Button>
        
        {/* Run */}
        <Button size="sm" onClick={onRun} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Play className="h-4 w-4 mr-2" />
          运行工作流
        </Button>
      </div>
    </header>
  );
}
