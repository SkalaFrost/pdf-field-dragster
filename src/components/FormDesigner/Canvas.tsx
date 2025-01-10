import { useEffect, useRef, useState } from "react";
import { Designer } from "@pdfme/ui";
import { Template } from "@pdfme/common";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Empty PDF base64 string (1-page blank PDF)
const EMPTY_PDF = "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgNTk1LjI4IDg0MS44OSBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooVGhpcyBpcyBhIGJsYW5rIFBERikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G";

const defaultTemplate: Template = {
  basePdf: EMPTY_PDF,
  schemas: [
    [
      {
        type: "text",
        position: { x: 0, y: 0 },
        width: 150,
        height: 20,
        alignment: "left",
        fontSize: 12,
        characterSpacing: 0,
        lineHeight: 1,
        fontName: "Helvetica",
        fontColor: "#000000",
        name: "text1"
      },
      {
        type: "checkbox",
        position: { x: 0, y: 30 },
        width: 20,
        height: 20,
        alignment: "left",
        fontSize: 12,
        characterSpacing: 0,
        lineHeight: 1,
        fontName: "Helvetica",
        fontColor: "#000000",
        name: "checkbox1"
      }
    ]
  ]
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
        template: template as Template,
        options: {
          theme: {
            token: {
              colorPrimary: '#F97316',
              borderRadius: 4,
            },
          },
        },
      });

      designerRef.current.onSaveTemplate((newTemplate: Template) => {
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
        const base64 = btoa(
          new Uint8Array(arrayBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        
        if (designerRef.current) {
          const newTemplate = {
            ...template,
            basePdf: base64,
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