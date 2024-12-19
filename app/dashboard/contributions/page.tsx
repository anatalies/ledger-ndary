import ContributionForm from "@/components/contribution-form";
import Pagination from "@/components/pagination";
import { getContributions, getContributionsPages } from "@/lib/data";
import { formatDistanceToNowStrict } from "date-fns";

export default async function Page(
    props: {searchParams? : Promise<{
        query?: string,
        page?: string
    }>}
) {
    const searchParams = await props.searchParams
    const query =  searchParams?.query  || ''
    const currentPage = Number(searchParams?.page) || 1
    const [contributions, totalPages] = await Promise.all([
        getContributions(currentPage),
        getContributionsPages(query)
    ])

    return (
        <div className="flex flex-col space-y-6 p-6 w-full">
            <ContributionForm />
            <h1 className="font-semibold drop-shadow">Contributions</h1>
            <div className="flex flex-col">
                {contributions.map((contribution) => (
                    <div key={contribution.id} className="border-b flex justify-between p-1">
                        <p>Kshs {contribution.amount}</p>
                        <p>{contribution.user.name}</p>
                        {contribution.transactions.map((transaction) => (
                            <div key={transaction.group.id}>
                                <p>{transaction.group.name}</p>
                            </div>
                        ))}
                        <p>{formatDistanceToNowStrict(contribution.createdAt)}</p>
                    </div>
                ))}
                <Pagination totalPages={totalPages} />
            </div>
        </div>
   ) 
}