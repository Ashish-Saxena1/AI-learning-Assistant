import { Brain, LogOut, Settings, LayoutDashboard, FileText, Zap, User, Settings as SettingsIcon } from 'lucide-react'
import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    const { logout } = useAuthStore()
    const navigate = useNavigate()

    const handelLogout = async () => {
        await logout();
        navigate('/login')
    }
    const isDocsActive = location.pathname.startsWith('/documents') ||
        location.pathname.startsWith('/document/');
    const activeStyle = "flex items-center gap-4 bg-primary text-primary-content p-4 rounded-2xl shadow-lg shadow-primary/20 cursor-pointer transition-all duration-300";

    const normalStyle = "flex items-center gap-4 text-base-content/60 p-4 rounded-2xl hover:bg-base-300 hover:text-base-content transition-all cursor-pointer";

    return (
        <div className="w-full h-full bg-base-200 flex flex-col justify-between p-6 border-r border-base-content/5 transition-colors duration-300">

            <div className="flex flex-col gap-2">
                {/* Logo Area */}
                <div className="px-3 mb-10">
                    <h2 className="text-2xl font-black text-base-content leading-tight">
                        AI<br /><span className="text-primary font-fredoka">Learning</span>
                    </h2>
                    <div className="border-b border-base-content/10 mt-4 w-full" />
                </div>

                {/* Nav Links */}
                <div className="flex flex-col gap-2">
                    <NavLink to='/' className={({ isActive }) => isActive ? activeStyle : normalStyle}>
                        <LayoutDashboard size={18} />
                        <span className="text-xs tracking-widest font-bold">DASHBOARD</span>
                    </NavLink>

                    <NavLink to='/documents' className={ isDocsActive  ? activeStyle : normalStyle}>
                        <FileText size={18} />
                        <span className="text-xs tracking-widest font-bold">DOCUMENTS</span>
                    </NavLink>

                    
                    <NavLink to='/profile' className={({ isActive }) => isActive ? activeStyle : normalStyle}>
                        <User size={18} />
                        <span className="text-xs tracking-widest font-bold">PROFILE</span>
                    </NavLink>
                </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-base-content/10 pt-6">
                <NavLink to='/settings' className={({ isActive }) => isActive ? activeStyle : normalStyle}>
                    <SettingsIcon size={18} />
                    <span className="text-xs tracking-widest font-bold uppercase">Settings</span>
                </NavLink>

                <div
                    onClick={handelLogout}
                    className="flex items-center gap-4 text-error p-4 rounded-2xl hover:bg-error/10 transition-all cursor-pointer group"
                >
                    <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs tracking-widest font-bold uppercase">Logout</span>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
