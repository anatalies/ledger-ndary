'use server'

import { db } from "@/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const targetFormSchema = z.object({
    target: z.coerce.number(),
    name: z.string()
})

const contributionFormSchema = z.object({
    userId: z.string(),
    groupTargetId: z.coerce.number(),
    amount: z.coerce.number()
})

export async function recordContribution(formData: FormData) {
    const validatedContributionFormSchema = contributionFormSchema.safeParse({
        userId: formData.get('userId'),
        groupTargetId: formData.get('groupTargetId'),
        amount: formData.get('amount')
    })

    if (!validatedContributionFormSchema.success) return

    const {userId, groupTargetId, amount } = validatedContributionFormSchema.data
    
    // create contribution record
    const contribution = await db.contribution.create({
        data: {
            userId: userId,
            groupTargetId: groupTargetId,
            amount: amount
        }
    })

    await Promise.all([
        // update group target
        db.groupTarget.update({
            where: { id: groupTargetId },
            data: {
                progress: { increment: amount }
            }
        }),

        // record transaction in the history
        db.transactionHistory.create({
            data: {
                type: 'CONTRIBUTION',
                amount: amount,
                userId: userId,
                groupId: groupTargetId,
                contributionId: contribution.id
            }
        })
    ])

    // TODO: CHECK IF GROUP TARGET IS REACHED
    revalidatePath('/dashboard/contributions')
}

export async function recordTarget(targetDate: Date, formData: FormData) {
    const validatedTargetFormSchema = targetFormSchema.safeParse({
        target: formData.get('target'),
        name: formData.get('name')
    })
    
    const {userId} = await auth()
    if(!validatedTargetFormSchema.success || !userId) return
    const { target, name } = validatedTargetFormSchema.data

    try {
        await db.groupTarget.create({
            data: {
                target: target,
                name: name,
                targetDate: new Date(targetDate),
                adminId: userId 
            }
        })

        revalidatePath('/dashboard/create')
    } catch (error) {
        throw error
    }
}