import React, { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { supabase } from "../../src/supabase-client"


export default function login() {
    const navigate=useNavigate()
        const [email,setEmail]=useState('')
        const [password,setPassword]=useState('')
        const [loading, setLoading] = useState(false)
        const [showPassword, setShowPassword] = useState(false)
        const handleLogin= async()=>{
            try {
                setLoading(true)
                let {data,error}=await supabase.auth.signInWithPassword({
                    email:email,
                    password:password
                })
                if(error) throw error
                 console.log("Logged in:", data)

    toast.success("Login successful")
    navigate("/dashboard")

            } catch (err:any) {
                console.log("Error in Login",err.message)
                toast.error("Error in Login",err.message)
                navigate("/login")
            }
           finally{
            setLoading(false)
           }
        }
    
  return (
     <div className='bg-gray-200  flex justify-center items-center  flex-col min-h-screen'>
         {loading && <p className="mb-2 text-blue-500">Loading...</p>}
          <div>
    
          </div>
          <div className='bg-blue-50 p-10 w-[300] md:w-[500px]  flex flex-col   m-2 shadow-xl rounded-xl'>
            
    <Label htmlFor="email" className='text-gray-400 m-2 text-bold'>Your email address<span className='text-xs text-red-600'>*</span></Label>
    <Input className='border border-gray-300'onChange={(e)=>setEmail(e.target.value)} value={email}  placeholder="Enter email"/>
    <Label htmlFor="password" className='text-gray-400 m-2 text-bold'>Your password<span className='text-xs text-red-600'>*</span></Label>
   <div className="relative w-full">
      
      <Input
        type={showPassword ? "text" : "password"}
        className="border border-gray-300 pr-10"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />

    
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
      >
        {showPassword ? "Hide" : "Show"}
      </button>

    </div>
    <Button variant="outline" className='bg-green-600 pt-3 pb-3 m-3 border border-none text-white' onClick={handleLogin}>LOGIN</Button>
    <div onClick={()=>navigate("/signup")} className='text-sm text-blue-500 text-bold'>Don't have an account ? Signup !!!!<span className='text-bold text-violet-500 hover:text-violet-700'> SIGNUP</span></div>
      </div>
          </div>
    
      
  )
}
