"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface Message {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  first_name: string;
  last_name: string;
}

interface ForumProps {
  collegeId: number;
}

export default function Forum({ collegeId }: ForumProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  };

  // Scroll to bottom on initial load

  useEffect(() => {
    const fetchMessagesAndUser = async () => {
      try {
        // Get user first
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          return;
        }
        setUser(currentUser);

        // Then fetch messages - simplified query
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .eq('college_id', collegeId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }

        setMessages(messages || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchMessagesAndUser();

    // Update realtime subscription
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `college_id=eq.${collegeId}`,
        },
        async (payload) => {
          // No need to fetch user details separately
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collegeId, supabase]);

  useEffect(() => {
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      // Get user details first
      const { data: userData } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      // Insert the message
      const { data: newMessageData, error } = await supabase
        .from('messages')
        .insert({
          message: newMessage.trim(),
          college_id: collegeId,
          user_id: user.id,
          first_name: userData?.first_name,
          last_name: userData?.last_name
        })
        .select()
        .single();

      if (error) throw error;
      
      // Add the new message to local state immediately
      if (newMessageData) {
        const messageWithUser = {
          ...newMessageData,
          first_name: userData?.first_name,
          last_name: userData?.last_name
        };
        
        // Check if message already exists before adding
        setMessages(prev => {
          const messageExists = prev.some(msg => msg.id === messageWithUser.id);
          if (messageExists) {
            return prev;
          }
          return [...prev, messageWithUser];
        });
      }


      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
      scrollToBottom();

    }
  };

  if (initialLoading || !user) {
    return (
      <div className="flex flex-col h-[600px]">
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-4 bg-black/20 rounded-lg">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`flex flex-col ${i % 2 === 0 ? 'items-end' : 'items-start'}`}
            >
              {/* Skeleton name */}
              <div className="h-3 bg-zinc-800/50 rounded w-20 mb-1 mx-2"></div>

              {/* Skeleton message */}
              <div className={`
                ${i % 2 === 0 
                  ? 'bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/10' 
                  : 'bg-zinc-800/30 border border-zinc-700/20'
                }
                rounded-2xl p-4 max-w-[80%]
                ${i % 2 === 0 ? 'rounded-tr-sm' : 'rounded-tl-sm'}
              `}>
                <div className="h-4 bg-zinc-800/50 rounded w-32 mb-2"></div>
                {i % 2 === 0 && <div className="h-4 bg-zinc-800/50 rounded w-40"></div>}
                <div className="h-2 bg-zinc-800/50 rounded w-12 mt-2 ml-auto"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Disabled input while loading */}
        <div className="flex gap-2 bg-black/20 p-4 rounded-lg">
          <div className="flex-1 p-3 rounded-lg bg-black/30 border border-zinc-700 text-sm text-zinc-600">
            Loading messages...
          </div>
          <button
            disabled
            className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/50 rounded-lg font-medium text-purple-400/50 flex items-center gap-2 opacity-50"
          >
            <span>Send</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-4 bg-black/20 rounded-lg scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {messages.length == 0 ? <h1>No one is here... </h1>: <></>}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.user_id === user?.id ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender's name */}
            <span className="text-xs text-zinc-500 mb-1 px-2">
              {message.user_id === user?.id ? 'You' : `${message.first_name} ${message.last_name}`}
            </span>

            {/* Message bubble */}
            <div
              className={`group relative max-w-[80%] px-4 py-2 rounded-2xl 
                ${message.user_id === user?.id 
                  ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/20' 
                  : 'bg-zinc-800/50 border border-zinc-700/30'
                }
                ${message.user_id === user?.id ? 'rounded-tr-sm' : 'rounded-tl-sm'}
              `}
            >
              {/* Message content */}
              <p className="text-white text-sm">{message.message}</p>
              
              {/* Timestamp */}
              <span className="text-[10px] text-zinc-500 mt-1 block text-right">
                {new Date(message.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} className="h-0" />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 bg-black/20 p-4 rounded-lg">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-lg bg-black/30 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none text-white text-sm"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500 hover:to-cyan-500 border border-purple-500/50 hover:border-transparent rounded-lg font-medium text-purple-400 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span>Send</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
            />
          </svg>
        </button>
      </form>
    </div>
  );
} 