import { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("https://virtus-ai.vercel.app/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      if (data && data.reply) {
        const aiMessage = { role: "assistant", content: data.reply };
        setMessages([...newMessages, aiMessage]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "No response from Virtus." }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Could not contact Virtus." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", textAlign: "center", marginBottom: "1rem" }}>VIRTUS</h1>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem", background: "#111", borderRadius: "8px", maxHeight: "60vh", overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ whiteSpace: "pre-wrap", textAlign: msg.role === "user" ? "right" : "left", color: msg.role === "user" ? "#0af" : "#f44", marginBottom: "0.75rem" }}>
            {msg.content}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: "800px", margin: "1rem auto 0", display: "flex", gap: "0.5rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Speak to Virtus..."
          style={{ flex: 1, padding: "0.5rem", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px" }}
        />
        <button onClick={handleSend} disabled={loading} style={{ padding: "0.5rem 1rem", background: "#f44", color: "#fff", border: "none", borderRadius: "4px" }}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}