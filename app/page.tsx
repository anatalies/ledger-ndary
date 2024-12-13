import TargetForm from "@/components/target-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/data";

export default async function Home() {
  const user = await getUser()
  return (
    <div className="w-dvw h-dvh p-6 flex flex-col space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Target</CardTitle>
        </CardHeader>
        <CardContent>
          <CardTitle>500</CardTitle>
        </CardContent>
      </Card>
      <TargetForm />
    </div>
  );
}
