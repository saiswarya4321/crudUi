import React, { useEffect, useState } from "react"
import { supabase } from "../supabase-client"
import { toast } from "react-toastify"
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'

export default function Messages() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate=useNavigate()
 
  useEffect(() => {
    getCurrentUser()
    fetchUsers()
  }, [])

  const getCurrentUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

 
  const fetchUsers = async () => {
    try {
        setLoading(true)
        const { data } = await supabase
      .from("users") 
      .select("id, name")

    setUsers(data || [])
        
    } catch (error) {
        console.log(error.message)
        toast.error("Error in listing")
    }
    finally{
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
    console.log("session data",data)
    const token = data.session?.access_token
    const anon_key=import.meta.env.VITE_SUPABASE_ANON_KEY
    console.log("Token",token)
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
      sender_id:user.id
    }),
  }
)

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.error || "Failed to send")
    }

    toast.success("Message sent ✅")
    setMessage("")
    navigate("/messagesdashboard")
  } catch (error) {
    console.log(error)
    toast.error("Error on sending message")
  } finally {
    setLoading(false)
  }
}

 {loading && <p>Loading...</p>
 } 
  return (
    <div className="p-5 max-w-md mx-auto">
        <Sidebar/>
        <div className="bg-blue-100 p-6 shadow-xl rounded-xl  mt-10 ">
<h2 className="text-xl font-bold mb-4">Send Message</h2>

      
      <select
        className=" p-2 w-full mb-3 rounded border border-gray-400"
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select User</option>

        {users
          .filter((u) => u.id !== user.id)
          .map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
      </select>

      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="rounded border border-gray-400 p-2 w-full mb-3"
        placeholder="Type your message..."
      />

      
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 w-full rounded shadow"
      >
        Send
      </button>
        </div>
      
    </div>
  )
}