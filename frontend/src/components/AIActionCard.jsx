import React from 'react'
import { useDocStore } from '../store/useDocStore'
import { BrainCircuit, FileText, Loader2, Zap } from 'lucide-react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import SummaryModal from './SummaryModal';

const AIActionCard = ({ doc }) => {
    const [ModalTitle, setModalTitle] = useState('');
    const [ModalContent, setModalContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ConceptTopic, setConceptTopic] = useState('')
    const [loading, setloading] = useState(false)
    
    const { isGenerating, isExplaining, getExplaination } = useDocStore()

    const handelViewSummary = () => {
        setloading(true)
        if (doc?.notes) {
            setModalTitle("Generated Summary");
            setModalContent(doc.notes);
            setIsModalOpen(true)
            setloading(false)
        } else {
            toast.error("summary failed")
        }
    }

    const handelExplainTopic = async () => {
        setloading(true)
        if (!ConceptTopic) {
            return toast.error("enter any topic for explanation")
        }
        setModalTitle(`Explaining: ${ConceptTopic}`)
        setModalContent("")
        setIsModalOpen(true)
        try {
            const data = await getExplaination(doc._id, ConceptTopic)
            setModalContent(data.explanation)
            setConceptTopic('')
            setloading(false)
        } catch (error) {
            setIsModalOpen(false);
            console.error("Explain error:", error);
            toast.error("Explain failed");
        }
    }

    return (
        
        <div className="w-full h-full bg-base-100 flex flex-col gap-6 select-none">
            
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-2">
                <div className="bg-primary/10 p-3 rounded-2xl border border-primary/10">
                    <BrainCircuit className="text-primary" size={28} />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-base-content">AI Assistant</h2>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Powered by Gemini Pro</p>
                </div>
            </div>

            <div className="bg-base-200/40 border border-base-content/5 rounded-2xl md:rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-primary/20 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start sm:items-center gap-4 md:gap-6 min-w-0">
                    <div className="bg-blue-500/10 p-3.5 md:p-4 rounded-xl md:rounded-2xl text-blue-500 group-hover:scale-105 transition-transform duration-300 flex-shrink-0 border border-blue-500/5">
                        <FileText size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg md:text-xl font-bold text-base-content">Generate Summary</h3>
                        <p className="opacity-50 text-xs md:text-sm font-medium mt-1 leading-relaxed">Get a concise summary of the entire document with key points.</p>
                    </div>
                </div>
                <button 
                    onClick={handelViewSummary}
                    disabled={isGenerating}
                    className="btn btn-primary normal-case rounded-xl md:rounded-2xl px-8 h-12 md:h-14 shadow-md shadow-primary/10 hover:scale-[1.02] transition-all w-full md:w-auto flex-shrink-0"
                >
                    {isGenerating ? (
                        <Loader2 className="animate-spin text-primary-content" size={20} />
                    ) : (
                        <span className="font-bold text-sm tracking-wide">Generate</span>
                    )}
                </button>
            </div>

            {/* 2. Explain a Concept Card */}
            <div className="bg-base-200/40 border border-base-content/5 rounded-2xl md:rounded-[2rem] p-6 md:p-8 flex flex-col gap-6 hover:border-primary/20 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start sm:items-center gap-4 md:gap-6 min-w-0">
                    
                    <div className="bg-amber-500/10 p-3.5 md:p-4 rounded-xl md:rounded-2xl text-amber-500 group-hover:scale-105 transition-transform duration-300 flex-shrink-0 border border-amber-500/5">
                        <Zap size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg md:text-xl font-bold text-base-content">Explain a Concept</h3>
                        <p className="opacity-50 text-xs md:text-sm font-medium mt-1 leading-relaxed">Enter a topic or concept from the document to get a detailed explanation.</p>
                    </div>
                </div>
                
                {/* Inputs & Actions Control Grid */}
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <input 
                        type="text" 
                        value={ConceptTopic}
                        onChange={(e) => setConceptTopic(e.target.value)}
                        placeholder="e.g., 'React Hooks' or 'Neural Networks'" 
                        className="input input-bordered flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl bg-base-100 border-base-content/10 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/5 px-5 font-semibold text-sm transition-all text-base-content"
                    />
                    <button 
                        onClick={handelExplainTopic}
                        disabled={isExplaining}
                        className="btn btn-primary normal-case rounded-xl md:rounded-2xl px-8 h-12 md:h-14 shadow-md shadow-primary/10 hover:scale-[1.02] transition-all w-full sm:w-auto font-bold text-sm tracking-wide flex-shrink-0"
                    >
                        {isExplaining ? (
                            <Loader2 className="animate-spin text-primary-content" size={20} />
                        ) : (
                            <span>Explain</span>
                        )}
                    </button>
                </div>
            </div>

            <SummaryModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                loading={loading} 
                content={ModalContent}
                title={ModalTitle}
            />        
        </div>
    )
}

export default AIActionCard