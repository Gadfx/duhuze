import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatInterface from "@/components/ChatInterface";

export default function VideoChat() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <ChatInterface />
    </div>
  );
}
