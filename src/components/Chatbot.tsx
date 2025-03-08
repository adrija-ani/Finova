import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import axios from "axios";

const GEMINI_API_KEY = "AIzaSyCicfNY-lyhzY3H84Leax5j6deMdcVQVPo"; // Replace with your actual API key
const ETHERSCAN_API_KEY = "YOUR_ETHERSCAN_API_KEY"; // Replace with your Etherscan API key
const GEMINI_MODEL = "gemini-2.0-flash";

// Function to fetch ETH Price
const fetchETHPrice = async () => {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    return Current Ethereum Price: $${response.data.ethereum.usd};
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    return "Unable to fetch Ethereum price at the moment.";
  }
};

// Function to check blockchain transaction status
const fetchTransactionStatus = async (txHash: string) => {
  try {
    const response = await axios.get(
      https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}
    );
    return response.data.result.status === "1"
      ? "Transaction is successful ✅"
      : "Transaction failed ❌";
  } catch (error) {
    console.error("Error fetching transaction status:", error);
    return "Unable to check transaction status.";
  }
};

const predefinedResponses: { [key: string]: string | Function } = {
  "What is the current Ethereum price?": fetchETHPrice,
  "Check transaction status": fetchTransactionStatus,
  "Do you provide investment suggestions?": "Yes, we analyze market trends and provide AI-driven investment insights.",
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI financial assistant. How can I help you today?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchGeminiResponse = async (userInput: string) => {
    try {
      const requestData = {
        contents: [{ parts: [{ text: userInput }] }],
      };

      const response = await axios.post(
        https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY},
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini API error:", error);
      return "I apologize, but I'm having trouble processing your request right now.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);

    setIsLoading(true);
    let responseText: string = "";

    if (predefinedResponses[userMessage]) {
      if (typeof predefinedResponses[userMessage] === "function") {
        responseText = await predefinedResponses[userMessage](userMessage);
      } else {
        responseText = predefinedResponses[userMessage] as string;
      }
    } else {
      responseText = await fetchGeminiResponse(userMessage);
    }

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
              <h3 className="text-lg font-semibold">AI Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={flex ${message.isUser ? "justify-end" : "justify-start"}}
                >
                  <div className={max-w-[80%] p-3 rounded-lg ${message.isUser ? "bg-blue-500" : "bg-gray-800"}}>{message.text}</div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                >
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