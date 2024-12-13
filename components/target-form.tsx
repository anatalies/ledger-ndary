import  Form  from 'next/form'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { CalendarS } from './calendar'

export default function TargetForm() {
    return (
        <Form action={''} className='border rounded p-3'>
            <div>
                <Label>Set Target</Label>
                <Input type='number' name='target' placeholder='KES'/>
            </div>
            <CalendarS />

        </Form>
    )
}