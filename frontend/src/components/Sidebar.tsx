import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../supabase-client"
import { toast } from "react-toastify"

const Sidebar = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    console.log("Logged out")
    toast.success("Logout successfully")
    navigate("/login")

  } catch (err: any) {
    console.error("Logout error:", err.message)
  }
}

  return (
    <div className="w-64 h-screen bg-blue-600 text-white flex flex-col p-5 rounded shadow-xl min-h-screen fixed top-0 left-0 ">
       

      
      <h2 className="text-2xl font-bold mb-6">My App</h2>

      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="hover:bg-blue-700 p-2 rounded">
          Dashboard
        </Link>

        <Link to="/" className="hover:bg-blue-700 p-2 rounded">
          Tasks
        </Link>
         <Link to="/messagesdashboard" className="hover:bg-blue-700 p-2 rounded">
          Messages
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto bg-red-500 hover:bg-red-600 p-2 rounded"
      >
        Logout
      </button>

    </div>
  )
}

export default Sidebar