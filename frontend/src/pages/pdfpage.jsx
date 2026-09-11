import { useParams, Link } from 'react-router-dom';
import { useDocStore } from '../store/useDocStore';
import { useEffect, useState } from 'react';
import { FileText, Zap, BrainCircuit, ArrowLeft, TextAlignStart, Brain, CircleQuestionMark, BadgeQuestionMark } from 'lucide-react';
import Sidebar from '../components/sidebar';
import AIActionCard from '../components/AIActionCard';
import AIchatBox from '../components/aiChatBox'
import FlashCards from '../components/flashCard';
import Quizzes from '../components/Quizes'

const PdfPage = () => {
    const { id } = useParams();
    const { documents, fetchDocuments, isfetchingDocuments } = useDocStore();
    const [activeTab, setActiveTab] = useState(() => {
        return sessionStorage.getItem('activeTab') || 'pdf'
    });

    useEffect(() => {
        sessionStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    const menuItems = [
        { pageid: 'pdf', label: 'PDF VIEWER', icon: FileText },
        { pageid: 'AI-Action', label: 'AI ACTIONS', icon: TextAlignStart },
        { pageid: 'ask-ai', label: 'ASK AI', icon: Brain },
        { pageid: 'flashcards', label: 'FLASHCARDS', icon: CircleQuestionMark },
        { pageid: 'quiz', label: 'QUIZES', icon: BadgeQuestionMark },
    ];

    useEffect(() => {
        if (documents.length === 0) {
            fetchDocuments();
        }
    }, [fetchDocuments, documents.length, activeTab]);
    

    const doc = documents.find((d) => d._id === id);

    
    if (!doc || isfetchingDocuments) {
        return (
            <div className="h-screen w-full bg-base-100 flex flex-col items-center justify-center gap-4 font-sans">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-sm font-bold opacity-60 animate-pulse tracking-wide">Syncing Study Hub...</p>
            </div>
        );
    }

    const temp = doc.title
    const [name, ext] = temp.split(".")

    return (
        <div className="h-screen w-full bg-base-100 flex font-sans transition-all duration-300 antialiased overflow-hidden">
            
            
            <div className='w-[18%] min-w-[220px] max-w-[280px] hidden md:block border-r border-base-content/5 bg-base-100 h-full flex-shrink-0'>
                <Sidebar />
            </div>

            
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

                {/* Header Controls */}
                <header className="flex items-center justify-between p-4 sm:p-6 md:p-8 border-b border-base-content/5 bg-base-100 shrink-0">
                    <div className="flex items-center gap-4 min-w-0">
                        <Link to="/documents" className="btn btn-ghost btn-sm btn-square rounded-xl flex-shrink-0">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl md:text-2xl font-black truncate max-w-xl text-base-content tracking-tight" title={doc.title}>
                            {name}<span className="text-primary">.{ext}</span>
                        </h1>
                    </div>
                </header>

                {/* Tabs Hub Controller Area */}
                <div className="px-4 sm:px-6 md:px-8 py-2 shrink-0">
                    <div className='flex gap-1.5 bg-base-200 p-1.5 rounded-2xl w-fit shadow-inner overflow-x-auto max-w-full no-scrollbar'>
                        {menuItems.map((tab) => (
                            <button
                                key={tab.pageid}
                                onClick={() => setActiveTab(tab.pageid)}
                                className={`flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-xl font-black text-[11px] tracking-wider transition-all duration-200 whitespace-nowrap ${
                                    activeTab === tab.pageid
                                        ? 'bg-base-100 text-primary shadow-sm scale-100'
                                        : 'text-base-content/40 hover:text-base-content scale-95'
                                }`}
                            >
                                <tab.icon size={15} strokeWidth={2.5} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <main className="flex-1 overflow-hidden p-4 sm:p-6 md:p-8 bg-base-100 flex flex-col min-h-0 w-full max-w-[1600px] mx-auto">

                    {activeTab === 'pdf' && (
                        <div className="flex-1 w-full rounded-2xl overflow-hidden border border-base-content/5 shadow-md bg-base-200 p-1.5 h-full">
                            <iframe
                                src={`${doc.fileURL}#view=FitH&toolbar=0`}
                                className="w-full h-full rounded-xl bg-white"
                                title="PDF Viewer"
                                style={{ border: 'none' }}
                            />
                        </div>
                    )}

                    {/* AI Actions Tab */}
                    {activeTab === 'AI-Action' && (
                        <div className="flex-1 overflow-y-auto h-full pr-1 custom-scrollbar">
                            <AIActionCard doc={doc} />
                        </div>
                    )}

                    {/* Ask AI Chatbox Tab */}
                    {activeTab === 'ask-ai' && (
                        <div className="flex-1 h-full min-h-0">
                            <AIchatBox docID={id} title={doc.title} />
                        </div>
                    )}

                    {/* Flashcards Component Tab */}
                    {activeTab === 'flashcards' && (
                        <div className="flex-1 overflow-y-auto h-full pr-1 custom-scrollbar">
                            <FlashCards docID={id} title={doc.title} />
                        </div>
                    )}
                    {activeTab === 'quiz' && (
                        <div className="flex-1 overflow-y-auto h-full pr-1 custom-scrollbar">
                            <Quizzes docID={id} doc={doc} />
                        </div>
                    )}

                </main>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--bc), 0.08); border-radius: 20px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default PdfPage;