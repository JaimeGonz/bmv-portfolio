import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

function App() {
  return (
    <div className="p-8">
      <Card className="w-64">
        <CardHeader>
          <CardTitle>BMV Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Agregar posición</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
