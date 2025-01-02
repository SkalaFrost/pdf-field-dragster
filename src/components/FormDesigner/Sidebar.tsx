import { Square, Type, CheckSquare } from "lucide-react";

const fieldTypes = [
  { id: "text", icon: Type, label: "Text Input" },
  { id: "checkbox", icon: CheckSquare, label: "Checkbox" },
  { id: "radio", icon: Square, label: "Radio Button" },
];

export const Sidebar = () => {
  const onDragStart = (e: React.DragEvent, fieldType: string) => {
    e.dataTransfer.setData("fieldType", fieldType);
  };

  return (
    <div className="w-64 bg-sidebar text-white p-4 border-r border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Form Fields</h2>
      <div className="space-y-2">
        {fieldTypes.map((field) => (
          <div
            key={field.id}
            draggable
            onDragStart={(e) => onDragStart(e, field.id)}
            className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-md cursor-move hover:bg-gray-700 transition-colors"
          >
            <field.icon className="w-5 h-5" />
            <span>{field.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};