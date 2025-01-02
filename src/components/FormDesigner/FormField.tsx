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
}

type FieldIcons = {
  [key: string]: LucideIcon;
};

const fieldIcons: FieldIcons = {
  text: Type,
  checkbox: CheckSquare,
  radio: Square,
};

export const FormField = ({ field, isSelected, onClick, onValueChange }: FormFieldProps) => {
  const Icon = fieldIcons[field.type];

  if (!Icon) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(field.id, e.target.value);
    e.stopPropagation(); // Prevent triggering the onClick event
  };

  return (
    <div
      className={`absolute p-2 rounded cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      style={{ left: field.x, top: field.y }}
      onClick={onClick}
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