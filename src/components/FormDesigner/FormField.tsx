import { Type, CheckSquare, Square, LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Field {
  id: string;
  type: string;
  x: number;
  y: number;
  value?: string;
}

interface FormFieldProps {
  field: Field;
  isSelected: boolean;
  onClick: () => void;
  onValueChange: (id: string, value: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
}

type FieldIcons = {
  [key: string]: LucideIcon;
};

const fieldIcons: FieldIcons = {
  text: Type,
  checkbox: CheckSquare,
  radio: Square,
};

export const FormField = ({ 
  field, 
  isSelected, 
  onClick, 
  onValueChange,
  onPositionChange 
}: FormFieldProps) => {
  const Icon = fieldIcons[field.type];

  if (!Icon) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(field.id, e.target.value);
    e.stopPropagation();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('fieldId', field.id);
    // Store the mouse offset relative to the field's position
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setData('offset', JSON.stringify({ x: offsetX, y: offsetY }));
  };

  return (
    <div
      className={`absolute p-2 rounded cursor-move transition-all ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      style={{ left: field.x, top: field.y }}
      onClick={onClick}
      draggable="true"
      onDragStart={handleDragStart}
    >
      <div className="flex items-center gap-2 bg-white border rounded p-2">
        <Icon className="w-4 h-4" />
        {field.type === 'text' ? (
          <Input
            type="text"
            value={field.value || ''}
            onChange={handleInputChange}
            onClick={(e) => e.stopPropagation()}
            className="h-8 w-40"
            placeholder="Enter text..."
          />
        ) : (
          <span className="text-sm">{field.type}</span>
        )}
      </div>
    </div>
  );
};