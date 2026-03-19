import { useEffect, useState } from 'react'

import './App.css'
import { Button } from './components/ui/button'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { supabase } from "../src/supabase-client"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Sidebar from './components/Sidebar'


function App() {
  
  const [tasks, setTasks] = useState([])
  const[loading,setLoading]=useState(false)

  const navigate = useNavigate()

  
 const fetchTasks = async () => {
  try {
    setLoading(true)

    const{error:userError,data:userData}=await supabase.auth.getUser()
    if (userError) throw userError
    console.log("userData",userData)
    const user=userData.user
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq("user_id",userData.user.id)
     

    if (error) {
      throw error   
    }

    setTasks(data)
   console.log("Data:", data)

  } catch (err: any) {
    console.log("Error on fetching tasks:", err.message)
  }
  finally{
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

    navigate('/')

  } catch (err: any) {
    toast.error("Delete failed")
    console.log(err.message)
  }
}
 
  return (
    <>
      <div className='bg-gray-200  flex justify-center items-center  flex-col min-h-screen '>
         
        <Sidebar/>
        
          <div className='flex-1 bg-blue-50  w-[300] md:w-[600px] shadow rounded  flex flex-col   justify-center items-center m-2 ml-67 p-5'>
            <Button onClick={()=>navigate("/addtask")} className='m-3 bg-blue-600 min-w-[200px] p-3 mb-2 text-white rounded shadow-xl hover:bg-blue-300'>ADD MORE</Button>
          <Button className='m-3 bg-green-600 min-w-[200px] p-3 mb-2 text-white rounded shadow-xl hover:bg-blue-300' onClick={()=>navigate("/list")}>
            VIEW
          </Button>
            </div> 
       
        
      </div>

    </>
  )
}

export default App
