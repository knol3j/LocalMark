import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Image as ImageIcon, Sparkles, Loader2, Camera, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { marketingModel } from '../lib/gemini';
import { useCollaboration } from './CollaborationProvider';

interface ChatPanelProps {
  externalPrompt?: string;
}

export default function ChatPanel({ externalPrompt }: ChatPanelProps) {
  const { user, messages, sendMessage: syncMessage } = useCollaboration();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalPrompt) {
      setInput(externalPrompt);
    }
  }, [externalPrompt]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const currentInput = input;
    const currentImage = selectedImage;

    // First sync the user message
    await syncMessage('user', currentInput, currentImage || undefined);
    
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      let responseText = '';
      if (currentImage) {
        const base64Data = currentImage.split(',')[1];
        const mimeType = currentImage.split(';')[0].split(':')[1];
        responseText = await marketingModel.analyzeAssets(base64Data, mimeType, currentInput || "Analyze this marketing asset.");
      } else {
        responseText = await marketingModel.generateCopy(currentInput);
      }

      await syncMessage('assistant', responseText || "I couldn't process that request.");
    } catch (error) {
      console.error(error);
      await syncMessage('assistant', "Error: Failed to connect to the marketing engine.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div 
      className={`flex flex-col h-full transition-colors ${isDragging ? 'bg-indigo-500/5' : 'bg-transparent'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 backdrop-blur-md ${
                msg.role === 'user' 
                  ? 'bg-indigo-600/40 border border-indigo-400/30 text-white shadow-lg shadow-indigo-500/10' 
                  : 'bg-white/5 border border-white/10 text-slate-200'
              }`}>
                {msg.image && (
                  <img 
                    src={msg.image} 
                    alt="Uploaded" 
                    className="max-w-full rounded-xl mb-3 border border-white/10 shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed group/msg relative">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                  
                  {msg.role === 'assistant' && (
                    <button 
                      onClick={() => copyToClipboard(msg.content, i)}
                      className="absolute -top-4 -right-4 bg-slate-800 border border-white/10 rounded-lg p-1.5 opacity-0 group-hover/msg:opacity-100 transition-opacity hover:bg-slate-700 shadow-xl"
                    >
                      {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span className="text-xs font-mono text-slate-500 italic">SYSTEM processing vision tokens...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 mx-4 mb-4 bg-white/10 border border-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl z-30">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 text-slate-400 border-b border-white/5 pb-2 px-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
            >
              <Paperclip className="w-4 h-4" />
              Add Reference
            </button>
            <button className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors">
              <Camera className="w-4 h-4" />
              Capture
            </button>
            <div className="ml-auto font-mono text-[10px] opacity-30">CMD+K FOR SHORTCUTS</div>
          </div>

          <div className="max-w-none relative flex items-center gap-4 px-2">
            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute -top-32 left-0 p-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl shadow-2xl"
                >
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  <img src={selectedImage} alt="Preview" className="h-20 w-auto rounded-lg" referrerPolicy="no-referrer" />
                </motion.div>
              )}
            </AnimatePresence>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Describe campaign target or upload product assets..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-sm py-2"
            />
            
            <button 
              onClick={handleSend}
              disabled={loading || (!input.trim() && !selectedImage)}
              className="w-10 h-10 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 disabled:hover:bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all shrink-0"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
