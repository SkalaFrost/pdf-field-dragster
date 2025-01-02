import { Sidebar } from "@/components/FormDesigner/Sidebar";
import { Canvas } from "@/components/FormDesigner/Canvas";
import { PropertyPanel } from "@/components/FormDesigner/PropertyPanel";

const Index = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Canvas />
      <PropertyPanel />
    </div>
  );
};

export default Index;