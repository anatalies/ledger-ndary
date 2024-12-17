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

export async function getGroupTargets() {
    const {userId} = await auth()

    const targets = await db.groupTarget.findMany({
        where: {
            id: { gt: 0 }
        }
    })

    return targets
}
