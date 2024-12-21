'use server'

import { db } from "@/db"
import { auth, currentUser } from "@clerk/nextjs/server"
import { endOfMonth, format } from "date-fns"

export async function getUser( ) {
    const { userId } = await auth()
    if(!userId) return

    const userDetails = await currentUser()
    if (!userDetails) return

    try {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            }
        })

        if(!user) {
            await db.user.create({
                data: {
                    id: userId,
                    email: userDetails.primaryEmailAddress?.emailAddress ?? 'no email',
                    name: userDetails.firstName,
                }
            })
        }

        return user
    } catch (error) {
        console.error(error)
    }
}

export async function getAllUsers() {
    const users = await db.user.findMany({
        select: {
            id: true,
            name: true,
            email: true
        }
    })

    let count = 0

    users.forEach((user) => (
        count++
    ))

    return { users, count }
}

export async function getGroupTargets(currentPage: number) {
    const validPage = currentPage && currentPage > 0 ? currentPage : 1;
    
    const targets = await db.groupTarget.findMany({
        skip: (validPage - 1) * 4,
        take: 4,
        orderBy: { createdAt: 'desc' }
    })

    return targets
}

export async function getGroupTargets2() {
    const targets = await db.groupTarget.findMany({
        select: {
            id: true,
            name: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return targets
}

export async function getGroupTargetsCount() {
    const count = await db.groupTarget.count({})
    return count
}

export async function getContributionsCount() {
    let totalContributions = 0
    const count = await db.contribution.count({})
    const contributions = await db.contribution.findMany({
        select: { amount: true }
    })

    contributions.forEach((contribution) => (
        totalContributions += contribution.amount
    ))

    return { count, totalContributions }
}

export async function getTransactionsCount() {
    const count = await db.transactionHistory.count({})
    return count
}


export async function getContributions(currentPage: number) {
    const contributions = await db.contribution.findMany({
        skip: (currentPage - 1) * 5,
        take: 5,
        include: {
            user: true,
            transactions: {
                include: {
                    group: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
    
    return contributions
}

export async function getGroupTargetsPages(query: string) {
    try {
        // Prepare conditions based on query input
        const whereConditions = []

        // Check if query can match enum fields (type and result)
        if (query) {
            whereConditions.push(
                { target: { equals: parseFloat(query) } }, 
            )
        }

        // Count total number of trades that match the query
        const count = await db.groupTarget.count({
            where: {
                OR: whereConditions.length > 0 ? whereConditions : undefined,
            },
        })

        // Calculate the total number of pages
        const totalPages = Math.ceil(count / 4)
        return totalPages

    } catch (error) {
        throw error;
    }
}

export async function getContributionsPages(query: string) {
    try {
        // Prepare conditions based on query input
        const whereConditions = []

        // Check if query can match enum fields (type and result)
        if (query) {
            whereConditions.push(
                { amount: { equals: parseFloat(query) } }, 
            )
        }

        // Count total number of trades that match the query
        const count = await db.contribution.count({
            where: {
                OR: whereConditions.length > 0 ? whereConditions : undefined,
            },
        })

        // Calculate the total number of pages
        const totalPages = Math.ceil(count / 5)
        return totalPages

    } catch (error) {
        throw error;
    }
}

export async function getTransactions(currentPage: number) {
    const transactions = await db.transactionHistory.findMany({
        skip: (currentPage - 1) * 12,
        take: 12,
        where: {
            id: { gt: 0 }
        },
        select: {
            id: true,
            amount: true,
            type: true,
            date: true,
            group: {select: { name: true }}
        },
        orderBy: {
            id: 'desc'
        }
    })
    
    // console.log(transactions)
    return transactions
}


export async function getTransactionPages(query: string) {
    try {
        // Prepare conditions based on query input
        const whereConditions = []

        // Check if query can match enum fields (type and result)
        if (query) {
            whereConditions.push(
                { type: { equals: query as any } }, // Cast to 'any' for enum if needed
            )
        }

        // Count total number of trades that match the query
        const count = await db.transactionHistory.count({
            where: {
                OR: whereConditions.length > 0 ? whereConditions : undefined,
            },
        })

        // Calculate the total number of pages
        const totalPages = Math.ceil(count / 12)
        return totalPages

    } catch (error) {
        throw error;
    }
}

export async function fetchContributionsForChart( month: string ) {
    const firstDayOfMonth = new Date(
        `${new Date().getFullYear()}-${month}-01 00:00:00`
    )
    const lastDayOfMonth = endOfMonth(firstDayOfMonth)

    const contributions = await db.contribution.findMany({
        where: {
            createdAt: {
                gte: firstDayOfMonth,
                lte: lastDayOfMonth
            }
        },
        select: {
            createdAt: true,
            amount: true
        }
    })

    // Group contributions by date
    const groupedContributions: { [date: string]: number } = {};

    contributions.forEach((contribution) => {
        const date = format(new Date(contribution.createdAt), 'yyyy-MM-dd'); // Group by full date
        if (!groupedContributions[date]) {
            groupedContributions[date] = 0;
        }
        groupedContributions[date] += contribution.amount; // Sum the amount for the same day
    });

    const chartData = Object.entries(groupedContributions).map(([date, amount]) => ({
        date: format(new Date(date), 'dd'), 
        amount
    }))

    return chartData
}