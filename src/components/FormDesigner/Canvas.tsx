import { useState } from "react";
import { FormField } from "./FormField";

interface Field {
  id: string;
  type: string;
  x: number;
  y: number;
}

export const Canvas = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData("fieldType");
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newField: Field = {
      id: `${fieldType}-${Date.now()}`,
      type: fieldType,
      x,
      y,
    };

    setFields((prev) => [...prev, newField]);
  };

  return (
    <div 
      className="flex-1 bg-canvas relative overflow-auto min-h-screen"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="w-[816px] h-[1056px] mx-auto my-8 bg-white shadow-lg relative">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        
        {fields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            isSelected={selectedField === field.id}
            onClick={() => setSelectedField(field.id)}
          />
        ))}
      </div>
    </div>
  );
};