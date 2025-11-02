import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  SkipForward,
  Eye,
  EyeOff,
  Send,
  Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// @ts-ignore
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import VideoPlayer from "./VideoPlayer";
import useWebRTC from "@/hooks/useWebRTC";

interface Message {
  text: string;
  sender: "me" | "stranger";
  timestamp: Date;
}

export default function ChatInterface() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [strangerInfo, setStrangerInfo] = useState({ name: "Stranger", age: "??", location: "Unknown" });
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isVideoHidden, setIsVideoHidden] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    localStream,
    remoteStream,
    startCall,
    stopCall,
    toggleVideo,
    toggleAudio,
    hideVideoFromPartner,
  } = useWebRTC(socket);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize socket
  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
      startMatching(newSocket);
    });

    newSocket.on("online", (count: number) => {
      setOnlineUsers(count);
    });

    newSocket.on("get-message", (input: string, sender: string) => {
      setMessages((prev) => [
        ...prev,
        {
          text: input,
          sender: sender.includes("You") ? "me" : "stranger",
          timestamp: new Date(),
        },
      ]);
    });

    newSocket.on("matched", (data: any) => {
      setIsConnected(true);
      setStrangerInfo({
        name: data.name || "Anonymous User",
        age: data.age || "??",
        location: data.location || "Unknown",
      });
      toast.success("Connected with a stranger!");
    });

    newSocket.on("stranger-disconnected", () => {
      setIsConnected(false);
      toast.info("Stranger disconnected");
      setMessages([]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Setup local video
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Setup remote video
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
    if (remoteStream && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const startMatching = (socketInstance: Socket) => {
    startCall();
    socketInstance.emit("start", () => {
      console.log("Started matching");
    });
  };

  const handleNext = () => {
    if (socket) {
      socket.emit("next");
      setMessages([]);
      setIsConnected(false);
      stopCall();
      startCall();
    }
  };

  const handleDisconnect = () => {
    stopCall();
    socket?.disconnect();
    navigate("/");
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && socket && isConnected) {
      socket.emit("send-message", messageInput, "p1", socket.id);
      setMessages((prev) => [
        ...prev,
        { text: messageInput, sender: "me", timestamp: new Date() },
      ]);
      setMessageInput("");
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessageInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setVideoEnabled(!videoEnabled);
  };

  const handleToggleAudio = () => {
    toggleAudio();
    setAudioEnabled(!audioEnabled);
  };

  const handleToggleVideoVisibility = () => {
    hideVideoFromPartner();
    setIsVideoHidden(!isVideoHidden);
    toast.success(isVideoHidden ? "Video visible to partner" : "Video hidden from partner");
  };

  const handleUnmutePartner = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = false;
      remoteAudioRef.current.play().catch(console.error);
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = false;
      remoteVideoRef.current.play().catch(console.error);
    }
    toast.success("Partner audio enabled");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">TUGWEMO</h1>
            <p className="text-sm text-muted-foreground">{onlineUsers} users online</p>
          </div>
          <Button variant="destructive" onClick={handleDisconnect}>
            <PhoneOff className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Video Section */}
        <div className="flex-1 p-4 space-y-4">
          {/* Remote Video */}
          <div className="relative bg-card rounded-lg overflow-hidden aspect-video">
            <VideoPlayer
              ref={remoteVideoRef}
              muted={false}
              className="w-full h-full object-cover"
            />
            {!isConnected && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold">{strangerInfo.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {strangerInfo.age} years old • {strangerInfo.location}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Connecting...</p>
                </div>
              </div>
            )}
            {isConnected && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={handleUnmutePartner}
              >
                Enable Audio / Unmute Partner
              </Button>
            )}
          </div>

          {/* Local Video */}
          <div className="relative bg-card rounded-lg overflow-hidden h-48">
            <VideoPlayer
              ref={localVideoRef}
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button
                variant={videoEnabled ? "secondary" : "destructive"}
                size="icon"
                onClick={handleToggleVideo}
              >
                {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              <Button
                variant={audioEnabled ? "secondary" : "destructive"}
                size="icon"
                onClick={handleToggleAudio}
              >
                {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button
                variant={isVideoHidden ? "destructive" : "secondary"}
                size="icon"
                onClick={handleToggleVideoVisibility}
              >
                {isVideoHidden ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
              <Button variant="secondary" size="icon" onClick={handleNext}>
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <audio ref={remoteAudioRef} autoPlay />
        </div>

        {/* Chat Section */}
        <div className="lg:w-96 border-t lg:border-t-0 lg:border-l border-border flex flex-col">
          <Card className="flex-1 flex flex-col m-4">
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{strangerInfo.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {isConnected ? "Connected" : "Connecting..."}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Report
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Smile className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 border-none">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </PopoverContent>
                </Popover>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={!isConnected}
                />
                <Button onClick={handleSendMessage} disabled={!isConnected}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
