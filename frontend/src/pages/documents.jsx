import React from 'react'
import moment from 'moment'
import Sidebar from '../components/sidebar'
import { FileText, Zap, BrainCircuit, HardDrive, Clock, Search, Filter, Trash2 } from 'lucide-react'
import { useDocStore } from '../store/useDocStore'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Documents = () => {
    
    const { documents, fetchDocuments, deleteDocument } = useDocStore();
    const navigate = useNavigate()

    useEffect(() => {
        fetchDocuments()
    }, [fetchDocuments])

    const handleDelete = async (e, docId) => {
        e.stopPropagation();
        
        const confirmDelete = window.confirm("Want to delete this PDF?");
        if (!confirmDelete) return;
        
        try {
            await deleteDocument(docId);
        } catch (error) {
            console.error("Deletion failed:", error);
        }
    };

    return (
        <div className="h-screen w-full bg-base-100 flex font-sans transition-all duration-300 antialiased overflow-hidden">

            <div className='w-[18%] min-w-[220px] max-w-[280px] hidden md:block border-r border-base-content/5 bg-base-100 h-full flex-shrink-0'>
                <Sidebar />
            </div>

            <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 h-full overflow-y-auto max-w-[1600px] mx-auto w-full custom-scrollbar bg-base-100">

                {/* Header Section */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-base-content tracking-tight">
                            Your <span className="text-primary">Library</span>
                        </h1>
                        <p className="text-base-content/50 mt-1.5 text-xs sm:text-sm font-medium">Manage and review all your uploaded knowledge base.</p>
                    </div>

                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                className="input bg-base-200 border-none rounded-2xl pl-12 w-full sm:w-64 focus:ring-2 focus:ring-primary/20 text-sm h-12"
                            />
                        </div>
                        <button className="btn btn-square bg-base-200 border-none rounded-2xl hover:bg-primary hover:text-primary-content h-12 w-12 min-h-[48px]">
                            <Filter size={20} />
                        </button>
                    </div>
                </header>

                
                {documents && documents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        {documents.map((doc) => (
                            <motion.div
                                layoutId={doc._id}
                                key={doc._id}
                                onClick={() => navigate(`/document/${doc._id}`)}
                                className="group relative cursor-pointer bg-base-200/50 rounded-[24px] md:rounded-[30px] p-6 border border-base-content/5 transition-all duration-300 hover:shadow-xl hover:border-primary/20 select-none"
                                transition={{ type: "spring", stiffness: 60, damping: 25 }}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3.5 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300">
                                        <FileText size={22} />
                                    </div>
                                    
                                    <button 
                                        className="btn btn-ghost btn-sm btn-square opacity-0 group-hover:opacity-100 transition-all duration-200 text-base-content/40 hover:text-error hover:bg-error/10"
                                        onClick={(e) => handleDelete(e, doc._id)} 
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Title Stream */}
                                <h3 className="text-lg md:text-xl font-bold text-base-content truncate mb-6" title={doc.title}>
                                    {doc.title}
                                </h3>

                                {/* Stats Information Blocks */}
                                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                                    <div className="bg-base-100 border border-base-content/5 p-3 rounded-2xl flex items-center gap-2.5 min-w-0">
                                        <Zap size={16} className="text-warning flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold opacity-40 truncate">Flashcards</p>
                                            <p className="text-sm md:text-base font-black text-base-content">{doc.flashcards?.length || 0}</p>
                                        </div>
                                    </div>
                                    <div className="bg-base-100 border border-base-content/5 p-3 rounded-2xl flex items-center gap-2.5 min-w-0">
                                        <BrainCircuit size={16} className="text-secondary flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold opacity-40 truncate">Quizzes</p>
                                            <p className="text-sm md:text-base font-black text-base-content">{doc.quizzes?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-base-content/5">
                                    <div className="flex items-center gap-1.5 text-base-content/40 text-xs font-semibold">
                                        <HardDrive size={13} />
                                        <span>{doc.size ? (doc.size / (1024 * 1024)).toFixed(2) + " MB" : "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-base-content/40 text-xs font-semibold">
                                        <Clock size={13} />
                                        <span>{moment(doc.createdAt).fromNow()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
                        <div className="bg-base-200 border border-base-content/5 p-6 rounded-full mb-6">
                            <FileText size={48} className="opacity-20 text-primary" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-base-content">No documents found</h2>
                        <p className="text-base-content/50 text-xs sm:text-sm mt-2 font-medium">Upload your first PDF document inside the main dashboard to seed your personalized AI engine.</p>
                    </div>
                )}
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--bc), 0.08); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(var(--bc), 0.15); }
            `}</style>
        </div>
    )
}

export default Documents;