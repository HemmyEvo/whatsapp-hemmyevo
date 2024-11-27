import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SignOutButton, useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOutIcon, LucideVerified} from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import { formatDate } from '@/lib/utils'
type Props = {}

const ProfileDropdown = (props: Props) => {
    const user = useUser()
  return(
        <DropdownMenu>
            <DropdownMenuTrigger className='outline-none'>
                <Avatar className="w-7 h-7">
                    <AvatarImage src={user?.user?.imageUrl} />
                    <AvatarFallback className="text-sm text-black dark:text-white">
                        <Skeleton className="h-12 w-12 rounded-full" />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="capitalize flex gap-3 place-content-end items-center">
                    {user.user?.username || "Unknown User"}
                    {user?.user?.hasVerifiedEmailAddress && <LucideVerified className='text-[green] w-4 h-4'/>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className=" justify-between flex items-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fullname:
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.user?.fullName}
                    </p>
                </DropdownMenuLabel>
                <DropdownMenuLabel className="space-x-4 flex items-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address:
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.user?.emailAddresses[0].emailAddress}
                    </p>
                </DropdownMenuLabel>
                <DropdownMenuLabel className="space-x-2 flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status:
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Online
                    </p>
                </DropdownMenuLabel>
                {/* Last Seen */}
                <DropdownMenuLabel className="space-x-2 flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last login:
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.user?.lastSignInAt
                            ? formatDate(new Date(user.user.lastSignInAt).getTime())
                            : "Not Available"}
                    </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                {/* Sign Out */}
                <SignOutButton>
                    <DropdownMenuItem className=" place-content-end flex items-center">
                        <p>Sign out</p>
                        <LogOutIcon className="h-4 w-4" />
                    </DropdownMenuItem>
                </SignOutButton>
            </DropdownMenuContent>
        </DropdownMenu>

  )
}

export default ProfileDropdown