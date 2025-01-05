import { Type, CheckSquare, Square, LucideIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Resizable } from "re-resizable";

interface Field {
  id: string;
  type: string;
  x: number;
  y: number;
  value?: string;
  width?: number;
  height?: number;
}

interface FormFieldProps {
  field: Field;
  isSelected: boolean;
  onClick: () => void;
  onValueChange: (id: string, value: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  onResize: (id: string, width: number, height: number) => void;
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
  onPositionChange,
  onDelete,
  onResize
}: FormFieldProps) => {
  const Icon = fieldIcons[field.type];

  if (!Icon) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(field.id, e.target.value);
    e.stopPropagation();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('fieldId', field.id);
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setData('offset', JSON.stringify({ x: offsetX, y: offsetY }));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(field.id);
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
      <Resizable
        size={{ 
          width: field.width || 200, 
          height: field.height || 'auto' 
        }}
        onResizeStop={(e, direction, ref, d) => {
          onResize(
            field.id, 
            (field.width || 200) + d.width, 
            (field.height || 40) + d.height
          );
        }}
        minWidth={150}
        minHeight={40}
      >
        <div className="relative flex items-center gap-2 bg-white border rounded p-2 w-full h-full">
          <button
            onClick={handleDelete}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
          <Icon className="w-4 h-4 shrink-0" />
          {field.type === 'text' ? (
            <Input
              type="text"
              value={field.value || ''}
              onChange={handleInputChange}
              onClick={(e) => e.stopPropagation()}
              className="h-8 w-full"
              placeholder="Enter text..."
            />
          ) : (
            <span className="text-sm">{field.type}</span>
          )}
        </div>
      </Resizable>
    </div>
  );
};