import { MessageReceivedSvg, MessageSeenSvg, MessageSentSvg } from "@/lib/svgs";
import ChatBubbleAvatar from "./chat-bubble-avatar";
import DateIndicator from "./date-indicator";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {Dialog,  DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import ReactPlayer from "react-player";
import { Bot, Mic, Pause, Play } from "lucide-react";
import ChatAvatarActions from "./chat-avatar-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatBubble = ({ me, message, previousMessage, ChatDetails }: any) => {
	const date = new Date(message._creationTime);
	let hour = date.getHours();
	const minute = date.getMinutes().toString().padStart(2, "0");
	const amPm = hour >= 12 ? "PM" : "AM";
	useEffect(() =>{

	},[])
	// Convert to 12-hour format
	hour = hour % 12 || 12; // Convert 0 to 12 for midnight
	const formattedHour = hour.toString().padStart(2, "0");

	const time = `${formattedHour}:${minute} ${amPm}`;
	const isMember = ChatDetails?.participants.includes(message.sender?._id) || false;
	const isGroup = ChatDetails?.isGroup;
	const fromMe = message.sender?._id === me._id;
	const fromAI = message.sender?.name === "ChatGPT";
	const bgClass = fromMe ? "bg-[#59f796] dark:bg-[#00804b]" : !fromAI ? "bg-white dark:bg-[#272727]" : "bg-blue-500 text-white";
	const [open, setOpen] = useState(false);

	const renderMessageContent = () => {
		switch (message.messageType) {
			case "text":
				return <TextMessage message={message} />;
			case "image":
				return <ImageMessage message={message} handleClick={() => setOpen(true)} />;
			case "video":
				return <VideoMessage message={message} />;
			default:
				return null;
		}
	};

	if(message.messageType === "audio" && fromMe){
		return(
			<>
			<DateIndicator message={message} previousMessage={previousMessage} />
			<div className='flex gap-1 w-2/3 ml-auto'>
				<div className={`flex flex-col z-20 w-[100%] md:w-[70%] px-2 pt-1 ml-auto rounded-md shadow-md relative ${bgClass}`}>
					<AudioMessage message={message} />
				</div>
			</div>
			</>
		)
	}

	if (!fromMe) {
		return (
			<>
				<DateIndicator message={message} previousMessage={previousMessage} />
				<div className='flex gap-1 w-2/3'>
					<ChatBubbleAvatar isGroup={isGroup} isMember={isMember} message={message} fromAI={fromAI} />
					<div className={`flex flex-col z-20 max-w-[100%] px-2 pt-1  rounded-md shadow-md relative ${bgClass}`}>
						{!fromAI && <OtherMessageIndicator />}
						{fromAI && <Bot size={16} className='absolute bottom-[2px] left-2' />}
						{<ChatAvatarActions message={message} ChatDetails={ChatDetails} me={me} />}
						{renderMessageContent()}
						{open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />}
						<MessageTime ChatDetails={ChatDetails} message={message} time={time} fromMe={fromMe} />
					</div>
				</div>
			</>
		);
	}
	
	return (
		<>
			<DateIndicator message={message} previousMessage={previousMessage} />
			<div className='flex gap-1 w-2/3 ml-auto'>
				<div className={`flex flex-col z-20 max-w-[100%] px-2 pt-1 ml-auto rounded-md shadow-md relative ${bgClass}`}>
					<SelfMessageIndicator />
					{renderMessageContent()}
					{open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />}
					<MessageTime ChatDetails={ChatDetails} message={message} time={time} fromMe={fromMe} />
				</div>
			</div>
		</>
	);
};
export default ChatBubble;

const VideoMessage = ({ message }: any) => {
	return <ReactPlayer url={message.content} width='250px' height='250px' controls={true} light={true} />;
};

const ImageMessage = ({ message, handleClick }: any) => {
	return (
		<div className='w-[250px] h-[250px] overflow-hidden relative'>
			<Image
				src={message.content}
				fill
				className='cursor-pointer object-cover rounded'
				alt='image'
				onClick={handleClick}
			/>
		</div>
	);
};

