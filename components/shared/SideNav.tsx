
'use client'
import React, { useState } from 'react'
import { BiMenu } from 'react-icons/bi'
import Link from "next/link"
import { useMainNavigation, usePageNavigation, useSettingNavigation } from "../../hooks/useNavigation"

type Props = React.PropsWithChildren<{}>

const SideNav = ({children}: Props) => {
    const [isToggle, setIsToggle] = useState(true)
    const MainPaths = useMainNavigation()
    const PagePaths = usePageNavigation()
    const SettingPaths = useSettingNavigation()
  return (
        <div className="flex bg-[#0d4635] w-[100vw]  dark:bg-[#1a1a1a] h-[100vh]">
            <div className="card w-[42px] z-40 h-full">
            <div  className={`bg-[#0d4635] py-3 h-full flex flex-col justify-between transition duration-300 delay-75 ease-in-out  rounded-none text-white relative ${isToggle ? "w-full dark:bg-[#1a1a1a]":"w-[200px] bg-[#1a5f4a] dark:bg-[#202020]"}`}>
                <div className="mainNav w-full space-y-4 flex flex-col ">
                    <div className="menuToggle  max-w-[42px] justify-center items-center flex">
                      <div className="hover:bg-[#9e9e9e] dark:hover:bg-[#363636] flex justify-center items-center w-9 h-8 rounded" onClick={() => setIsToggle(prev => !prev)}>
                          <BiMenu className='w-5 h-5'/>
                      </div>
                    </div>

                    <div className={`nav w-full flex space-y-2 flex-col ${isToggle ? 'pr-1' : ''}`}>
                    {
                    MainPaths.map((path,i) => (
                    <Link href={path.href} key={i}>

                    <div  className={`message ${path.active ? 'bg-[#9e9e9e] dark:bg-[#363636]' : ''} hover:bg-[#9e9e9e] dark:hover:bg-[#363636] flex justify-center items-center w-9 h-8 rounded ${isToggle ? "justify-center m-auto ":""}  w-full`}>
                    {!isToggle ? (
                    <div className="flex w-full justify-between items-center  relative">
                        <div className="flex items-center">
                        <div className="w-[42px] pr-1 justify-center flex ">
                        {path.icon}
                        </div>
                        <p className="label text-sm">{path.name}</p>
                        </div>
                        <div className="pr-1">
                        {path.notification ? (
                        <div className="w-6 dark:text-black h-5 justify-center text-xs items-center flex rounded-[80%] bg-[#21c771] dark:bg-[#136F40] ">
                        {path.notification}
                        </div>
                        ) : (
                            <div className=" w-3  h-3 rounded-[100%] bg-[#21c771] dark:bg-[#136F40]">
                            </div>
                            )
                        }
                        </div>
                     
                    </div>
                    )
                    : (
                    path.icon
                    ) 
                    }
                    </div>
                    </Link> 
                    ))
                    }
                    </div>
                </div>
                <div className={`otherNav w-full flex space-y-2 flex-col ${isToggle ? 'pr-1' : ''}`}>
                    {
                    PagePaths.map((path,i) => (
                    <Link href={path.href} key={i}>

                    <div  className={`message ${path.active ? 'bg-[#9e9e9e] dark:bg-[#363636]' : ''} hover:bg-[#9e9e9e] dark:hover:bg-[#363636] flex justify-center items-center w-9 h-8 rounded ${isToggle ? "justify-center m-auto ":""}  w-full`}>
                    {!isToggle ? (
                    <div className="flex w-full justify-between items-center  relative">
                        <div className="flex items-center">
                        <div className="w-[42px] pr-1 justify-center flex ">
                        {path.icon}
                        </div>
                        <p className="label text-sm">{path.name}</p>
                        </div>
                        <div className="pr-1">
                        {path.notification ? (
                        <div className="w-6 dark:text-black h-5 justify-center text-xs items-center flex rounded-[80%] bg-[#21c771] dark:bg-[#136F40] ">
                        {path.notification}
                        </div>
                        ) : (
                            <div className=" w-3  h-3 rounded-[100%] bg-[#21c771] dark:bg-[#136F40]">
                            </div>
                            )
                        }
                        </div>
                     
                    </div>
                    )
                    : (
                    path.icon
                    ) 
                    }
                    </div>
                    </Link> 
                    ))
                    }
                    {
                    SettingPaths.map((path,i) => (

                    <div key={i}  className={`message hover:bg-[#9e9e9e] dark:hover:bg-[#363636] flex justify-center items-center w-9 h-8 rounded ${isToggle ? "justify-center m-auto ":""}  w-full`}>
                    {!isToggle ? (
                    <div className="flex w-full justify-between items-center  relative">
                        <div className="flex items-center">
                        <div className="w-[42px] pr-1 justify-center flex ">
                        {path.icon}
                        </div>
                        <p className="label text-sm">{path.name}</p>
                        </div>
                     
                    </div>
                    )
                    : (
                    path.icon
                    ) 
                    }
                    </div>
                    ))
                    }

                </div>
            </div>
            </div>
            <div className="flex-1 rounded-tl-2xl overflow-hidden">{children}</div>
        </div>
)
}

export default SideNav