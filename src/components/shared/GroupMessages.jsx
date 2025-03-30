import React, { useState, useEffect } from "react";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function GroupMessages({ group_id }) {
  const [message, setMessage] = useState("");
  const [messageCollection, setMessageCollection] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = JSON.parse(localStorage.getItem("sport-science-token"));
    if (storedToken?.user) {
      setUser(storedToken.user);
    }
    handleGetMessages();
  }, []);

  const handleGetMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const token = JSON.parse(localStorage.getItem("sport-science-token"));
      if (!token || !token.token) return;

      const responseMessages = await fetch(
        `${API_BASE_URL}/api/communication/groupchats/${group_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
        }
      );

      if (!responseMessages.ok) {
        throw new Error("Failed to fetch messages");
      }

      const dataMessages = await responseMessages.json();
      setMessageCollection(
        Array.isArray(dataMessages?.group_chat?.messages)
          ? dataMessages.group_chat.messages
          : []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError("");

    try {
      const token = JSON.parse(localStorage.getItem("sport-science-token"));
      if (!token || !token.token) return;

      const responseSend = await fetch(
        `${API_BASE_URL}/api/communication/groupchats/${group_id}/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!responseSend.ok) {
        throw new Error("Failed to send message");
      }

      setMessage(""); // Clear input
      handleGetMessages(); // Refresh messages after sending
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="shadow col-span-3 p-2">
      <h1 className="text-gray-600">Group Messages</h1>
      <div className="h-80 overflow-y-auto p-3 space-y-2">
        {messageCollection.length > 0 ? (
          messageCollection.map((msg) => (
            <div
              key={msg?.id}
              className={`flex ${
                msg?.sender?.id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  msg?.sender?.id === user?.id
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full overflow-hidden">
                    <img
                      src={
                        user?.user?.profile
                          ? `${API_BASE_URL}/storage/${user.user.profile}`
                          : "/assets/profile/default-profile.png"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {msg?.sender?.name}
                </p>
                <p className="py-2">{msg?.message}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {format(new Date(msg?.created_at), "MMM d, yyyy • h:mm a")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center mt-10">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>
      {/* Message Input */}
      <form onSubmit={handleSubmit} className="border p-2 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 outline-none"
        />
        <button type="submit" disabled={loading} className="ml-2">
          {loading ? "Sending..." : <FontAwesomeIcon icon={faPaperPlane} />}
        </button>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </form>
    </div>
  );
}
