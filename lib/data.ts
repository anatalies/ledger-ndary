'use server'

import { db } from "@/db"
import { auth, currentUser } from "@clerk/nextjs/server"

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

    return users
}

export async function getGroupTargets(currentPage: number) {
    const validPage = currentPage && currentPage > 0 ? currentPage : 1;
    
    const targets = await db.groupTarget.findMany({
        skip: (validPage - 1) * 3,
        take: 3,
        orderBy: { createdAt: 'desc' }
    })

    return targets
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
        const totalPages = Math.ceil(count / 3)
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