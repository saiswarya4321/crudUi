import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from './supabase-client'
import { Button } from './components/ui/button'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'

function updateTask() {
    const navigate=useNavigate()
    const { id } = useParams()
    const [title, setTitle] = useState('')
    const [status, setStatus] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(null)
    const [task,setTask]=useState({})
const[loading,setLoading]=useState(false)

    const fetchTask = async () => {
  try {
    setLoading(true)
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      throw error   
    }

    if (data) {
      setTitle(data.title)
      setStatus(data.status)
      setDescription(data.description)
      setDate(data.expiry_date ? new Date(data.expiry_date) : null)
      setTask(data)
    }

  } catch (err: any) {
    console.error("Error fetching task:", err.message)
  }
  finally{
    setLoading(false)
  }
}
    if(!task) return<p>Loading ....</p>
    useEffect(() => {
        fetchTask()
    }, [])
    const handleUpdate = async () => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: title,
        status: status,
        description: description,
        expiry_date: date
      })
      .eq('id', id)
      .select()

    if (error) {
      throw error  
    }

    toast.success("Task updated")
    navigate("/")

  } catch (err: any) {
    toast.error("Update failed")
    console.log(err.message)
  }
}
    return (
        <div className='bg-gray-200  flex justify-center items-center flex flex-col'>
            <Sidebar/>
               {loading && <p className="mb-2 text-blue-500">Loading...</p>}
            <div className='w-[300px] md:w-[500px] bg-white p-10 shadow border border-gray-100 rounded ml-67 p-5 mt-6'>
                <h3 className='text-blue-500 font-bold'>Update Task</h3>
                <Label htmlFor="title" className='m-2'>Title <span className='text-red-500'>*</span></Label>
                <Input className='focus:outline-none min-w-[400] border border-gray-300 shadow' value={title}
                    onChange={(e) => setTitle(e.target.value)} />
                <Label htmlFor="status" className='m-2'>Status <span className='text-red-500'>*</span></Label>
                <Input className='focus:outline-none min-w-[400] border border-gray-300 shadow' value={status}
                    onChange={(e) => setStatus(e.target.value)} />

                <Label htmlFor="description" className='m-2'>Description <span className='text-red-500'>*</span></Label>
                <Textarea value={description}
                    onChange={(e) => setDescription(e.target.value)} className='border border-gray-300 shadow'/>
                <Label htmlFor="date" className='m-2'>Expiry Date <span className='text-red-500'>*</span></Label>



                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-lg  m-2 border border-gray-300 shadow"
                />
                <Input value={date ? date.toISOString().split('T')[0] : ''} className='m-2 border border-gray-300 shadow' />
                <Button variant='outline' className='bg-blue-300 w-full outline-none p-2 border border-none' onClick={handleUpdate}>UPDATE</Button>
            </div>
            update{id}
        </div>
    )
}

export default updateTask
