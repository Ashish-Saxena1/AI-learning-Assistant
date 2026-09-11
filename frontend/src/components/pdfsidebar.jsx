import { Brain, LogOut, Settings, LayoutDashboard, FileText, Zap, User, Settings as SettingsIcon, TextAlignStart, CircleQuestionMark } from 'lucide-react'
import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate, useParams } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { useDocStore } from '../store/useDocStore'


const PdfSidebar = ({ activeTab, setActiveTab }) => {

    
    
    
    const { documents, fetchDocuments } = useDocStore();

    const {id}=useParams()
    const activeStyle = "flex items-center gap-4 bg-primary text-primary-content p-4 rounded-2xl shadow-lg shadow-primary/20 cursor-pointer transition-all duration-300";
    
    
    const normalStyle = "flex items-center gap-4 text-base-content/60 p-4 rounded-2xl hover:bg-base-300 hover:text-base-content transition-all cursor-pointer";


    const tabs=[
        {id:'pdf',label:'PDF VIEWER',icon:FileText},
        {id:'summary',label:'SUMMARY',icon:TextAlignStart},
        {id:'chat',label:'ASK AI',icon:Brain},
        {id:'quiz',label:'QUIZZES',icon:CircleQuestionMark},
        ]

    const doc = documents.find((d) => d._id === id);


    return (
        
        <div className="w-full h-full bg-base-200 flex flex-col justify-between p-6 border-r border-base-content/5 transition-colors duration-300">
            
            <div className="flex flex-col gap-2">
                <div className="px-3 mb-10">
                    <h2 className="text-2xl font-black text-base-content leading-tight">
                        {doc.title}
                    </h2>
                    <div className="border-b border-base-content/10 mt-4 w-full" />
                </div>








                <div className="flex flex-col gap-2">
                    {tabs.map((tab)=>(
                        <button
                        key={tab.id}
                        onClick={()=>{setActiveTab(tab.id)}}
                        className={activeTab===tab.id ? activeStyle : normalStyle}
                        >
                            <tab.icon size={18}/>
                            <span className="text-xs tracking-widest font-bold">{tab.label}</span>
                        </button>
                    ))}
                    
                </div>
            </div>

            
            <div className="flex flex-col gap-2 border-t border-base-content/10 pt-6">
                <NavLink to='/settings' className={({ isActive }) => isActive ? activeStyle : normalStyle}>
                    <SettingsIcon size={18} />
                    <span className="text-xs tracking-widest font-bold uppercase">Settings</span>
                </NavLink>
                
                <div
                    className="flex items-center gap-4 text-error p-4 rounded-2xl hover:bg-error/10 transition-all cursor-pointer group"
                >
                    <NavLink to='/documents'>
                    <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs tracking-widest font-bold uppercase">Back to Documents</span>
                        </NavLink>
                </div>
            </div>
        </div>
    )
}

export default PdfSidebar