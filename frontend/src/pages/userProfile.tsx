import Sidebar from '@/components/Sidebar'
import { supabase } from '@/supabase-client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'

function userProfile() {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
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
            if (data.user) {
                fetchProfile(data.user.id)
            }

        } catch (error) {
            console.log(error.message)
            toast.error("Error in fetching user data", error.message)
        }
        finally{
            setLoading(false)
        }
    }
    const fetchProfile = async (uid) => {
        const { data } = await supabase
            .from("userprofiles")
            .select("*")
            .eq("user_id", uid)
            .single()

        if (data) setProfile(data)
    }

    const profileImageUpload = async (file: any) => {
        try {
            setLoading(true)
            const fileExt = file.name.split('.').pop()
            const filePath = `user-${user.id}.${fileExt}`

            const { error, } = await supabase.storage.from("avatars")
                .upload(filePath, file, { upsert: true })
            if (error) throw error

            const { data } = await supabase.storage.from("avatars").getPublicUrl(filePath)
            const imageUrl = data.publicUrl
            const { data: existingProfile } = await supabase
                .from("userprofiles")
                .select("*")
                .eq("user_id", user.id)
            setProfile({
                user_id: user.id,
                avatars_url: imageUrl
            })

            console.log("profile", existingProfile)

            if (existingProfile && existingProfile.length > 0) {
                // update existing profile
                await supabase
                    .from("userprofiles")
                    .update({ avatars_url: imageUrl })
                    .eq("user_id", user.id)
            } else {
                // insert new profile
                await supabase
                    .from("userprofiles")
                    .insert({
                        user_id: user.id,
                        avatars_url: imageUrl,
                    })
            }
            toast.success("Profile image uploaded")


        } catch (error) {
            toast.error("Error in uploading image", error.message)
            console.log(error.message)
        }
        finally{
            setLoading(false)
        }
    }
    
    return (
        <div className=''>
            <Sidebar />
            <div className='ml-74 flex flex-col p-3 justify-center items-center min-h-screen bg-gray-50'>
                 <div className='p-6'><img
                    src={profile?.avatars_url}
                    alt="profile"
                    className="w-[300px] h-[300px] rounded-full"
                /></div>
               
                <div className='flex bg-white shadow-xl rounded p-6 gap-3'>
                    
                    <Input className='border border-gray-400'
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                    <button
                        disabled={!selectedFile}
                        onClick={() => profileImageUpload(selectedFile)}
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        {profile?.avatars_url ? "Change" : "Upload"}
                    </button>
                </div>
                {loading && <p className='text-blue-500 font-bold'>Loading</p>}
            </div>

        </div>
    )
}

export default userProfile
