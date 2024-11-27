"use client"
import dynamic from "next/dynamic"

const DynamicVideoUI = dynamic(() => import("./video-ui-kit"), {ssr:false})
export default function VideoCall(){
    return (
        <div className="lg:w-[70%] w-full h-[100vh]"><DynamicVideoUI /></div>
    )
}