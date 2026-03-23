import React from 'react'
import { useEffect, useState } from "react"
import { supabase } from '../supabase-client'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
export default function dashboard() {
    const navigate=useNavigate()
    const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser()

      if (error) throw error

      setUser(data.user)
      console.log(data.user)
      if (!data.user) {
  navigate("/login")
}

    } catch (err: any) {
      console.log(err.message)
    }
  }
 
   
 
  return (
       <div className="flex min-h-screen">
      
      
      <Sidebar />

     
      <div className="flex-1 bg-gray-100 flex justify-center items-center rounded-xl shadow-xl ml-64 p-5">
        
        <div className="bg-blue-400 text-white p-10 w-[300px] md:w-[900px] lg:w-[1100px] shadow rounded">
          
          {user ? (
            <div>
              <p><b>Welcome</b> {user.name}</p>
              <p><b>User ID:</b> {user.id}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}

        </div>

      </div>
    </div>
  )
}
