'use client'

import  Form  from 'next/form'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { DatePicker } from './date-picker'
import { useState } from 'react'
import { recordTarget } from '@/lib/actions'
import SubmitButton from './submit-button'

export default function TargetForm() {
    const [date, setDate] = useState<Date>()

    const handleDate = (date: Date | undefined ) => {
        setDate(date)
    }

    const recordTargetWithDate = recordTarget.bind(null, date as Date )

    return (
        <Form action={recordTargetWithDate} className='border rounded-md p-3 px-4 flex flex-col space-y-4 '>
            <div>
                <Label>Set Target</Label>
                <Input required type='number' name='target' placeholder='KES'/>
            </div>
            <div>
                <Label>Target Name</Label>
                <Input required type='text' name='name' placeholder='Land Project'/>
            </div>
            <div className=' flex flex-col space-y-1'>
                <Label>Target Date</Label>
                <DatePicker  handleDate = {handleDate}/>
            </div>
            <SubmitButton text='Set target'/>
        </Form>
    )
}