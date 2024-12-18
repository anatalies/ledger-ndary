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

export async function getGroupTargets() {
    const targets = await db.groupTarget.findMany({
        where: {
            id: { gt: 0 }
        }
    })

    return targets
}

export async function getContributions() {
    const contributions = await db.contribution.findMany({
        include: {
            user: true,
            transactions: {
                include: {
                    group: true
                }
            }
        }
    })

    // console.log(contributions)
    return contributions
}
