import React from 'react'
import { useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { supabase } from "../src/supabase-client"
import { useNavigate } from 'react-router-dom'
import {toast} from'react-toastify'

function addTask() {
    const [date, setDate] = useState<Date | undefined>(new Date())
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('')
  const [userId, setUserId] = useState('')
  const [description, setDescription] = useState('')
  const [tasks, setTasks] = useState([])

  const navigate = useNavigate()

  const handleSubmit = async () => {
    const { data, error } = await supabase.from("tasks").insert([{
      title: title,
      status: status,
      user_id: userId,
      description: description,
      expiry_date: date
    }
    ]).select()
    if (error) {
      console.log("Error on inserting", error.message)
      toast.error("Error on instering")
    }
    else {
      console.log("inserted data", data)
      navigate("/")
      toast.success("Task inserted")
    }
    
  }
  return (
    <div className='bg-gray-200  flex justify-center items-center flex flex-col'>
          <div className='w-[300px] md:w-[500px] bg-white p-10 shadow border border-gray-100 rounded m-4'>
          <h3 className='text-blue-500 font-bold'>Add Task</h3>
          <Label htmlFor="title" className='m-2'>Title <span className='text-red-500'>*</span></Label>
          <Input className='focus:outline-none min-w-[400] border border-gray-300 shadow' value={title}
            onChange={(e) => setTitle(e.target.value)} />
          <Label htmlFor="status" className='m-2'>Status <span className='text-red-500'>*</span></Label>
          <Input className='focus:outline-none min-w-[400] border border-gray-300 shadow' value={status}
            onChange={(e) => setStatus(e.target.value)} />
          <Label htmlFor="userId" className='m-2'>User Id <span className='text-red-500'>*</span></Label>
          <Input className='focus:outline-none min-w-[400] border border-gray-300 shadow'
            value={userId}
            onChange={(e) => setUserId(e.target.value)} />
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
          <Button variant='outline' className='bg-blue-300 w-full outline-none p-2 border border-none' onClick={handleSubmit}>SUBMIT</Button>
        </div>

    </div>
  )
}

export default addTask
