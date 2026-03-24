import { supabase } from '@/supabase-client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'

function messageDashboard() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [chatMessages, setChatMessages] = useState([])
    const [message, setMessage] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        try {
            const { error, data } = await supabase.auth.getUser()
            if (error) throw error
            setUser(data.user)
        } catch (error) {
            console.log(error.message)
        }
    }

    //  Sidebar list (users + last message)
    const fetchMessages = async () => {
        try {
            setLoading(true)
            const { error, data } = await supabase
                .from("messages")
                .select(`
  *,
  sender:sender_id(name),
  receiver:receiver_id(name)
`)
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order("created_at", { ascending: false })

            if (error) throw error
            const uniqueUsersMap = new Map()

            data.forEach((msg) => {
                const otherUserId =
                    msg.sender_id === user.id ? msg.receiver_id : msg.sender_id

                if (!uniqueUsersMap.has(otherUserId)) {
                    uniqueUsersMap.set(otherUserId, msg)
                }
            })

            setMessages(Array.from(uniqueUsersMap.values()))
        } catch (error) {
            console.log(error)
            toast.error("Error in fetching")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user?.id) {
            fetchMessages()
        }
    }, [user])

    
    useEffect(() => {
  if (!user?.id) return

  const channel = supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      },
      (payload) => {
        const newMsg = payload.new

        // 🔥 Only update if message belongs to current chat
        if (
          newMsg.sender_id === user.id ||
          newMsg.receiver_id === user.id
        ) {
          setChatMessages((prev) => [...prev, newMsg])
        }
      }
    )
    .subscribe()

  // cleanup
  return () => {
    supabase.removeChannel(channel)
  }
}, [user])

    // Full conversation
    const fetchConversation = async (otherUserId) => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("messages")
                .select(`
          *,
          sender:sender_id(name)
        `)
                .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
                .order("created_at", { ascending: true })

            if (error) throw error
            setChatMessages(data)
            console.log("chat data", data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = async () => {
        try {
            if (!message || !selectedUser) {
                toast.error("Select user and type message")
                return
            }

            setLoading(true)

            // get access token
            const { data } = await supabase.auth.getSession()
            console.log("session data", data)
            const token = data.session?.access_token
            const anon_key = import.meta.env.VITE_SUPABASE_ANON_KEY
            console.log("Token", token)
            if (!token) {
                toast.error("User session is invalid. Please login again.", { position: "top-center" });
                return;
            }

            //  call Edge Function
            const res = await fetch(
                "https://wjwzccjwonubfjfvteop.supabase.co/functions/v1/quick-handler",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${anon_key}`,

                    },
                    body: JSON.stringify({
                        text: message,
                        receiver_id: selectedUser,
                        sender_id: user.id
                    }),
                }
            )

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.error || "Failed to send")
            }

            toast.success("Message sent ✅")
            setMessage("")

        } catch (error) {
            console.log(error)
            toast.error("Error on sending message")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex'>
            <Sidebar />

            {/* LEFT SIDE (User list) */}
            <div className='w-1/3 border-r-gray-300 p-4 ml-74 rounded shadow'>
                <h2 className='font-bold mb-3'>Messages</h2>

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        onClick={() => {
                            const otherUserId =
                                msg.sender_id === user.id ? msg.receiver_id : msg.sender_id

                            setSelectedUser(otherUserId)
                            fetchConversation(otherUserId)
                        }}
                        className='p-3 border-blue-400 mb-2 cursor-pointer hover:bg-blue-200 bg-blue-400 shadow-xl rounded'
                    >
                        <p className='text-gray-300'>
                            {msg.sender_id === user.id
                                ? msg.receiver?.name
                                : msg.sender?.name}
                        </p>
                        <p className='text-sm text-gray-200 truncate'>
                            {msg.text}
                        </p>
                    </div>
                ))}
                <div><Button className='bg-green-700 p-6 text-gray-100' onClick={() => navigate("/messages")}>New chat</Button></div>
            </div>

            {/* RIGHT SIDE (Chat area) */}
            <div className='w-2/3 p-4 bg-blue-100 rounded-xl'>
                {!selectedUser ? (
                    <p>Select a user to view messages</p>
                ) : (
                    <div>
                        <h2 className='font-bold mb-4'>Chat</h2>

                        {chatMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`mb-2 p-2 rounded w-fit ${msg.sender_id === user.id
                                        ? "bg-blue-500 text-white ml-auto"
                                        : "bg-gray-300"
                                    }`}
                            >
                                {msg.text}
                                <small className='m-2'>
  {new Date(msg.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })}
</small>
                            </div>
                            
                        ))}
                        <div className="mt-4 flex gap-2">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="border-gray-200 p-2 flex-1 rounded bg-white shadow"
                            />

                            <button
                                onClick={sendMessage}
                                className="bg-blue-500 text-white px-4 rounded"
                            >
                                Send
                            </button>
                        </div>
                    </div>

                )}
            </div>

        </div>
    )
}

export default messageDashboard