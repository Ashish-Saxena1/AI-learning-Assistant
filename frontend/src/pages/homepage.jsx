import React, { useRef } from 'react'
import Sidebar from '../components/sidebar'
import { PlusCircle, Zap, Star, LayoutGrid, Search, Bell, ArrowUpFromLine, Settings, BadgeQuestionMarkIcon } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useDocStore } from '../store/useDocStore'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

const Homepage = () => {
    const today = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }).format(new Date());
    const { authUser } = useAuthStore()
    const { getTotalDocs, getTotalFlashcard, isUploadingDocs, getTotalQuizzes, uploadDocument, fetchDocuments, documents } = useDocStore()
    const fileInputRef = useRef(null)

    const HandelFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        console.log(selectedFile)
        if (!selectedFile) {
            return;
        }
        if (selectedFile.type !== "application/pdf") {
            return toast.error("please select pdf file only");
        }
        try {
            const formdata = new FormData();
            formdata.append('file', selectedFile);
            formdata.append('title', selectedFile.name);
            await uploadDocument(formdata)
        } catch (error) {
            toast.error("upload failed")
        }
    }
    const dynamicRecentActivity = documents ? documents
    .flatMap(doc => {
        const activities = [];

        
        if (doc.flashcards && doc.flashcards.length > 0) {
            doc.flashcards.forEach(set => {
                activities.push({
                    id: set._id || `fc-${Math.random().toString(36).substr(2, 9)}`,
                    title: `${doc.title.replace(".pdf", "")} - ${set.setName}`,
                    type: "Flashcards",
                    rawDate: set.createdAt ? new Date(set.createdAt) : new Date(), 
                    date: set.createdAt ? new Date(set.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : "Just now",
                    color: "text-primary"
                });
            });
        }

    
        if (doc.quizzes && doc.quizzes.length > 0) {
            doc.quizzes.forEach(quiz => {
                activities.push({
                    id: quiz._id || `qz-${Math.random().toString(36).substr(2, 9)}`,
                    title: `${doc.title.replace(".pdf", "")} - ${quiz.quizName || 'Quiz'}`, 
                    type: "Quiz",
                    rawDate: quiz.createdAt ? new Date(quiz.createdAt) : new Date(),
                    date: quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : "Just now",
                    color: "text-secondary" 
                });
            });
        }

        return activities;
    })
    
    .sort((a, b) => b.rawDate - a.rawDate)
    .slice(0, 5)
    : [];


    useEffect(() => {
        fetchDocuments()
    }, [fetchDocuments])

    return (

        <div className="h-screen w-full bg-base-100 flex font-sans transition-all duration-300 antialiased overflow-hidden">
            <div className="w-[18%] min-w-55 max-w-70 hidden md:block border-r border-base-content/5 bg-base-100 h-full shrink-0">
                <Sidebar />
            </div>


            <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 h-full overflow-y-auto max-w-400 mx-auto w-full">

                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-12">
                    <div>
                        <p className="text-base-content/60 text-xs sm:text-sm font-medium">{today}</p>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-base-content font-heading tracking-tight">
                            Hey, <span className="text-primary">{authUser?.name}</span>!
                        </h1>
                    </div>

                    <button
                        type="button"
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium select-none transition-all duration-300 relative overflow-hidden ${isUploadingDocs
                                ? 'bg-base-300 text-base-content/40 cursor-not-allowed border border-primary/20'
                                : 'bg-primary text-primary-content hover:bg-primary-focus hover:shadow-sm cursor-pointer'
                            }`}
                        onClick={() => !isUploadingDocs && fileInputRef.current.click()}
                        disabled={isUploadingDocs}
                    >
                        
                        <div
                            className="absolute inset-y-0 left-0 bg-white/10 pointer-events-none z-0"
                            style={{
                                width: isUploadingDocs ? '100%' : '0%',
                                transition: 'width 3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        />

                        
                        <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={HandelFileChange} 
                            disabled={isUploadingDocs}
                        />

                        
                        <div className="relative z-10 flex items-center gap-2 text-sm md:text-base">
                            {isUploadingDocs ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <ArrowUpFromLine size={18} />
                                    <span>Upload PDF</span>
                                </>
                            )}
                        </div>
                    </button>



                    
                </div>

                <div className="mb-10 md:mb-14">
                    <h2 className="text-base-content/50 text-xs font-semibold uppercase tracking-widest mb-4 md:mb-6">Overview</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">

                        
                        <div className="bg-neutral text-neutral-content p-6 md:p-8 rounded-3xl md:rounded-[30px] flex flex-col justify-between h-48 md:h-56 hover:bg-secondary hover:text-secondary-content transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl">
                            <div className="bg-white/10 p-2.md:p-3 self-start rounded-full border border-white/20">
                                <PlusCircle size={24} className="md:w-7 md:h-7" />
                            </div>
                            <div className='flex justify-between items-end gap-2'>
                                <h3 className="text-2xl md:text-3xl font-bold font-heading leading-tight">Uploaded <br /> PDFs</h3>
                                <p className='text-3xl md:text-4xl font-bold text-primary'>{getTotalDocs()}</p>
                            </div>
                            <p className="text-xs md:text-sm opacity-70">Summaries & flashcards ready</p>
                        </div>

                        <div className="bg-base-200 border border-base-content/5 p-6 md:p-8 rounded-3xl md:rounded-[30px] flex flex-col justify-between h-48 md:h-56 group hover:bg-secondary hover:text-primary-content transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md sm:col-span-2 xl:col-span-1">
                            <div className="bg-primary/10 p-2.5 md:p-3 self-start rounded-full border border-primary/20 group-hover:bg-white/20 group-hover:border-white/30">
                                <BadgeQuestionMarkIcon size={24} className="md:w-7 md:h-7" />
                            </div>
                            <div className='flex justify-between items-end gap-2'>
                                <h3 className="text-2xl md:text-3xl font-bold font-heading leading-tight">Total <br /> Quizzes</h3>
                                <p className='text-3xl md:text-4xl font-bold text-primary'>{getTotalQuizzes()}</p>
                            </div>
                            <p className="text-xs md:text-sm opacity-70">AI Generated Quizzes</p>
                        </div>


                        <div className="bg-base-200 border border-base-content/5 p-6 md:p-8 rounded-3xl md:rounded-[30px] flex flex-col justify-between h-48 md:h-56 group hover:bg-primary hover:text-primary-content transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md sm:col-span-2 xl:col-span-1">
                            <div className="bg-primary/10 p-2.5 md:p-3 self-start rounded-full border border-primary/20 group-hover:bg-white/20 group-hover:border-white/30">
                                <Zap size={24} className="text-primary group-hover:text-primary-content md:w-7 md:h-7" />
                            </div>
                            <div className='flex justify-between items-end gap-2'>
                                <h3 className="text-2xl md:text-3xl font-bold font-heading leading-tight">Flash <br /> Cards</h3>
                                <p className='text-3xl md:text-4xl font-bold'>{getTotalFlashcard()}</p>
                            </div>
                            <p className="text-xs md:text-sm opacity-70 group-hover:opacity-100">AI-generated revision sets</p>
                        </div>

                    </div>
                </div>

                {/* Recent Activity Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base-content/50 text-sm font-semibold uppercase tracking-widest">Recent Activity</h2>
                        {/* <button className="btn btn-ghost btn-sm text-primary gap-2 normal-case">
                                <LayoutGrid size={16} /> View All
                            </button> */}
                    </div>

                    <div className="space-y-4">
                        {dynamicRecentActivity.length === 0 ? (
                            <div className="text-center p-8 bg-base-200/30 rounded-2xl border border-dashed border-base-content/10 text-base-content/40 text-sm font-medium">
                                No recent study sessions tracked yet. Generate your first set!
                            </div>
                        ) : (
                            dynamicRecentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-5 bg-base-200/50 rounded-2xl border border-base-content/5 hover:border-primary/30 hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`${activity.color} bg-base-100 border border-base-content/10 p-3 rounded-full shadow-inner`}>
                                            <Zap size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-base-content group-hover:text-primary transition-colors duration-200">{activity.title}</h4>
                                            <p className="text-xs text-base-content/50 uppercase tracking-wide font-bold">{activity.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-success">Revision Ready</p>
                                        <p className="text-xs text-base-content/40 mt-0.5">{activity.date}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Homepage




