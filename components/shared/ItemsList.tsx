'use client'
import { useCall, useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import React, { useState } from 'react'

type Props = React.PropsWithChildren<{
    title: string,
    action?: any,
    search: boolean,
    placeholder?: string
}>

const ItemsList = ({ children, title, action, search, placeholder }: Props) => {
    const [value, setValue] = useState('')
    const [showCancel, setShowCancel] = useState<boolean>(false)

    const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        setValue(inputValue)
        setShowCancel(inputValue !== '')
    }
    const {isActive} = useChat()
    const {callActive} = useCall()
    const checkActive = isActive || callActive

    return (
        <div className={cn("hidden h-[100vh] w-full lg:w-[30%] border-r bg-[#dddddd] dark:bg-[#303030] dark:border-[#444444c7] border-[#a1a1a1c7] p-2",{
            block: !checkActive,
            "lg:block": checkActive
        })}>
            <header className='px-3 space-y-4'>
                <nav className='flex justify-between items-center'>
                    <p className='text-xl font-medium'>{title}</p>
                    <div>{action}</div>
                </nav>
                {search && (
                    <div className='w-full flex justify-between cursor-text rounded-md rounded-b-lg border-b-2 border-b-[gray] focus-within:border-b-[#289228] dark:focus-within:bg-[#1a1a1a] focus-within:bg-[#e4e4e4] bg-[#ebebeb] dark:bg-[#2b2b2b] items-center px-2 md:px-3 lg:px-4'>
                        <section className='cursor-text flex flex-1 space-x-2 text-sm items-center py-3'>
                            <Search />
                            <input
                                value={value}
                                onChange={HandleChange}
                                type="text"
                                placeholder={placeholder}
                                className='border-none w-full bg-transparent outline-none flex-1'
                            />
                        </section>
                        {showCancel && (
                            <section>
                                <X className='cursor-pointer' onClick={() => { setValue(''); setShowCancel(false) }} />
                            </section>
                        )}
                    </div>
                )}
            </header>
            {children}
        </div>
    )
}

export default ItemsList
