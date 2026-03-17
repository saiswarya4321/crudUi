import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from './supabase-client'
import { Button } from './components/ui/button'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"


function taskDetails() {
    const{id}=useParams()
    const [task, setTask] = useState(null)

     useEffect(() => {
    fetchTask()
  }, [])
     const fetchTask = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.log(error)
    } else {
      setTask(data)
    }
  }
if (!task) return <p>Loading...</p>
  return (
    <div className='bg-gray-100 flex flex-col justify-center items-center min-h-screen'>
        <div className='bg-white p-10 mt-4 w-[300] md:w-[600px] flex flex-col shadow rounded'>
<h3 className='text-blue-600 font-bold'>TaskDetails </h3>
{task &&<Input value={task.title} className='p-3 m-2 border border-gray-300 shadow'/>
}
{task &&<Input value={task.status} className='p-3 m-2 border border-gray-300 shadow'/>
}
{task &&<Input value={task.user_id} className='p-3 m-2 border border-gray-300 shadow' />
}
{task && <Textarea value={task.description} className='p-3 m-2 border border-gray-300 shadow'/>}
{task &&<Input value={task.expiry_date} className='p-3 m-2 border border-gray-300 shadow'/>
}
        </div>
      
    </div>
  )
}

export default taskDetails
