
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import Logo from './Logo';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: string;
}

interface WhatsAppChatProps {
    onBack: () => void;
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ onBack }) => {
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: '1', 
            text: "Bonjour ! Je suis l'assistant numérique du cabinet KSLB. 👨‍⚕️\n\nJe suis là pour vous aider à remplir votre bilan de santé avant votre rendez-vous. Pour commencer, quel est votre prénom et votre nom ?", 
            sender: 'bot', 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initialize Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chatSession = useRef<any>(null);

    useEffect(() => {
        chatSession.current = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: `Vous êtes un assistant médical intelligent pour le cabinet de kinésithérapie KSLB. 
                Votre rôle est de mener un entretien professionnel et bienveillant via WhatsApp pour remplir des questionnaires de santé.
                
                RÈGLES :
                1. Parlez en Français. Soyez poli, empathique et concis (ton WhatsApp).
                2. Posez UNE SEULE question à la fois.
                3. Commencez par l'identité (Nom, Prénom, Numéro de Sécurité Sociale).
                4. Enchaînez sur le motif de consultation (où avez-vous mal ?).
                5. Adaptez vos questions suivantes selon la zone douloureuse (si c'est le dos, posez des questions sur l'Oswestry).
                6. Si l'utilisateur donne une réponse floue, demandez des précisions avec tact.
                7. Ne donnez JAMAIS de diagnostic médical, rappelez que vous préparez le bilan pour le kiné.
                8. Utilisez quelques emojis pour rendre la conversation humaine mais professionnelle.`,
            }
        });
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const result = await chatSession.current.sendMessage({ message: inputValue });
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: result.text,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Gemini Error:", error);
            const errorMsg: Message = {
                id: 'err',
                text: "Désolé, j'ai rencontré un petit problème technique. Pouvons-nous reprendre ?",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] w-full max-w-2xl mx-auto border-x bg-white shadow-2xl overflow-hidden animate-in fade-in duration-500">
            {/* Header style WhatsApp */}
            <div className="bg-[#075E54] p-4 flex items-center gap-3 text-white">
                <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <Logo className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Assistant KSLB</h3>
                    <p className="text-[10px] text-green-200">En ligne</p>
                </div>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 wa-chat-bg flex flex-col gap-3">
                {messages.map((m) => (
                    <div 
                        key={m.id} 
                        className={`max-w-[85%] rounded-lg p-3 shadow-sm relative text-sm animate-in zoom-in-95 duration-200 ${
                            m.sender === 'bot' 
                            ? 'bg-white self-start text-gray-800 rounded-tl-none' 
                            : 'bg-[#DCF8C6] self-end text-gray-900 rounded-tr-none'
                        }`}
                    >
                        <p className="whitespace-pre-wrap">{m.text}</p>
                        <span className="block text-[9px] text-gray-400 text-right mt-1">{m.timestamp}</span>
                    </div>
                ))}
                {isTyping && (
                    <div className="bg-white self-start rounded-lg rounded-tl-none p-3 shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#F0F0F0] flex items-center gap-2">
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Tapez un message..."
                    className="flex-1 bg-white p-3 rounded-full text-sm outline-none shadow-inner border border-gray-200 focus:ring-1 focus:ring-green-400"
                />
                <button 
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="w-11 h-11 bg-[#075E54] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-45" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </div>
            
            <div className="bg-white px-4 py-2 text-center border-t">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                    Les données sont sécurisées et envoyées directement à votre praticien.
                </p>
            </div>
        </div>
    );
};

export default WhatsAppChat;
