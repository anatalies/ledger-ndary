import { CalendarCog } from "lucide-react"
import Link from "next/link"

export default function DashBoard() {
    return (
        <div className="flex flex-col space-y-4 p-6">
            <Link href={'/dashboard/create'} className="border-2 border-gray-500/25 rounded bg-slate-50  p-8 flex space-x-2 hover:border-blue-300 hover:shadow-md transition">
                <h1 className="">Set New Target</h1>
                <CalendarCog/>
            </Link>
        </div>
    )
}