'use server'

import { db } from "@/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const targetFormSchema = z.object({
    target: z.coerce.number(),
    name: z.string()
})

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