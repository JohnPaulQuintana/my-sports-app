import React, { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function GroupMessages({ group_id }) {
  const [message, setMessage] = useState("");
  const [messageCollection, setMessageCollection] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  // Preview modal state
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

      const response = await fetch(`${API_BASE_URL}/api/communication/groupchats/${group_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setMessageCollection(Array.isArray(data?.group_chat?.messages) ? data.group_chat.messages : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAttachment(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachmentPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setAttachmentPreview(null);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !attachment) return;

    setLoading(true);
    setError("");

    try {
      const token = JSON.parse(localStorage.getItem("sport-science-token"));
      if (!token || !token.token) return;

      const formData = new FormData();
      formData.append("message", message.trim() || "Attachment uploaded");
      if (attachment) formData.append("attachment", attachment);

      const response = await fetch(`${API_BASE_URL}/api/communication/groupchats/${group_id}/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to send message");

      setMessage("");
      setAttachment(null);
      setAttachmentPreview(null);
      handleGetMessages();
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
    <div className="shadow col-span-3 p-2 relative">
      <h1 className="text-gray-600">Group Messages</h1>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-3 space-y-2">
        {messageCollection.length > 0 ? (
          messageCollection.map((msg) => (
            <div key={msg?.id} className={`flex ${msg?.sender?.id === user?.id ? "justify-end" : "justify-start"}`}>
              <div className={`p-2 rounded-lg max-w-xs ${msg?.sender?.id === user?.id ? "bg-primary text-white" : "bg-gray-200 text-black"}`}>
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

                {/* Attachment display */}
                {msg?.attachment && (
                  <div className="mt-2 overflow-hidden">
                    {msg.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={`${API_BASE_URL}/storage/${msg.attachment}`}
                        alt="attachment"
                        className="max-w-xs rounded cursor-pointer hover:opacity-80 transition object-cover"
                        onClick={() => {
                          setPreviewAttachment(`${API_BASE_URL}/storage/${msg.attachment}`);
                          setIsPreviewOpen(true);
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => {
                          setPreviewAttachment(`${API_BASE_URL}/storage/${msg.attachment}`);
                          setIsPreviewOpen(true);
                        }}
                        className="text-blue-600 underline"
                      >
                        View Attachment
                      </button>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-600 mt-1">
                  {format(new Date(msg?.created_at), "MMM d, yyyy • h:mm a")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center mt-10">No messages yet. Start the conversation!</div>
        )}
      </div>

      {/* Message input */}
      <form onSubmit={handleSubmit} className="mt-4 p-2 border-t">
  <div className="flex items-end gap-2">
    {/* Attachment Button */}
    <label className="cursor-pointer relative flex items-center justify-center bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-lg w-10 h-10">
      📎
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </label>

    {/* Text Input */}
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message..."
      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    />

    {/* Send Button */}
    <button
      type="submit"
      disabled={loading}
      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
    >
      {loading ? "Sending..." : <FontAwesomeIcon icon={faPaperPlane} />}
    </button>
  </div>

  {/* Attachment Preview */}
  {attachment && (
    <div className="flex items-center mt-2 gap-3 bg-gray-100 border border-gray-300 p-2 rounded-lg">
      {attachmentPreview ? (
        <img
          src={attachmentPreview}
          alt="Preview"
          className="h-16 w-16 object-cover rounded"
        />
      ) : (
        <div className="text-sm text-gray-700 truncate max-w-xs">
          <strong>File:</strong> {attachment.name}
        </div>
      )}
      <button
        type="button"
        onClick={handleRemoveAttachment}
        className="text-red-500 text-sm hover:underline"
      >
        Remove
      </button>
    </div>
  )}

  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
</form>


      {/* Attachment Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 max-w-3xl w-full relative">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute text-xl top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            {previewAttachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img src={previewAttachment} alt="Preview" className="w-full max-h-[80vh] rounded" />
            ) : (
              <iframe src={previewAttachment} title="Preview" className="w-full h-[70vh] rounded" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
