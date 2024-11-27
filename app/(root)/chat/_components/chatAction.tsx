'use client'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme/theme-toggle"
import {FilePenIcon, ImageIcon, ListFilter, PenIcon, Search, User2Icon, X } from "lucide-react"
import React, { useEffect, useRef, useState } from 'react'
import { BiGroup, BiMessageRoundedDetail } from "react-icons/bi"
import { Id } from "@/convex/_generated/dataModel"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { useConvexAuth, useMutation, useQuery } from "convex/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import toast from "react-hot-toast"

export const FilterList = () =>{
    const lists = [
        {icon:<BiMessageRoundedDetail  className="w-5 h-5"/> , label:'Unread'},
        {icon:<User2Icon className="w-5 h-5" /> , label:'Username'},
        {icon:<BiGroup className="w-5 h-5" /> , label:'Groups'},
        {icon:<PenIcon className="w-5 h-5" /> , label:'Draft'},
    ]
    return (
        
        <DropdownMenu>
        <DropdownMenuTrigger asChild >
            <div className="hover:bg-[#bebebe] dark:hover:bg-[#555555] flex justify-center items-center w-9 h-8 rounded">
            <ListFilter className="w-4 h-4"/>
            </div></DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
        <DropdownMenuLabel className="text-sm text-gray-400">Filter chats by</DropdownMenuLabel>
        {lists.map((list,key): any =>(
        <DropdownMenuItem key={key} className="flex items-center space-x-3">
        <div className="icons">{list.icon}</div>
        <div className="label">{list.label}</div>
      
    </DropdownMenuItem>
        ))}
        </DropdownMenuContent>
    </DropdownMenu>
    )
}



export const NewChat = () =>{
    const [value, setValue] = useState('')
    const [showCancel, setShowCancel] = useState<boolean>(false)
	const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
	const [groupName, setGroupName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [renderedImage, setRenderedImage] = useState("");
	const imgRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const users = useQuery(api.user.getUsers)
    const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        setValue(inputValue)
        setShowCancel(inputValue !== '')
    }
    const createChat = useMutation(api.conversation.createChat)
    const generateUploadUrl = useMutation(api.conversation.generateUploadUrl)
    const me = useQuery(api.user.getMe)
    const handleCreateChat = async() =>{
        if(selectedUsers.length === 0) return
        setIsLoading(true)
        try {
            const isGroup = selectedUsers.length > 1;
            let chatId;
            if(!isGroup){
                chatId = await createChat({
                    participants:[...selectedUsers, me?._id!],
                    isGroup: false

                })
            } else{
                console.log(selectedImage?.type)
                const postUrl = await generateUploadUrl()
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: {"Content-Type": selectedImage?.type!},
                    body: selectedImage
                })
                const storageId = await result.json()
                await createChat ({
                    participants: [...selectedUsers, me?._id!],
                    isGroup: true,
                    admin: me?._id!,
                    groupName,
                    groupImage: storageId.storageId
                })
            }
            setIsOpen(false)
            setSelectedUsers([])
            setGroupName("")
            setSelectedImage(null)
        } catch (error) {
            toast.error("Failed to create conversation")
            console.log(error)
        } finally{
            setIsLoading(false)
        }
    }
    useEffect(() =>{
        if(!selectedImage) return setRenderedImage('');
        const reader = new FileReader()
        reader.onload = (e) => setRenderedImage(e.target?.result as string);
        reader.readAsDataURL(selectedImage)
    },[selectedImage])
    return(
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild >
            <div className="hover:bg-[#bebebe] dark:hover:bg-[#555555] flex justify-center items-center w-9 h-8 rounded">
            <FilePenIcon className="w-4 h-4"/>
            </div></DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px] relative flex flex-col h-[80vh]">
        <DropdownMenuLabel className="text-xl font-semibold">New chat</DropdownMenuLabel>
        <DropdownMenuLabel className="text-xl font-semibold">      
            <div className='w-full flex justify-between cursor-text rounded-md rounded-b-lg border-b-2 border-b-[gray] focus-within:border-b-[#289228] dark:focus-within:bg-[#1a1a1a] focus-within:bg-[#e4e4e4] bg-[#ebebeb] dark:bg-[#2b2b2b] items-center px-2 md:px-3 lg:px-4'>
                        <section className='cursor-text flex flex-1 space-x-2 text-sm items-center py-3'>
                            <Search className="h-4 w-4" />
                            <input
                                value={value}
                                onChange={HandleChange}
                                type="text"
                                placeholder="Search Username"
                                className='border-none w-full bg-transparent outline-none flex-1'
                            />
                        </section>
                        {showCancel && (
                            <section>
                                <X className="h-4 w-4 cursor-pointer" onClick={() => { setValue(''); setShowCancel(false) }} />
                            </section>
                        )}
                    </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {renderedImage && (
            <div className="w-16 h-16 mb-4 relative mx-auto">
                <Image src={renderedImage} fill alt='User Image' className="rounded-full object-cover"/>
            </div>
        )}
        <input type="file" accept="image/*" hidden ref={imgRef} onChange={(e) => setSelectedImage(e.target.files![0])}/>
        {selectedUsers.length > 1 && (
					<div className="flex flex-col space-y-2">
						<div >
                        <Input
							placeholder='Group Name'
							value={groupName}
							onChange={(e :any) => setGroupName(e.target.value)}
						/>
                        </div>
						<Button className='flex gap-2' onClick={() => imgRef.current?.click()}>
							<ImageIcon size={20} />
							Group Image
						</Button>
					</div>
		)}
        <div className='flex flex-1 py-2 flex-col gap-3 overflow-auto '>
        {users?.map((user) => (
						<DropdownMenuLabel
							key={user._id}
							className={`flex gap-3 items-center p-2 rounded cursor-pointer active:scale-95 
								transition-all ease-in-out duration-300
							${selectedUsers.includes(user._id) ? "bg-green-500/50" : ""}`}
							onClick={() => {
								if (selectedUsers.includes(user._id)) {
									setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
								} else {
									setSelectedUsers([...selectedUsers, user._id]);
								}
							}}
						>
							<Avatar className='overflow-visible'>
								{user.isOnline && (
									<div className='absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-foreground' />
								)}

								<AvatarImage src={user.image} className='rounded-full object-cover' />
								<AvatarFallback>
									<div className='animate-pulse bg-gray-tertiary w-full h-full rounded-full'></div>
								</AvatarFallback>
							</Avatar>

							<div className='w-full '>
								<div className='flex items-center justify-between'>
									<p className='text-md font-medium'>{user.username || user.email.split("@")[0]}</p>
								</div>
							</div>
						</DropdownMenuLabel>
					    ))}
        </div>
        <DropdownMenuLabel className='flex justify-between'>
        <Button variant={"outline"} onClick={() => {setIsOpen(false), setSelectedUsers([]),setGroupName(""),setSelectedImage(null)}}>Cancel</Button>
        <Button
        onClick={handleCreateChat}
        disabled={selectedUsers.length === 0 || (selectedUsers.length > 1 && !groupName) || isLoading}
        >
            {/* spinner */}
            {isLoading ? (
            <div className='w-5 h-5 border-t-2 border-b-2  rounded-full animate-spin' />
            ) : (
            "Create"
            )}
        </Button>
        </DropdownMenuLabel>
        </DropdownMenuContent>
        
    </DropdownMenu>

  
    )
}


const ChatAction = () => {
    const {isAuthenticated} = useConvexAuth()
  return (
    <div className="flex space-x-2 items-center">  {isAuthenticated && <NewChat />}  <FilterList /> <ThemeToggle /> </div>
  )
}

export default ChatAction