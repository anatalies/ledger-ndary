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