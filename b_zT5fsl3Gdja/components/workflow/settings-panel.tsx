"use client";

import { blockConfigs, type WorkflowBlock } from "@/lib/workflow-types";
import { BlockIcon } from "./block-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Trash2, Copy, Settings2 } from "lucide-react";

interface SettingsPanelProps {
  selectedBlock: WorkflowBlock | null;
  onDeleteBlock: (id: string) => void;
  onDuplicateBlock: (id: string) => void;
}

export function SettingsPanel({ selectedBlock, onDeleteBlock, onDuplicateBlock }: SettingsPanelProps) {
  if (!selectedBlock) {
    return (
      <aside className="w-80 bg-card border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            组件设置
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-muted-foreground">
            <Settings2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>选择一个组件</p>
            <p className="text-sm mt-1">查看和编辑配置</p>
          </div>
        </div>
      </aside>
    );
  }

  const config = blockConfigs[selectedBlock.type];

  return (
    <aside className="w-80 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          组件设置
        </h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {/* Block header */}
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg mb-6">
          <div className={`p-2 rounded-lg ${config.color} text-white`}>
            <BlockIcon icon={config.icon} className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-foreground">{config.title}</p>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>

        {/* Settings fields */}
        <FieldGroup>
          {config.fields.map((field) => (
            <Field key={field.id}>
              <FieldLabel>{field.label}</FieldLabel>
              {field.type === "select" ? (
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder={field.placeholder}
                />
              ) : (
                <Input type="text" placeholder={field.placeholder} />
              )}
            </Field>
          ))}
        </FieldGroup>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onDuplicateBlock(selectedBlock.id)}
          >
            <Copy className="h-4 w-4 mr-2" />
            复制
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => onDeleteBlock(selectedBlock.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            删除
          </Button>
        </div>
      </div>
    </aside>
  );
}
