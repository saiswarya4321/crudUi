import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from './supabase-client'
import { Button } from './components/ui/button'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { toast } from 'react-toastify'


function taskDetails() {
    const{id}=useParams()
    const [task, setTask] = useState(null)
    const [files, setFiles] = useState([])

     useEffect(() => {
    fetchTask()
  }, [])
     const fetchTask = async () => {
    const { data, error } = await supabase
      .from("tasks")
       .select(`
      *,
      users ( name )
    `)
      .eq("id", id)
      .single()

    if (error) {
      console.log(error)
    } else {
      setTask(data)
    }
  }
  useEffect(() => {
  if (id) {
    fetchFiles()
  }
}, [id])
  const fetchFiles=async()=>{
    try {
      const {error,data}=await supabase.from("taskfiles")
      .select("*").eq("task_id",id)
      if(error) throw error
      setFiles(data)
    } catch (error) {
      console.log(error.message)
      toast.error("Error in fetching files")
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
{task &&<Input value={task.users?.name} className='p-3 m-2 border border-gray-300 shadow' />
}
{task && <Textarea value={task.description} className='p-3 m-2 border border-gray-300 shadow'/>}
{task &&<Input value={task.expiry_date} className='p-3 m-2 border border-gray-300 shadow'/>
}
  <div>
  <h2>Uploaded Files</h2>

  {files.length === 0 ? (
    <p>No files uploaded</p>
  ) : (
    files.map((file) => (
      <div key={file.id} className="border p-2 my-2">
        <p>{file.file_name}</p>

        <a
          href={file.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          View File
        </a>
      </div>
    ))
  )}
</div>      </div>
      
    </div>
  )
}

export default taskDetails
