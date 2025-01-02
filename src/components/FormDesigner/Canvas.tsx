import { useState, useRef } from "react";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Field {
  id: string;
  type: string;
  x: number;
  y: number;
  value?: string;
}

export const Canvas = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fieldId = e.dataTransfer.getData('fieldId');
    const fieldType = e.dataTransfer.getData('fieldType');
    const rect = e.currentTarget.getBoundingClientRect();

    if (fieldId) {
      // This is a field being repositioned
      const offsetData = e.dataTransfer.getData('offset');
      const offset = offsetData ? JSON.parse(offsetData) : { x: 0, y: 0 };
      const newX = e.clientX - rect.left - offset.x;
      const newY = e.clientY - rect.top - offset.y;

      setFields(prev => prev.map(field => 
        field.id === fieldId 
          ? { ...field, x: newX, y: newY }
          : field
      ));
    } else if (fieldType) {
      // This is a new field being added
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newField: Field = {
        id: `${fieldType}-${Date.now()}`,
        type: fieldType,
        x,
        y,
        value: '',
      };

      setFields((prev) => [...prev, newField]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF file"
        });
        return;
      }

      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      toast({
        title: "PDF uploaded successfully",
        description: "Your template has been loaded"
      });
    }
  };

  const handleFieldValueChange = (id: string, value: string) => {
    setFields(prev => prev.map(field => 
      field.id === id ? { ...field, value } : field
    ));
  };

  const handlePositionChange = (id: string, x: number, y: number) => {
    setFields(prev => prev.map(field =>
      field.id === id ? { ...field, x, y } : field
    ));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 bg-canvas relative overflow-auto min-h-screen">
      <div className="fixed top-4 right-4 z-10">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf"
          className="hidden"
        />
        <Button 
          onClick={triggerFileInput}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload PDF Template
        </Button>
      </div>
      
      <div 
        className="w-[816px] h-[1056px] mx-auto my-8 bg-white shadow-lg relative"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {pdfUrl && (
          <object
            data={pdfUrl}
            type="application/pdf"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <embed src={pdfUrl} type="application/pdf" className="w-full h-full pointer-events-none" />
          </object>
        )}
        
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        
        {fields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            isSelected={selectedField === field.id}
            onClick={() => setSelectedField(field.id)}
            onValueChange={handleFieldValueChange}
            onPositionChange={handlePositionChange}
          />
        ))}
      </div>
    </div>
  );
};