import { Laugh, Mic, Send, Trash, StopCircle, PlayCircle } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const me = useQuery(api.user.getMe);
  const sendTextMsg = useMutation(api.message.sendTextMessage);
  const sendVoiceMsg = useMutation(api.message.sendVoiceMsg);
  const generateUploadUrl = useMutation(api.conversation.generateUploadUrl);
  const setTyping = useMutation(api.conversation.isTyping);
 // Handle isTyping state
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

    window.addEventListener("beforeunload", handleSetTypingFalse);
    window.addEventListener("pagehide", handleSetTypingFalse);

    return () => {
      window.removeEventListener("beforeunload", handleSetTypingFalse);
      window.removeEventListener("pagehide", handleSetTypingFalse);
    };
  }, [isTyping, setTyping, me]);

  useEffect(() => {
    if (isTyping) {
      setTyping({
        conversation: ChatDetails!._id,
        userId: me!._id,
        isTyping: true,
      });
    } else {
      setTyping({
        conversation: ChatDetails!._id,
        userId: me!._id,
        isTyping: false,
      });
    }
  }, [setTyping, isTyping]);

  const handleSendTextMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgText("");
    if (!msgText) return;
    setIsLoading(true);
    try {
      await sendTextMsg({
        content: msgText,
        conversation: ChatDetails!._id,
        sender: me!._id,
      });
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    }finally{
      setIsLoading(false)
    }
  };

  const handleRecordAudio = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.start();
        setIsRecording(true);

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());  
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          setRecordedAudio(audioBlob);
          setAudioURL(URL.createObjectURL(audioBlob));
          setIsRecording(false);
        };
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
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

  const handleSendVoiceMsg = async () => {
    if (!recordedAudio) return;
  
    setIsLoading(true);
    try {
      // Step 1: Get a short-lived upload URL (similar to how image is uploaded)
      const postUrl = await generateUploadUrl(); // Function to generate upload URL for audio
  
      // Step 2: POST the audio file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": recordedAudio.type },
        body: recordedAudio,
      });
  
      const { storageId } = await result.json(); // Get the storage ID from the response
  
      // Step 3: Save the storage ID and other relevant data to the database
      await sendVoiceMsg({
        conversation: ChatDetails!._id,
        audioId: storageId,
        sender: me!._id,
      });
  
      // Reset the audio state after sending the message
      setRecordedAudio(null);
      setAudioURL(null);
  
    } catch (err) {
      toast.error("Failed to send voice message");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
  <>
  {recordedAudio ? (
            <div className="flex p-2 items-center gap-4">
            <div className="flex-1"><audio style={{width: "100%"}} controls src={audioURL ?? undefined}></audio></div>
              <Button variant="ghost" onClick={() => setRecordedAudio(null)}>
                <Trash />
              </Button>
              <Button disabled={isLoading} variant="ghost" onClick={handleSendVoiceMsg}>
                <Send />
              </Button>
            </div>
          ) : (
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
              disabled={isLoading}
            >
              <Send />
            </Button>
          ) : (
            <Button
            type="button"
            size="sm"
            onClick={handleRecordAudio}
            className={`bg-transparent text-foreground ${
              isRecording ? "text-red-500" : ""
            }`}
          >
            {isRecording ? <StopCircle /> : <Mic />}
          </Button>
        )}
        </div>
      </form>
    </div>
          )
    }
  </>
    
  );
};

export default MessageInput;
