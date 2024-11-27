import { Laugh, Mic, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import toast from "react-hot-toast";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import useComponentVisible from "@/hooks/useConversationVisible";
import MediaDropdown from "./MediaDropdown";
import { Textarea } from "@/components/ui/textarea";

const MessageInput = ({ ChatDetails }: { ChatDetails: any }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [msgText, setMsgText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const me = useQuery(api.user.getMe);
  const sendTextMsg = useMutation(api.message.sendTextMessage);
  const setTyping = useMutation(api.conversation.isTyping);

  // Handle isTyping state on component lifecycle and navigation
  useEffect(() => {
    
    const handleSetTypingFalse = () => {
      if (isTyping) {
        setTyping({
          conversation: ChatDetails!._id,
          userId: me!._id,
          isTyping: false,
        });
        setIsTyping(false);
      }
    };

   

    // Set isTyping to false on page unload
    window.addEventListener("beforeunload", handleSetTypingFalse);
    window.addEventListener("pagehide", handleSetTypingFalse);


    // Cleanup event listeners
    return () => {
      window.removeEventListener("beforeunload", handleSetTypingFalse);
      window.removeEventListener("pagehide", handleSetTypingFalse);
 
    };
  }, [isTyping, setTyping, me]);

  useEffect(()=>{
    if(isTyping ){
     setTyping({
      conversation: ChatDetails!._id,
      userId: me!._id,
       isTyping:true
     })
   }
   else{
      setTyping({
      conversation: ChatDetails!._id,
      userId: me!._id,
       isTyping:false
     })
   }

  },[setTyping,isTyping])


  const handleSendTextMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (textareaRef.current) {
      textareaRef.current.blur();
    }
    if (!msgText) return;
    try {
      await sendTextMsg({
        content: msgText,
        conversation: ChatDetails!._id,
        sender: me!._id,
      });
      setMsgText(""); // Clear message input after sending
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendTextMsg(e); // Send message on Enter without Shift
    } else if (e.key === "Enter" && e.shiftKey) {
      // Allow new line on Shift + Enter
      const textarea = e.target as HTMLTextAreaElement;
      textarea.style.height = "auto"; // Reset height to recalculate
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height dynamically
    }
  };

  return (
    <div className="bg-gray-primary p-2 flex gap-4 items-center">
      <div className="relative flex gap-2 ml-2">
        {/* EMOJI PICKER WILL GO HERE */}
        <div ref={ref} onClick={() => setIsComponentVisible(true)}>
          {isComponentVisible && (
            <EmojiPicker
              theme={Theme.DARK}
              onEmojiClick={(emojiObject) => {
                setMsgText((prev) => prev + emojiObject.emoji);
              }}
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "1rem",
                zIndex: 50,
              }}
            />
          )}
          <Laugh className="text-gray-600 dark:text-gray-400" />
        </div>
        <MediaDropdown ChatDetails={ChatDetails} />
      </div>

      <form onSubmit={handleSendTextMsg} className="w-full flex gap-3">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Type a message"
            className="py-2 text-sm w-full rounded-lg shadow-sm bg-[#c4c4c4] dark:bg-[#1d1d1d] focus-visible:ring-transparent resize-none"
            value={msgText}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
            onChange={(e) => {
              setMsgText(e.target.value);
              e.target.style.height = "auto"; // Reset height to recalculate
              e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height dynamically
            }}
            onKeyDown={handleKeyDown} // Use the updated keydown handler
            style={{
              height: "auto",
              maxHeight: "0.5em",
              overflowY: "auto",
            }}
          />
        </div>
        <div className="mr-4 flex items-center gap-3">
          {msgText.length > 0 ? (
            <Button
              type="submit"
              size={"sm"}
              className="bg-transparent text-foreground hover:bg-transparent"
            >
              <Send />
            </Button>
          ) : (
            <Button
              type="submit"
              size={"sm"}
              className="bg-transparent text-foreground hover:bg-transparent"
            >
              <Mic />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
