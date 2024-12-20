import { getAllUsers, getGroupTargets2 } from '@/lib/data'
import  Form  from 'next/form'
import { Label } from './ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import SubmitButton from './submit-button'
import { recordContribution } from '@/lib/actions'

export default async function ContributionForm() {
    const [users, groupTargets] = await Promise.all([
        getAllUsers(),
        getGroupTargets2()
    ])

    return (
        <Form action={recordContribution} className='border rounded-md p-3 px-4 flex flex-col space-y-3'>
            <div>
                <Label>Select User</Label>
                <Select name='userId' required >
                    <SelectTrigger>
                        <SelectValue placeholder='Jane Doe'></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Users</SelectLabel>
                            {users.users.map((user) => (
                                <SelectItem value={user.id} key={user.id}>
                                    {user.name}
                                </SelectItem>
                            ))} 
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Contribution For:</Label>
                <Select name='groupTargetId' required >
                    <SelectTrigger>
                        <SelectValue placeholder='Land Project'></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Group Targets</SelectLabel>
                            {groupTargets.map((target) => (
                                <SelectItem value={target.id.toString()} key={target.id}>
                                    {target.name}
                                </SelectItem>
                            ))} 
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Amount</Label>
                <Input type='number' name='amount' placeholder='KES' required />
            </div>
            <SubmitButton text='Submit' />
        </Form>
    )
}