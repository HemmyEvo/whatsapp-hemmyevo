import { useParams } from "next/navigation"
import { useMemo } from "react"

export const useChat = () =>{
    const param = useParams()
    const chatId = useMemo(() => param?.chatId || ("" as string), [param?.chatId])
    const isActive = useMemo(() => !!chatId,[chatId] )
    return {isActive, chatId}
}