
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Send,
  Bot,
  User,
  LoaderCircle
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatPanel() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Reference to the chat messages container
  const messagesEndRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    const chatContainer = messagesEndRef.current;

    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, loading]);

  const askQuestion = async () => {
    if (!question.trim() || loading) return;

    const userQuestion = question.trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userQuestion }
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("question", userQuestion);

      const response = await axios.post(
        "http://localhost:8082/api/rag/ask",
        params
      );

      const answer =
        typeof response.data === "string"
          ? response.data
          : response.data.answer || JSON.stringify(response.data);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answer }
      ]);

    } catch (error) {
      console.error("RAG API Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Unable to connect to the RAG backend. Please check whether Spring Boot is running."
        }
      ]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-panel">

      {/* Chat Messages */}
      <div className="chat-messages" ref={messagesEndRef}>

        {messages.length === 0 && (
          <div className="chat-empty">
            <Bot size={40} />
            <h3>Ask your Documents</h3>
            <p>
              Ask questions about your uploaded PDF and Excel files.
              Answers containing tables will be displayed in table format.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.role === "user" ? "user" : "assistant"
            }`}
          >

            <div className="message-avatar">
              {message.role === "user" ? (
                <User size={18} />
              ) : (
                <Bot size={18} />
              )}
            </div>

            <div className="message-content">

              <div className="message-role">
                {message.role === "user" ? "You" : "RAG Assistant"}
              </div>

              {message.role === "assistant" ? (
                <div className="markdown-answer">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p>{message.content}</p>
              )}

            </div>
          </div>
        ))}

        {/* AI Loading Indicator */}
        {loading && (
          <div className="message assistant">
            <div className="message-avatar">
              <Bot size={18} />
            </div>

            <div className="message-content">
              <LoaderCircle className="loading-icon" size={20} />
              <span>Thinking...</span>
            </div>
          </div>
        )}

      </div>

      {/* Chat Input */}
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Ask anything about your documents..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") askQuestion();
          }}
        />

        <button
          onClick={askQuestion}
          disabled={loading || !question.trim()}
        >
          <Send size={18} />
        </button>
      </div>

      <div className="chat-footer">
        RAG Assistant · Spring AI · Groq
      </div>

    </div>
  );
}

export default ChatPanel;
