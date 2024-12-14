'use server'

import { db } from "@/db"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"

const targetFormSchema = z.object({
    target: z.coerce.number()
})

export async function recordTarget(formData: FormData, targetDate: Date) {
    const validatedTargetFormSchema = targetFormSchema.safeParse({
        target: formData.get('target')
    })
    
    const {userId} = await auth()
    if(!validatedTargetFormSchema.success || !userId) return
    const { target } = validatedTargetFormSchema.data

    try {
        await db.groupTarget.create({
            data: {
                target: target,
                targetDate: new Date(targetDate),
                adminId: userId 
            }
        })
    } catch (error) {
        throw error
    }
}