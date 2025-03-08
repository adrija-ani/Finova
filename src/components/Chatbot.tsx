import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import axios from "axios";

const GEMINI_API_KEY = "AIzaSyCicfNY-lyhzY3H84Leax5j6deMdcVQVPo";
const GEMINI_MODEL = "gemini-2.0-flash";

// Predefined responses
const predefinedResponses = {
  "What types of startups do you invest in?":
    "We focus on AI, fintech, blockchain, and emerging technologies, but we're open to disruptive ideas in other sectors.",
  "Do you only provide funding?":
    "No, we offer mentorship, industry connections, and strategic guidance to help startups succeed.",
  "How can I apply for investment or mentorship?":
    "You can apply through our website by filling out the application form. Our team will review your proposal and get in touch.",
};

const fetchGeminiResponse = async (userInput) => {
  try {
    // Enhanced prompt with instructions for brevity
    const enhancedPrompt = `
      You are FINOVA, a concise financial assistant chatbot. 
      Provide brief, direct answers in 1-2 sentences maximum.
      Avoid unnecessary explanations, introductions, or conclusions.
      Question: ${userInput}
    `;

    const requestData = { 
      contents: [{ parts: [{ text: enhancedPrompt }] }],
      generationConfig: {
        maxOutputTokens: 150 // Limit the response length
      }
    };
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      requestData,
      { headers: { "Content-Type": "application/json" } }
    );
    
    let aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    
    // Further processing for brevity
    aiResponse = aiResponse
      .replace(/\bAI\b|\bchatbot\b|\bmodel\b/g, "FINOVA")
      .replace(/^(Hi|Hello|Greetings|Hey).*?\,\s*/i, "") // Remove greetings
      .replace(/\s*As FINOVA,\s*/i, "") // Remove self-references
      .replace(/\.(.*)/s, ".") // Keep only the first sentence if multiple
      .trim();
      
    return aiResponse;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "I apologize, but FINOVA is having trouble processing your request right now.";
  }
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm FINOVA. How can I help you today?", isUser: false }, // Shortened initial message
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    let responseText = predefinedResponses[userMessage] || await fetchGeminiResponse(userMessage);

    setMessages((prev) => [...prev, { text: responseText, isUser: false }]);
    setIsLoading(false);
  };

  return (
    <>
      <motion.button
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 w-96 bg-gray-900 rounded-lg shadow-xl"
          >
            <div className="p-4 border-b border-gray-700 flex justify-between">
              <h3 className="text-lg font-semibold">FINOVA Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${message.isUser ? "bg-blue-500" : "bg-gray-800"}`}>{message.text}</div>
                </motion.div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." disabled={isLoading} className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2" />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={isLoading} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
