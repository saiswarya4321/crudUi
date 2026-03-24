import React from 'react'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { supabase } from "../supabase-client"
import { useNavigate } from 'react-router-dom'
import {toast} from'react-toastify'
import Sidebar from '../components/Sidebar'


function addTask() {
    const [date, setDate] = useState<Date | undefined>(new Date())
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('')
  const [userId, setUserId] = useState('')
  const [description, setDescription] = useState('')
  const [task, setTask] = useState([])
  const [tasks, setTasks] = useState([])
      
      const [loading, setLoading] = useState(false)
      const [file, setFile] = useState<File | null>(null)

  const navigate = useNavigate()
  const validateTask = () => {
  if (!title || title.trim() === "") {
    toast.error("Title is required")
    return false
  }

  if (title.length < 3) {
    toast.error("Title must be at least 3 characters")
    return false
  }

  if (!status) {
    toast.error("Status is required")
    return false
  }

  if (!description || description.trim() === "") {
    toast.error("Description is required")
    return false
  }

  if (!date) {
    toast.error("Expiry date is required")
    return false
  }

  
  if (new Date(date) < new Date()) {
    toast.error("Expiry date cannot be in the past")
    return false
  }

  return true 
}

  const handleSubmit = async () => {
  try {
    setLoading(true)
    if(!validateTask()) return;
     const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError

    const user = userData.user

    if (!user) {
      toast.error("User not logged in")
      return
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([{
        title: title,
        status: status,
       user_id: user.id,
        description: description,
        expiry_date: date
      }])
      .select()
setTask(data)
const taskId = data[0].id
    if (error) {
      throw error  
    }

    
//upload
 const filePath = `tasks/${user.id}/${Date.now()}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from("task-files")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from("task-files")
        .getPublicUrl(filePath)

      const fileUrl = publicUrlData.publicUrl
const { error: fileInsertError } = await supabase
        .from("taskfiles")
        .insert({
          task_id: taskId,
          file_url: fileUrl,
          file_type: file.type,
          file_name: file.name,
        })

      if (fileInsertError) throw fileInsertError
//upload end

    console.log("inserted data", data)
    toast.success("Task inserted")
    navigate("/list")

  } catch (err: any) {
    console.log("Error on inserting:", err.message)

    
    if (err.message.includes("permission")) {
      toast.error("Not allowed (RLS policy)")
    } else {
      toast.error("Error on inserting")
    }
  }
  finally{
    setLoading(false)
  }
}
  return (
    <div className='bg-gray-200  flex justify-center items-center flex flex-col min-h-screen'>
      <Sidebar/>
          <div className='w-[300px] md:w-[500px] bg-white  shadow border border-gray-100 rounded ml-67 p-5 mt-5'>
          <h3 className='text-blue-500 font-bold'>Add Task</h3>
          {loading && <p className='text-blue-600 font-bold'>Loading......</p>}
          <Label htmlFor="title" className='m-2'>Title <span className='text-red-500'>*</span></Label>
          <Input className='focus:outline-none min-w-[400] border border-gray-300 shadow' value={title}
            onChange={(e) => setTitle(e.target.value)} />
          <Label htmlFor="status" className='m-2'>Status <span className='text-red-500'>*</span></Label>
          
          <Input className='focus:outline-none min-w-[400] border border-gray-300 shadow' value={status}
            onChange={(e) => setStatus(e.target.value)} />
          {/* <Label htmlFor="userId" className='m-2'>User Id <span className='text-red-500'>*</span></Label>
          <Input className='focus:outline-none min-w-[400] border border-gray-300 shadow'
            value={userId}
            onChange={(e) => setUserId(e.target.value)} /> */}
          <Label htmlFor="description" className='m-2'>Description <span className='text-red-500'>*</span></Label>
          <Textarea value={description}
            onChange={(e) => setDescription(e.target.value)} className='border border-gray-300 shadow' />
          <Label htmlFor="date" className='m-2'>Expiry Date <span className='text-red-500'>*</span></Label>



          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg  m-2 border border-gray-300 shadow"
          />
          <Input value={date?.toLocaleDateString() || ''} className='m-2 border border-gray-300 shadow' />
          <input
  type="file"
  className='bg-blue-500 p-3 rounded text-white shadow-xl hover:bg-blue-200 m-2'
  onChange={(e) => setFile(e.target.files?.[0] || null)}
/>
          <Button variant='outline' className='bg-blue-300 w-full outline-none p-2 border border-none' onClick={handleSubmit}>SUBMIT</Button>
        </div>

    </div>
  )
}

export default addTask
