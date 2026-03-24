
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/supabase-client'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

function taskFileUpload() {
    const [tasks, setTasks] = useState([])
    const [user, setUser] = useState(null)
    const [selectedTask, setSelectedTask] = useState("")
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        try {
setLoading(true)
            const { error, data } = await supabase.auth.getUser()
            if (error) throw error
            setUser(data.user)
            console.log(data.user)
            fetchTasks(data.user.id)
        } catch (error) {
            console.log(error.message)
            toast.error("Error in fetching user", error.message)
        }
        finally {
setLoading(false)
        }
    }
    useEffect(() => {

    }, [])

    const fetchTasks = async (uid) => {
        try {
            const { error, data } = await supabase.from("tasks").select("*")
                .eq("user_id", uid)
            if (error) throw error
            setTasks(data)
            console.log(data)

        } catch (error) {
            toast.error("Error in fetching tasks", error.message)
            console.log(error.message)
        }
    }

    const validateFile = (file) => {
        if (!file) {
            toast.error("Please select a file")
            return false
        }


        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "application/pdf",
            "application/msword", // .doc
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
        ]

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only PNG, JPEG, PDF, Word files allowed")
            return false
        }


        const maxSize = 2 * 1024 * 1024

        if (file.size > maxSize) {
            toast.error("File size must be less than 2MB")
            return false
        }

        return true
    }


    const uploadTaskFile = async (file, taskId) => {
        if (!validateFile(file)) return
        if (!file || !taskId) {
            toast.error("Select task and file")
            return
        }
        console.log("Task id", taskId)
        try {
            setLoading(true)
            const filePath = `tasks-${taskId}/${Date.now()}-${file.name}`
            const { error: uploadError } = await supabase.storage
                .from("task-files")
                .upload(filePath, file)
            if (uploadError) throw uploadError


            const { data } = supabase.storage
                .from("task-files")
                .getPublicUrl(filePath)

            const fileUrl = data.publicUrl


            await supabase.from("taskfiles").insert({
                task_id: taskId,
                file_url: fileUrl,
                file_type: file.type,
                file_name: file.name,

            })
            console.log(file.name, " -----", file.type)
            toast.success("File uploaded")
        } catch (error) {
            console.log(error.message)
            toast.error("Error in uploading file", error.message)
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <div>
            <Sidebar />
            <div className='ml-74 flex flex-col p-3 justify-center items-center min-h-screen bg-gray-50'>
                <div className='flex flex-col bg-white shadow-xl rounded p-6 gap-3'>
                    <select name="tasks" id="tasks" className='border border-gray-500 rounded' onChange={(e) => setSelectedTask(e.target.value)}>
                        <option value="">Select a task</option>
                        {tasks.map((task) => (
                            <option key={task.id} value={task.id} >{task.title}</option>
                        ))}
                    </select>
                    <input className=' bg-blue-500 p-3 rounded text-white shadow-xl hover:bg-blue-200'
                        type="file"
                        onChange={(e) => uploadTaskFile(e.target.files[0], selectedTask)}
                    />

                </div>
                {loading && <p className='text-blue-500'>Loading....</p>}
            </div>

        </div>
    )
}

export default taskFileUpload
