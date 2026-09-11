import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Loader2, Bot, UserCircle, Brain } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

const AiChatBox = ({ docID, title }) => {
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);
    const { isChatting, chatMessages, getAIchat, fetchChatHistory, isFetchingHistory } = useChatStore();
    
    useEffect(() => {
        if (docID) {
            fetchChatHistory(docID);
        }
    }, [docID, fetchChatHistory]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isChatting]);

    const handleSend = async () => {
        if (!input.trim() || isChatting) return;
        const ques_message = input;
        setInput('');
        try {
            await getAIchat(docID, ques_message);
        } catch (error) {
            setInput(ques_message);
        }
    };

    return (
        <div className="flex flex-col flex-1 h-full bg-base-100 overflow-hidden select-none">
            
            <div className="pb-4 border-b border-base-content/5 bg-base-100 flex items-center gap-2.5 shrink-0">
                <div className="bg-primary/10 p-2 rounded-xl border border-primary/5">
                    <Brain className="text-primary" size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-base-content">AI Study Assistant</h3>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-wider">Contextual Chat Model</p>
                </div>
            </div>

            {isFetchingHistory ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-60">
                    <Loader2 className="animate-spin text-primary" size={24} />
                    <p className="text-xs font-bold tracking-wide">Fetching Chat History...</p>
                </div>
            ) : chatMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto">
                    <div className="bg-base-200/50 border border-base-content/5 p-5 rounded-full mb-4">
                        <Brain size={32} className="text-primary" />
                    </div>
                    <h2 className="text-base font-bold text-base-content">Ask anything about the document</h2>
                    <p className="text-xs text-base-content/50 mt-1.5 leading-relaxed">Ask for definitions, structural breakdowns, formulas, or general evaluations regarding <span className="font-semibold text-primary">"{title}"</span>.</p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto py-6 px-1 space-y-4 custom-scrollbar min-h-0">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}>
                            <div className="chat-image avatar opacity-80">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-base-200 border border-base-content/5">
                                    {msg.role === 'user' ? (
                                        <UserCircle size={22} className="text-base-content/60" />
                                    ) : (
                                        <Brain className="text-primary" size={16} />
                                    )}
                                </div>
                            </div>

                            <div className={`chat-bubble shadow-sm max-w-[85%] text-sm leading-relaxed p-4 rounded-2xl ${
                                msg.role === 'user' 
                                    ? 'bg-primary text-primary-content font-medium rounded-tr-none' 
                                    : 'bg-base-200 text-base-content rounded-tl-none border border-base-content/5'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    
                    {isChatting && (
                        <div className="chat chat-start">
                            <div className="chat-image avatar opacity-80">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-base-200 border border-base-content/5">
                                    <Brain className="text-primary" size={16} />
                                </div>
                            </div>
                            <div className="chat-bubble bg-base-200 text-base-content border border-base-content/5 flex items-center gap-2.5 text-xs font-semibold px-4 py-3 rounded-2xl rounded-tl-none">
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                                <span className="opacity-50 tracking-wide">AI is analyzing context...</span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            )}

            <div className="pt-4 border-t border-base-content/5 bg-base-100 shrink-0">
                <div className="flex items-center gap-2 bg-base-200/70 border border-base-content/5 rounded-2xl px-4 py-1.5 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-200">
                    <input
                        type="text"
                        placeholder="Type your question here..."
                        className="bg-transparent border-none focus:ring-0 w-full py-2.5 text-sm text-base-content placeholder-base-content/30 font-medium focus:outline-none"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isChatting}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isChatting}
                        className="text-primary disabled:opacity-20 p-1.5 hover:bg-base-100 rounded-xl transition-colors duration-200 flex-shrink-0"
                    >
                        <SendHorizontal size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--bc), 0.08); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default AiChatBox;