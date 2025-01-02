import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PropertyPanel = () => {
  return (
    <div className="w-64 border-l border-gray-200 p-4 bg-white">
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Select a field to edit its properties
          </p>
        </CardContent>
      </Card>
    </div>
  );
};