let currentAudio: HTMLAudioElement | null = null; // Keeps track of the currently playing audio

const AudioMessage = ({ message }: any) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
		setIsPlaying(!isPlaying)
      } else {
        // Pause currently playing audio (if any)
        if (currentAudio && currentAudio !== audioRef.current) {
			
          currentAudio.pause();
        }
		setIsPlaying(false)
        audioRef.current.play();
        currentAudio = audioRef.current;
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(total);
      setProgress((current / total) * 100);
    }
  };

  const changeSpeed = () => {
    if (audioRef.current) {
      const newSpeed = speed === 2 ? 1 : speed + 0.5;
      setSpeed(newSpeed);
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <div className="flex h-12 text-[#111B21] dark:text-[#E9EDEF] items-center px-3 space-x-3 w-full">
    <div className="Profile">
    {!isPlaying ? (
      <Avatar className='overflow-visible relative'>
      <Mic className="absolute bottom-1 h-4 w-4 right-1" />
			<AvatarImage src={message.sender?.image} className='rounded-[100%] object-cover w-8 h-8' />
			<AvatarFallback className='w-8 h-8 '>
				<div className='animate-pulse bg-gray-tertiary rounded-[100%]'></div>
			</AvatarFallback>
		</Avatar>
    )
     : (
      <button
        onClick={changeSpeed}
        className="text-sm flex justify-center bg-[#313131b6]  w-10 h-7 rounded-md items-center pointer-cursor font-medium dark:text-[#8696A0] text-[#25D366]"
      >
        {speed}x
      </button>
     )}
    	
    </div>
    <div className="music-cont flex-1 flex items-center space-x-3">
      <div className="buttonToggle flex items-center justify-center" onClick={togglePlay}>
      {!isPlaying ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
      </div>
      <div className="waves">
      </div>
    </div>
     {/* Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        src={message.content}
        onLoadedMetadata={handleLoadedMetadata} // Set duration once loaded
        onEnded={handleEnded}
      ></audio>
    </div>
  );
};

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}




const ImageDialog = ({ src, onClose, open }: { open: boolean; src: string; onClose: () => void }) => {
	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogTitle />
			<DialogContent className='min-w-[750px]'>
				<DialogDescription className='relative h-[450px] flex justify-center'>
					<Image src={src} fill className='rounded-lg object-contain' alt='image' />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};

const MessageTime = ({ time, fromMe, ChatDetails,  message }: { time: string; fromMe: boolean; ChatDetails: any; message:any;}) => {
	return (
		<p className='text-[10px] mt-2 self-end flex gap-1 items-center'>
			{time} {fromMe && (message.status ? <MessageReceivedSvg /> : ChatDetails.isOnline ? <MessageSeenSvg /> : <MessageSentSvg /> )}
		</p>
	);
};


const OtherMessageIndicator = () => (
	<div className='absolute bg-white  dark:bg-[#272727] top-0 -left-[4px] w-3 h-3 rounded-bl-full' />
);

const SelfMessageIndicator = () => (
	<div className='absolute bg-[#59f796] dark:bg-[#00804b] top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden' />
);
const TextMessage = ({ message }: any) => {
	const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content); // Check if the content is a URL
	const messageArray = message.content.split("\n");
  
	return (
	  <div >
		{isLink ? (
		  // If it's a URL, render it as a clickable link
		  <a
			href={message.content}
			target='_blank'
			rel='noopener noreferrer'
			className='mr-2 text-sm font-light break-words text-blue-400 underline'
		  >
			{message.content} {/* Display the URL as a single line */}
		  </a>
		) : (
		  // Otherwise, render each line of the message in a separate <p> tag
		  messageArray.map((msg: string, i: number) => (
			<p className='mr-2 w-[100%]  break-words text-sm font-light' key={i}>
			  {msg}
			</p>
		  ))
		)}
	  </div>
	);
  };