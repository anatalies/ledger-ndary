import ContributionForm from "@/components/contribution-form";
import { getContributions } from "@/lib/data";
import { formatDistanceToNowStrict } from "date-fns";

export default async function Page() {
    const contributions = await getContributions()
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
            </div>
        </div>
   ) 
}