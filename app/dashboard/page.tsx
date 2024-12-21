import { ContributionsChart } from "@/components/contribution-chart"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllUsers, getContributionsCount, getGroupTargetsCount, getTransactionsCount } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { Ellipsis } from "lucide-react"
import Link from "next/link"

export default async function DashBoard() {
    const [
        user, 
        targetsCount, 
        contributionsCount, 
        transactionsCount,
        users
    ] = await Promise.all([
        currentUser(),
        getGroupTargetsCount(),
        getContributionsCount(),
        getTransactionsCount(),
        getAllUsers()
    ])

    return (
        <div className="flex flex-col space-y-6 p-6">
            {/* <Link href={'/dashboard/create'} className="border-2 border-gray-500/25 rounded bg-slate-50  p-8 flex space-x-2 hover:border-blue-300 hover:shadow-md transition">
                <h1 className="">Set New Target</h1>
                <CalendarCog/>
            </Link> */}
            <div className="flex justify-between">
                <h1>Jambo <span className="bg-gradient-to-r font-semibold bg-clip-text from-violet-600 to-pink-600 text-transparent drop-shadow">{user?.firstName}</span></h1>
                <UserButton/>
            </div>
            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                    <Link href={'/dashboard/create'}>
                        <Card className="bg-violet-400 border-gray-400">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{targetsCount}</CardTitle>
                                        <CardDescription className="text-black">Group Targets</CardDescription>
                                    </div>
                                    <Ellipsis />
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href={'/dashboard/contributions'}>
                        <Card className="bg-pink-400 border-gray-400">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{formatCurrency(contributionsCount.totalContributions)}</CardTitle>
                                        <CardDescription className="text-black">Total Contribution</CardDescription>
                                    </div>
                                    <Ellipsis />
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Link href={'/dashboard/transactions'}>
                        <Card className="bg-orange-400 border-gray-400">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{transactionsCount}</CardTitle>
                                        <CardDescription className="text-black">Transactions</CardDescription>
                                    </div>
                                    <Ellipsis />
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Card className="bg-emerald-400 border-gray-400">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">{users.count}</CardTitle>
                                    <CardDescription className="text-black">Users</CardDescription>
                                </div>
                                <Ellipsis />
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            </div>
            <ContributionsChart />
        </div>
    )
}