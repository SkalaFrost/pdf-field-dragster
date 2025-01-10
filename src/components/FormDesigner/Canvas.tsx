import { useEffect, useRef, useState } from "react";
import { Designer } from "@pdfme/ui";
import { Template } from "@pdfme/common";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const defaultTemplate: Template = {
  basePdf: null,
  schemas: [
    {
      text: { type: 'text', position: { x: 0, y: 0 }, width: 150, height: 20 },
      checkbox: { type: 'checkbox', position: { x: 0, y: 0 }, width: 20, height: 20 },
    },
  ],
};

export const Canvas = () => {
  const designerRef = useRef<Designer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<Template>(defaultTemplate);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (containerRef.current && !designerRef.current) {
      designerRef.current = new Designer({
        domContainer: containerRef.current,
        template,
        options: {
          theme: {
            token: {
              colorPrimary: '#F97316',
              borderRadius: 4,
            },
          },
        },
      });

      designerRef.current.onSaveTemplate((newTemplate) => {
        setTemplate(newTemplate);
      });
    }

    return () => {
      if (designerRef.current) {
        designerRef.current.destroy();
      }
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      try {
        const arrayBuffer = await file.arrayBuffer();
        const basePdf = await arrayBuffer;
        
        if (designerRef.current) {
          const newTemplate = {
            ...template,
            basePdf,
          };
          designerRef.current.updateTemplate(newTemplate);
          setTemplate(newTemplate);
        }

        toast({
          title: "PDF uploaded successfully",
          description: "Your template has been loaded"
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error uploading PDF",
          description: "There was an error loading your PDF file"
        });
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 bg-canvas relative overflow-hidden min-h-screen">
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
        ref={containerRef}
        className="w-full h-full"
      />
    </div>
  );
};