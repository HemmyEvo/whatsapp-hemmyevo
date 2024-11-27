import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'
import { BiPhone, BiSolidMessageRoundedDetail, BiStar } from "react-icons/bi"
import {  FiSettings } from "react-icons/fi"
import { BsArchive } from "react-icons/bs"
import { StatusIcon } from '../components/customIcon/icons'
import ProfileDropdown from '@/components/shared/ProfileDropdown'
import SettingsDialog from '@/components/shared/SettingDialog'

export const useMainNavigation = () => {
 
    const pathname = usePathname()
    const paths = useMemo(() => [
        {
        name:"Chats",
        href: "/chat",
        icon: <BiSolidMessageRoundedDetail className='w-5 h-5' />,
        active:pathname.startsWith("/chat"),
        notification: 3
        },
        {
        name:"Calls",
        href: "/calls",
        icon:<BiPhone className='w-5 h-5' />,
        notification: 2,
        active:pathname === ("/calls")
        },
        {
        name:"Status",
        href: "/status",
        icon:<StatusIcon color='#ffff' size='17px'/>,
        active:pathname === ("/status")
        },
        ],[pathname])
    return paths
}




export const usePageNavigation = () => {
    const pathname = usePathname()
    const paths = useMemo(() => [
        {
        name:"Starred messages",
        href: "/starred-message",
        icon: <BiStar className='w-5 h-5' />,
        notification: 15,
        active:pathname === ("/starred-message")
        },
        {
        name:"Archived chats",
        href: "/archived",
        icon:<BsArchive  className='w-5 h-5'/>,
        notification: 5,
        active:pathname === ("/archived")
        }
        ],[pathname])
    return paths
}



export const useSettingNavigation = () => {
    const paths = [
        {
        name:"Settings",
        icon:<SettingsDialog />
        },
        {
        name:"Profile",
        icon: <ProfileDropdown/>
        },
        ]
    return paths
}
