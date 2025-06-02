'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
}

export default function PsychologistChatDetailPage() {
  const { user_id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/messages/${user_id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/me/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await res.json();
      setCurrentUserId(data.id);
    } catch (err) {
      console.error('Failed to get current user:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const res = await fetch(`http://localhost:8000/api/v1/messages/${user_id}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
      body: JSON.stringify({ message: input }),
    });

    if (res.ok) {
      setInput('');
      fetchMessages(); // refresh immediately
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchCurrentUser();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [user_id]);

  useEffect(() => {
    // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <div className="flex-1 overflow-y-auto p-4 bg-[#f1ebe3] border rounded space-y-2">
        {messages.map((msg) => {
          const isMe = msg.sender === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`p-2 rounded-lg max-w-xs text-sm shadow ${
                  isMe ? 'bg-green-200 text-right' : 'bg-white text-left border'
                }`}
              >
                <div>{msg.message}</div>
                <div className="text-[10px] text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
