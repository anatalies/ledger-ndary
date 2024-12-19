import Pagination from "@/components/pagination"
import { getTransactionPages, getTransactions } from "@/lib/data"
import { formatDistanceToNowStrict } from "date-fns"

export default async function Transactions(
    props: {searchParams? : Promise<{
        query?: string,
        page?: string
    }>}
) {
    const searchParams = await props.searchParams
    const query =  searchParams?.query  || ''
    const currentPage = Number(searchParams?.page) || 1
    const [transactions,totalPages] = await Promise.all([
        getTransactions(currentPage),
        getTransactionPages(query)
    ])

    return (
        <div className="p-6 flex flex-col">
            {transactions.map((transaction) => (
                <div key={transaction.id} className="flex border-b p-1.5 justify-between">
                    <p>{(transaction.type).toLowerCase()}</p>
                    <p className="flex justify-start">{transaction.amount}</p>
                    <p>{transaction.group.name}</p>
                    <p>{formatDistanceToNowStrict(transaction.date)}</p>
                </div>
            ))}
            <Pagination totalPages={totalPages} />
        </div>
    )
}