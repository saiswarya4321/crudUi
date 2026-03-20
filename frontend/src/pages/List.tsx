import React from 'react'
import { useEffect, useState } from 'react'


import { Button } from '../components/ui/button'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { supabase } from "../../src/supabase-client"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'


function List() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()


  const fetchTasks = async () => {
    try {
      setLoading(true)

      const { error: userError, data: userData } = await supabase.auth.getUser()
      if (userError) throw userError
      console.log("userData", userData)
      const user = userData.user
      // const { data, error } = await supabase
      //   .from('tasks')
      //   .select('*')
      // // .eq("user_id",userData.user.id)

      const { error, data } = await supabase.rpc("get_user_tasks", { uid: user.id })


      if (error) {
        throw error
      }

      setTasks(data)
      console.log("Data:", data)

    } catch (err: any) {
      console.log("Error on fetching tasks:", err.message)
      if (err.message.includes("permission")) {
        toast.error("Not allowed (RLS policy)")
      } else {
        toast.error("Error on Listing")
      }
    }
    finally {
      setLoading(false)
    }
  }

  const fetchStatus = async (status: string) => {
    try {
      setLoading(true)
      const { error: userError, data: userData } = await supabase.auth.getUser()
      if (userError) throw userError
      console.log("userData", userData)
      const user = userData.user
      const { error, data } = await supabase.rpc("get_task_by_status", { task_status: status, uid: user.id })
      if (error) throw error
      setTasks(data)
    } catch (err: any) {
      console.log("Error in fetching", err.message)
      toast.error("Error in fetching", err.message)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleDelete = async (id: any) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      toast.success("Task deleted")

      setTasks((prev) => prev.filter((task) => task.id !== id))

      navigate('/list')

    } catch (err: any) {
      console.log("Error on Deletion:", err.message)


      if (err.message.includes("permission")) {
        toast.error("Not allowed (RLS policy)")
      } else {
        toast.error("Error on Deletion")
      }
    }
  }

  return (
    <>
      <div className='bg-gray-200  flex justify-center items-center  flex-col min-h-screen '>

        <Sidebar />
        <h2 className='text-blue-400 font-bold'>List of tasks</h2>

        <div className='flex p-6 lg:mr-54 ' >
          <Button className='bg-green-700 text-white p-2 w-full' onClick={fetchTasks}>All</Button>
          <Button className='bg-green-700  text-white p-2 w-full' onClick={() => fetchStatus("Completed")}>Completed</Button>
          <Button className='bg-green-700  text-white p-2 w-full' onClick={() => fetchStatus("Not completed")}>Not completed</Button>
        </div>
        <div className='flex-1 bg-blue-50  w-[300] md:w-[800px] shadow rounded  flex flex-wrap gap-2  justify-center items-center-safe m-2 ml-67 p-2'>



          {tasks.length === 0 ? (
            <div>
              {loading && <p className="mb-2 text-blue-500">Loading...</p>}
              <p>No tasks found</p>
            </div>

          ) : (
            tasks.map((task) => (
              <div key={task.id} className=' flex  flex-row justify-between items-center w-full md:w-1/3 lg:w-1/3 p-4 m-2 bg-blue-100 rounded-xl shadow-xl '>

                <div onClick={() => navigate(`/task/${task.id}`)} className='border border-blue-500 p-3 rounded shadow-xl flex flex-col w-full md:w-[400px] hover:bg-blue-300 text-blue-800 font-bold'>
                  <h1 >{task.title}

                  </h1>
                  <span className='text-xs text-blue-400'>{task.status}</span>
                </div>

                <div className='flex flex-col p-0 ml-3 text-gray-300 '>
                  <Button className='bg-blue-700 p-3 hover:bg-blue-400' onClick={() => navigate(`/update/${task.id}`)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench-icon lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" /></svg></Button>
                  <Button className='bg-red-700 p-3  hover:bg-red-400' onClick={() => handleDelete(task.id)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></Button>
                </div>
              </div>


            ))
          )}
        </div>

      </div>

    </>
  )
}

export default List
