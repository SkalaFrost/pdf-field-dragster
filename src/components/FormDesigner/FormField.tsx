import { Type, CheckSquare, Square } from "lucide-react";

interface Field {
  id: string;
  type: string;
  x: number;
  y: number;
}

interface FormFieldProps {
  field: Field;
  isSelected: boolean;
  onClick: () => void;
}

const fieldIcons = {
  text: Type,
  checkbox: CheckSquare,
  radio: Square,
};

export const FormField = ({ field, isSelected, onClick }: FormFieldProps) => {
  const Icon = fieldIcons[field.type as keyof typeof fieldIcons];

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
        <span className="text-sm">{field.type}</span>
      </div>
    </div>
  );
};