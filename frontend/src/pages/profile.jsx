import React, { useState } from 'react'
import Sidebar from '../components/sidebar'
import { useAuthStore } from '../store/useAuthStore'
import { useDocStore } from '../store/useDocStore'
import { User, Mail, Calendar, LogOut, HardDrive, Flame, Award, CheckCircle2, Edit3, Save, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
    const { authUser, logout } = useAuthStore()
    const { getTotalDocs, getTotalFlashcard, getTotalQuizzes } = useDocStore()
    
    const [isEditing, setIsEditing] = useState(false)
    const [profileName, setProfileName] = useState(authUser?.name || 'Ashish')
    const [profileBio, setProfileBio] = useState('Full Stack Developer | AI Enthusiast')

    const memberSince = authUser?.createdAt 
        ? new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'June 2026';

    const pdfCount = getTotalDocs() || 0;
    const maxPdfLimit = 20;
    const storagePercentage = Math.min((pdfCount / maxPdfLimit) * 100, 100);

    const handleSaveProfile = () => {
        if (!profileName.trim()) return toast.error("Name cannot be empty");
        setIsEditing(false);
        toast.success("Profile cache updated locally!");
    }

    return (
        <div className="h-screen w-full bg-base-100 flex font-sans transition-all duration-300 antialiased overflow-hidden select-none">
            
            <div className="w-[18%] min-w-[220px] max-w-[280px] hidden md:block border-r border-base-content/5 bg-base-100 h-full flex-shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 h-full overflow-y-auto max-w-[1400px] mx-auto w-full custom-scrollbar flex flex-col gap-6 md:gap-8">
                
                <div className="w-full bg-base-200/40 border border-base-content/5 rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-all duration-500" />
                    
                    <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/10 border-2 border-primary/20 flex items-center justify-center text-primary shadow-inner">
                            <User size={38} className="sm:w-11 sm:h-11" strokeWidth={1.5} />
                        </div>
                        <span className="absolute bottom-1 right-1 bg-success w-3.5 h-3.5 rounded-full border-2 border-base-100 ring-4 ring-success/20 animate-pulse" />
                    </div>
                    
                    <div className="text-center sm:text-left min-w-0 flex-1 w-full flex flex-col items-center sm:items-start">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full justify-center sm:justify-start">
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={profileName} 
                                    onChange={(e) => setProfileName(e.target.value)}
                                    className="input input-sm input-bordered bg-base-100 border-base-content/20 font-black text-lg text-base-content w-full max-w-xs focus:outline-none focus:border-primary rounded-xl px-3 h-10"
                                    maxLength={25}
                                />
                            ) : (
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-base-content tracking-tight truncate max-w-full">
                                    {profileName}
                                </h1>
                            )}
                            <div className="badge badge-primary badge-outline font-black text-[9px] tracking-wider uppercase px-2.5 py-2 w-fit">
                                Cloud Account Active
                            </div>
                        </div>

                        <div className="w-full max-w-md mt-1.5 flex justify-center sm:justify-start">
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={profileBio} 
                                    onChange={(e) => setProfileBio(e.target.value)}
                                    className="input input-xs input-bordered bg-base-100 border-base-content/10 font-semibold text-xs text-primary/80 w-full focus:outline-none focus:border-primary rounded-lg h-8 px-2.5"
                                    maxLength={50}
                                />
                            ) : (
                                <p className="text-xs sm:text-sm font-bold text-primary tracking-wide truncate max-w-full">{profileBio}</p>
                            )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 mt-4 text-xs font-medium text-base-content/50 border-t border-base-content/5 pt-3 w-full">
                            <span className="flex items-center gap-1.5 truncate"><Mail size={14} className="text-primary/60 flex-shrink-0"/>{authUser?.email || 'user@example.com'}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-secondary/60 flex-shrink-0"/>Created: {memberSince}</span>
                        </div>
                    </div>

                    <button 
                        onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                        className="btn btn-ghost btn-xs sm:btn-sm border border-base-content/10 hover:bg-base-200/50 rounded-xl gap-2 font-black tracking-wide text-xs text-base-content h-10 w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0 normal-case"
                    >
                        {isEditing ? <Save size={13} className="text-success" /> : <Edit3 size={13} />}
                        <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-base-200/30 border border-base-content/5 p-4 sm:p-5 rounded-2xl flex items-center gap-4 hover:border-primary/10 transition-all">
                        <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl flex-shrink-0">
                            <Flame size={20} strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] uppercase font-bold tracking-widest opacity-40 truncate">Consistency Logs</p>
                            <h3 className="text-base sm:text-lg font-black text-base-content mt-0.5 truncate">5 Days Streak</h3>
                        </div>
                    </div>

                    <div className="bg-base-200/30 border border-base-content/5 p-4 sm:p-5 rounded-2xl flex items-center gap-4 hover:border-primary/10 transition-all">
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl flex-shrink-0">
                            <Award size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] uppercase font-bold tracking-widest opacity-40 truncate">Flashcards Systems</p>
                            <h3 className="text-base sm:text-lg font-black text-base-content mt-0.5 truncate">{getTotalFlashcard()} Active Decks</h3>
                        </div>
                    </div>

                    <div className="bg-base-200/30 border border-base-content/5 p-4 sm:p-5 rounded-2xl flex items-center gap-4 hover:border-primary/10 transition-all sm:col-span-2 lg:col-span-1">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl flex-shrink-0">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] uppercase font-bold tracking-widest opacity-40 truncate">AI Quizzes Tracks</p>
                            <h3 className="text-base sm:text-lg font-black text-base-content mt-0.5 truncate">{getTotalQuizzes()} Evaluated</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-base-200/20 border border-base-content/5 rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col gap-6">
                    <div>
                        <h2 className="text-xs font-black uppercase tracking-widest text-base-content/40">Workspace Allocations</h2>
                        <p className="text-[11px] sm:text-xs text-base-content/30 mt-1">Real-time status tracking parameters regarding your cloud index boundaries.</p>
                    </div>

                    <div className="flex flex-col gap-3 bg-base-100 border border-base-content/5 p-4 sm:p-5 rounded-2xl w-full max-w-3xl">
                        <div className="flex justify-between items-center text-xs font-bold gap-2">
                            <span className="text-base-content flex items-center gap-2 min-w-0 truncate">
                                <HardDrive size={15} className="text-primary flex-shrink-0" />
                                Knowledge Base Slot Usage
                            </span>
                            <span className="font-mono text-primary flex-shrink-0">{pdfCount} / {maxPdfLimit} Files</span>
                        </div>
                        
                        <div className="w-full bg-base-200 h-2.5 rounded-full overflow-hidden p-[1px] border border-base-content/5">
                            <div 
                                className="bg-primary h-full rounded-full transition-all duration-700 shadow-sm"
                                style={{ width: `${storagePercentage}%` }}
                            />
                        </div>
                        
                        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-base-content/40 font-semibold mt-1">
                            <ShieldAlert size={12} className="text-warning flex-shrink-0" />
                            <span className="leading-normal">Free Account layer includes up to {maxPdfLimit} embedded document structures.</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-base-content/5 pt-5 mt-2">
                        <div className="text-center sm:text-left">
                            <h4 className="text-sm font-bold text-error">Terminate Workspace Session</h4>
                            <p className="text-xs text-base-content/40 mt-0.5 hidden sm:block">Destroys browser context JWT structures safely to avoid cookie hijacking.</p>
                        </div>
                        <button 
                            onClick={logout}
                            className="btn btn-error btn-outline normal-case border-2 gap-2 font-black text-xs px-5 h-11 min-h-[44px] rounded-xl hover:scale-[1.01] transition-transform w-full sm:w-auto"
                        >
                            <LogOut size={15} strokeWidth={2.5}/>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--bc), 0.08); border-radius: 20px; }
            `}</style>
        </div>
    )
}

export default Profile