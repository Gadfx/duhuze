import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  SkipForward,
  Home,
  Send,
  Smile,
  Flag,
  Heart,
  X,
  AlertTriangle,
  User,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useWebRTC } from "@/hooks/useWebRTC";
import VideoPlayer from "@/components/VideoPlayer";

interface ChatInterfaceProps {
  language: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

const ChatInterface = ({ language }: ChatInterfaceProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [searching, setSearching] = useState(true);
  const [isInitiator, setIsInitiator] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [videoVisibleToPartner, setVideoVisibleToPartner] = useState(true);
  const { toast } = useToast();

  const { localStream, remoteStream, connectionState, isConnecting, isVideoHiddenFromPartner, toggleVideo, toggleAudio, hideVideoFromPartner, reconnect } = useWebRTC({
    roomId,
    isInitiator,
  });

  useEffect(() => {
    if (user) {
      findMatch();
    }
  }, [user]);

  useEffect(() => {
    if (!roomId) return;

    // Subscribe to new messages
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        (payload) => {
          console.log('Received new message:', payload.new);
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe((status) => {
        console.log('Message subscription status:', status);
      });

    // Load existing messages
    loadMessages();

    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  // Listen for realtime matches so waiting users auto-join when paired
  useEffect(() => {
    if (!user) return;

    const matchesChannel = supabase
      .channel("user-matches")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "matches" },
        async (payload) => {
          const match: any = payload.new;
          if (!(match.user1_id === user.id || match.user2_id === user.id)) return;

          console.log("Match found for user:", user.id, "match:", match);

          if (!roomId) {
            const newRoomId = match.room_id as string;
            setRoomId(newRoomId);
            setIsInitiator(match.user1_id === user.id);
            setSearching(false);

            const otherId = match.user1_id === user.id ? match.user2_id : match.user1_id;
            console.log("Other user ID:", otherId);

            const { data: profile, error } = await supabase
              .from("profiles")
              .select("id, display_name, age, gender, province, is_anonymous")
              .eq("id", otherId)
              .maybeSingle();

            console.log("Profile fetch result:", { profile, error });

            if (profile) {
              setMatchedUser({
                id: profile.id,
                display_name: (profile.display_name && profile.display_name.toLowerCase() !== "anonymous") ? profile.display_name : "User",
                age: profile.age,
                gender: profile.gender,
                province: profile.province,
              });
              console.log("Matched user set:", profile);
            } else {
              console.error("Failed to fetch matched user profile:", error);
            }
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(matchesChannel); };
  }, [user, roomId]);

  const loadMessages = async () => {
    if (!roomId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
    } else if (data) {
      setMessages(data);
    }
  };

  const findMatch = async (mode: string = "random", retryAttempt: number = 0) => {
    if (!user) return;

    setSearching(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke("find-match", {
        body: { connectionMode: mode, filters: {} },
      });

      if (error) throw error;

      if (data?.waiting) {
        // Stay in searching state and wait for realtime match notification
        toast({
          title: "Searching...",
          description: "We will connect you as soon as someone is available.",
        });
        setMatchedUser(null);
        setRoomId(null);
        setIsInitiator(false);
        return; // Keep searching=true
      }

      if (data?.match) {
        console.log("Direct match found:", data);
        setMatchedUser(data.match);
        setRoomId(data.room_id);
        setIsInitiator(data.isInitiator || false);
        toast({ title: "Match Found!", description: "You're now connected" });
        setSearching(false);
        setRetryCount(0); // Reset retry count on success
        return;
      }

      // Fallback
      toast({ title: "No matches available", description: "Please try again soon", variant: "destructive" });
      setSearching(false);
    } catch (error: any) {
      console.error("Error finding match:", error);

      if (retryAttempt < 3) {
        // Retry up to 3 times with exponential backoff
        const delay = Math.pow(2, retryAttempt) * 1000;
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          findMatch(mode, retryAttempt + 1);
        }, delay);
        setError(`Connection failed. Retrying... (${retryAttempt + 1}/3)`);
      } else {
        setError("Failed to find a match after multiple attempts. Please check your connection and try again.");
        setSearching(false);
        setRetryCount(0);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !roomId || !user) {
      console.log('Cannot send message:', { message: message.trim(), roomId, user });
      return;
    }

    try {
      console.log('Sending message:', { roomId, senderId: user.id, content: message.trim() });
      const { error } = await supabase
        .from("messages")
        .insert({
          room_id: roomId,
          sender_id: user.id,
          content: message.trim(),
          message_type: "text",
        });

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      console.log('Message sent successfully');
      setMessage("");
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleSkip = async () => {
    if (roomId) {
      // Mark room as inactive
      await supabase
        .from("room_participants")
        .update({ is_currently_active: false, left_at: new Date().toISOString() })
        .eq("room_id", roomId)
        .eq("user_id", user?.id);

      // Update skip counter
      const { data: stats } = await supabase
        .from("user_stats")
        .select("skips_used")
        .eq("user_id", user?.id)
        .single();

      if (stats) {
        await supabase
          .from("user_stats")
          .update({ skips_used: (stats.skips_used || 0) + 1 })
          .eq("user_id", user?.id);
      }
    }

    setMessages([]);
    setRoomId(null);
    setMatchedUser(null);
    setIsInitiator(false);
    findMatch();
  };

  const handleNext = () => {
    handleSkip();
  };

  const handleReconnect = () => {
    reconnect();
    toast({
      title: "Reconnecting...",
      description: "Attempting to reconnect to your match",
    });
  };

  const handleReportClick = () => {
    setShowReportDialog(true);
  };

  const handleReportSubmit = async (reason: string) => {
    if (!matchedUser || !user) return;

    try {
      const { error } = await supabase.functions.invoke("report-user", {
        body: {
          reported_user_id: matchedUser.id,
          room_id: roomId,
          reason,
          description: `Reported via chat interface for ${reason.replace('_', ' ')}`,
        },
      });

      if (error) throw error;

      toast({
        title: "User Reported",
        description: "Thank you for helping keep our community safe",
      });

      setShowReportDialog(false);
      handleSkip();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to report user",
        variant: "destructive",
      });
    }
  };

  const handleFavorite = async () => {
    if (!matchedUser || !user) return;

    try {
      const { error } = await supabase
        .from("favorites")
        .insert({
          user_id: user.id,
          favorited_user_id: matchedUser.id,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Favorited",
            description: "You've already added this user to favorites",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Added to Favorites",
          description: "You can find them in your favorites list",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add favorite",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border px-2 md:px-4 py-2 md:py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/Duhuze_Logo.png" alt="Duhuze Logo" className="w-6 h-6 md:w-10 md:h-10 object-contain" />
          </div>
          <h1 className="text-lg md:text-xl font-semibold bg-gradient-hero bg-clip-text text-transparent">
            Duhuze
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-xs md:text-sm">
            <Home className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Home
          </Button>
        </div>
      </div>

      {/* Main Content - Omegle Style Layout */}
      <div className="flex-1 flex flex-col">
        {/* Video Section - 50/50 Split */}
        <div className="flex-1 flex flex-col md:flex-row gap-0">
          {/* Left Side - Local Video (You) */}
          <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative border-r border-gray-300">
            <div className="w-full h-full max-w-full max-h-full aspect-video md:aspect-auto flex items-center justify-center p-2">
              {localStream ? (
                <div className="relative w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                  <VideoPlayer stream={localStream} muted className="absolute inset-0 scale-x-[-1] rounded-lg" />
                  {(isVideoHiddenFromPartner || !videoVisibleToPartner) && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <VideoOff className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">{isVideoHiddenFromPartner ? "Hidden from partner" : "Video off"}</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    You
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Enable camera</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Remote Video (Stranger) */}
          <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative">
            <div className="w-full h-full max-w-full max-h-full aspect-video md:aspect-auto flex items-center justify-center p-2">
              {remoteStream ? (
                <div className="relative w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                  <VideoPlayer stream={remoteStream} className="absolute inset-0 rounded-lg" />
                  {matchedUser && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {(matchedUser.display_name && matchedUser.display_name.toLowerCase() !== "anonymous") ? matchedUser.display_name : "User"}
                    {matchedUser.age && `, ${matchedUser.age}`}
                  </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center z-10">
                    {searching ? (
                      <>
                        <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-gray-500 mb-2">Finding your match...</p>
                        <p className="text-xs text-gray-400">
                          Please wait while we connect you
                        </p>
                      </>
                    ) : matchedUser ? (
                      <>
                        <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                        <p className="font-semibold text-lg text-gray-700 mb-1">{(matchedUser.display_name && matchedUser.display_name.toLowerCase() !== "anonymous") ? matchedUser.display_name : "User"}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          {matchedUser.age && `${matchedUser.age} years old`}
                          {matchedUser.province && ` • ${matchedUser.province}`}
                        </p>
                        {/* Connection Status */}
                        <div className="flex items-center gap-2 justify-center">
                          <div className={`w-2 h-2 rounded-full ${
                            connectionState === 'connected' ? 'bg-green-500' :
                            connectionState === 'connecting' || isConnecting ? 'bg-yellow-500 animate-pulse' :
                            connectionState === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                          }`} />
                          <span className="text-xs text-gray-500 capitalize">
                            {connectionState === 'connected' ? 'Connected' :
                             connectionState === 'connecting' || isConnecting ? 'Connecting...' :
                             connectionState === 'failed' ? 'Connection Failed' : 'Disconnected'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-500">No connection</p>
                        {connectionState === 'failed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={handleReconnect}
                          >
                            Try Again
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Controls and Chat */}
        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
            {/* Left Side - Control Buttons */}
            <div className="flex-1 flex justify-center md:justify-start">
              <div className="flex gap-3 flex-wrap">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={handleNext}
                  disabled={searching}
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Next
                </Button>
                <Button
                  variant="destructive"
                  className="px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={() => navigate("/")}
                >
                  Stop
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-2 rounded-lg font-medium border-gray-300 hover:bg-gray-50"
                >
                  🌍 Country
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-2 rounded-lg font-medium border-gray-300 hover:bg-gray-50"
                >
                  👤 I am
                </Button>
              </div>
            </div>

            {/* Right Side - Chat */}
            <div className="flex-1 max-w-md">
              {/* Status Bar */}
              {matchedUser && (
                <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Connection established with {matchedUser.province || "User"}</span>
                  </div>
                  <button
                    onClick={handleReportClick}
                    className="text-red-500 hover:text-red-700 text-xs underline"
                  >
                    Report abuse
                  </button>
                </div>
              )}

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Write a message"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!matchedUser}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium"
                  disabled={!matchedUser || !message.trim()}
                >
                  Send
                </Button>
              </div>

              {/* Messages Display */}
              <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-600">
                    {error}
                  </div>
                )}
                {messages.slice(-3).map((msg) => (
                  <div
                    key={msg.id}
                    className={`text-xs p-2 rounded max-w-xs ${
                      msg.sender_id === user?.id
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Report User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Why are you reporting this user? This helps us maintain a safe community.
            </p>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => handleReportSubmit("inappropriate_behavior")}
              >
                🚫 Inappropriate Behavior
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => handleReportSubmit("harassment")}
              >
                😠 Harassment
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => handleReportSubmit("spam")}
              >
                📧 Spam
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => handleReportSubmit("underage")}
              >
                👶 Underage User
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => handleReportSubmit("other")}
              >
                ❓ Other
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;
