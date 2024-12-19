import TargetForm from "@/components/target-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getGroupTargets } from "@/lib/data";
import { differenceInDays, format, formatDistanceToNowStrict } from "date-fns";


export default async function Page() {
    const groupTargets = await getGroupTargets()
    if(!groupTargets ) return <p>cannot fetch targets!</p>

    return (
        <div className="flex flex-col space-y-6 p-6 w-full">
            <TargetForm/>
            <h1 className="font-semibold drop-shadow">Targets</h1>
            <div className="grid md:grid-cols-4 gap-3">
                {groupTargets.map((target) => (
                    <Card key={target.id} className="border p-2 shadow-none">
                        <CardHeader className="">
                            <div className="flex items-center justify-between">
                                <CardTitle>{target.name}</CardTitle>
                                <CardDescription>{formatDistanceToNowStrict(new Date(target.createdAt))}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col space-y-2 px-2">
                                <div className="flex justify-between">
                                    <h1 className="">KES {target.progress}</h1>
                                    { Math.round((target.progress / target.target ) * 100) }%
                                </div>
                                <div>
                                    <Progress value={(target.progress / target.target ) * 100} className="bg-blue-100"/>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-between">
                            <CardDescription>
                              Remaining: { differenceInDays(
                                new Date(target.targetDate), new Date())} days
                            </CardDescription>
                            <CardDescription>Target:{target.target}</CardDescription>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}