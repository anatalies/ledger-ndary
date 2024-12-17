import TargetForm from "@/components/target-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getGroupTargets } from "@/lib/data";
import { differenceInDays, format, formatDistanceToNowStrict } from "date-fns";


export default async function Page() {
    const groupTargets = await getGroupTargets()
    if(!groupTargets ) return <p>cannot fetch targets!</p>
    let timeRemaining = undefined

    return (
        <div className="flex flex-col space-y-3 p-6 w-full">
            <TargetForm/>
            <Separator />
            <div className="grid md:grid-cols-4 gap-3">
                {groupTargets.map((target) => (
                    <Card key={target.id} className="border p-2 shadow-none">
                        <CardHeader className="">
                            <CardTitle>{target.name}</CardTitle>
                            <CardDescription>{formatDistanceToNowStrict(new Date(target.createdAt))}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col space-y-2">
                                <h1 className="text-lg">KES {target.target}</h1>
                                <div>
                                    <Progress value={43} className="bg-blue-100"/>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="space-x-2">
                            <CardDescription>
                              time remaining: { differenceInDays(
                                new Date(target.targetDate), new Date())} days
                            </CardDescription>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}