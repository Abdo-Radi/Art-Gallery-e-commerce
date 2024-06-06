import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chatbot.css";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatHistoryRef = useRef(null); // Ref for chat history container

  const greetings = [
    "Hello! How can I assist you today?",
    "Hi there! How can I help you?",
    "Greetings! What can I do for you?",
    "Welcome! How can I be of service?",
    "Hey! Need any help?",
  ];

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (question.trim() === "") return;
    const newChatHistory = [...chatHistory, { type: "user", text: question }];
    setChatHistory(newChatHistory);
    setIsTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        question,
      });
      setTimeout(() => {
        setIsTyping(false);
        setChatHistory([
          ...newChatHistory,
          { type: "bot", text: response.data.answer },
        ]);
      }, 2000);
    } catch (error) {
      console.error("Error sending message:", error);
      setTimeout(() => {
        setIsTyping(false);
        setChatHistory([
          ...newChatHistory,
          { type: "bot", text: "Error: Could not get a response." },
        ]);
      }, 1000);
    }
    setQuestion("");
  };

  const handleOpenChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      const randomGreeting =
        greetings[Math.floor(Math.random() * greetings.length)];
      setChatHistory([...chatHistory, { type: "bot", text: randomGreeting }]);
    }
  };

  return (
    <div>
      <button className="chatbot-button" onClick={handleOpenChat}>
        💬
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h1>Chatbot</h1>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              &times;
            </button>
          </div>
          <div className="chatbot-messages" ref={chatHistoryRef}>
            {chatHistory.map((entry, index) => (
              <div
                key={index}
                className={entry.type}
                style={{
                  textAlign: entry.type === "user" ? "right" : "left",
                }}
              >
                <strong>{entry.type === "user" ? "You" : "Bot"}:</strong>{" "}
                {entry.text}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <strong>Bot:</strong> <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
            )}
          </div>
          <div className="chatbot-input-container">
            <input
              className="text-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button onClick={handleSend} className="send">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
