'use client'

import  Form  from 'next/form'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { DatePicker } from './date-picker'
import { useState } from 'react'
import { recordTarget } from '@/lib/actions'

export default function TargetForm() {
    const [date, setDate] = useState<Date>()

    const handleDate = (date: Date | undefined ) => {
        setDate(date)
    }

    return (
        <Form action={recordTarget} className='border rounded-md p-3 flex flex-col space-y-4 '>
            <div>
                <Label>Set Target</Label>
                <Input type='number' name='target' placeholder='KES'/>
            </div>
            <DatePicker  handleDate = {handleDate}/>
        </Form>
    )
}