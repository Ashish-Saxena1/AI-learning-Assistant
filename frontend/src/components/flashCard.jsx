
import React, { useState, useEffect } from "react";
import { useDocStore } from "../store/useDocStore.js";
import { Brain, Sparkles, ArrowLeft, ArrowRight, RotateCcw, Plus, Loader2, Calendar } from "lucide-react";

const FlashcardPage = ({ docID, title }) => {
    
    const { documents, getAIflashCard, isGenerating } = useDocStore();

    const currentDoc = documents?.find((d) => d._id === docID);
    const flashcardSets = currentDoc?.flashcards || [];

    const [viewMode, setViewMode] = useState("list"); // 'list' || 'study'
    const [selectedSetIndex, setSelectedSetIndex] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (flashcardSets.length > 0 && viewMode === "list") {
            setViewMode("list");
        }
    }, [flashcardSets]);

    const handleGenerate = async () => {
        if (!docID) return;
        const data = await getAIflashCard(docID);
        if (data && data.length > 0) {
            setSelectedSetIndex(data.length - 1);
            setViewMode("study");
            setCurrentIndex(0);
            setIsFlipped(false);
        }
    };

    
    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[65vh] text-center bg-base-100 border border-base-300 rounded-4xl shadow-sm max-w-5xl mx-auto my-6 p-12">
                <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute w-20 h-20 bg-primary/10 rounded-full animate-ping" />
                    <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center z-10 shadow-inner">
                        <Brain size={32} className="animate-pulse" />
                    </div>
                </div>
                <h3 className="text-xl font-black text-base-content tracking-tight">AI is analyzing {title || "your document"}...</h3>
                <p className="text-sm text-base-content/60 font-medium mt-1 max-w-xs">Reading contents and engineering 10 premium active-recall flashcards.</p>
                <div className="flex items-center gap-2 mt-6 bg-base-200 border border-base-300 px-4 py-2 rounded-xl text-xs font-bold text-base-content/70">
                    <Loader2 className="animate-spin text-primary" size={14} />
                    Processing ....
                </div>
            </div>
        );
    }


    if (flashcardSets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-base-100 border border-base-300 rounded-4xl max-w-4xl mx-auto shadow-sm my-10 transition-all text-center">
                <div className="w-20 h-20 bg-primary/5 border border-primary/20 text-primary rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                    <Brain size={36} />
                </div>
                <h2 className="text-3xl font-black text-base-content mb-3 tracking-tight">No Flashcards Yet</h2>
                <p className="text-base-content/60 text-center max-w-md mb-8 font-medium text-sm leading-relaxed">
                    Generate custom smart AI flashcards directly from your reference PDF text to accelerate active recall and ace your exams.
                </p>
                <button
                    onClick={handleGenerate}
                    className="btn btn-primary rounded-2xl font-bold px-8 py-4 h-auto gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
                >
                    <Sparkles size={18} /> Generate Flashcards
                </button>
            </div>
        );
    }

    
    if (viewMode === "list") {
        return (
            <div className="w-full h-full overflow-y-auto p-6 md:p-8 space-y-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-base-200">
                    <div>
                        <h2 className="text-3xl font-black text-base-content tracking-tight">Your Flashcard Sets</h2>
                        <p className="text-sm text-primary font-bold uppercase tracking-wider mt-1.5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary inline-block animate-pulse" />
                            Current active cards ({flashcardSets.length} Sets Ready)
                        </p>
                    </div>
                    <button
                        onClick={handleGenerate}
                        className="btn btn-primary rounded-2xl font-bold gap-2 shadow-md shadow-primary/10 hover:shadow-lg transition-all duration-200 px-6 py-3.5 h-auto"
                    >
                        <Plus size={18} /> Generate New Set
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2 pb-12">
                    {flashcardSets.map((setInstance, index) => (
                        <div
                            key={setInstance._id || index}
                            onClick={() => {
                                setSelectedSetIndex(index);
                                setViewMode("study");
                                setCurrentIndex(0);
                                setIsFlipped(false);
                            }}
                            className="bg-base-100 border border-base-300 rounded-4xl p-6 shadow-sm cursor-pointer relative group hover:shadow-2xl hover:border-primary hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between min-h-55"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl border border-primary/10 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                                        <Brain size={26} />
                                    </div>
                                    <span className="text-[10px] font-black tracking-widest text-primary bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-xl uppercase">
                                        {title ? `${title}` : "PDF"}
                                    </span>
                                </div>
                                <h3 className="font-extrabold text-base-content text-xl group-hover:text-primary transition-colors duration-200 line-clamp-1">
                                    {setInstance.setName || `Set #${index + 1}`}
                                </h3>
                                {/* <p className="text-xs font-semibold text-base-content/50 mt-1 flex items-center gap-1">
                                    <Calendar size={12} /> Core dynamic context set
                                </p> */}
                            </div>
                            <div className="flex justify-between items-center pt-6 border-t border-base-200 mt-4">
                                <span className="bg-base-200 border border-base-300 text-base-content/80 font-black px-3.5 py-1.5 rounded-xl text-xs tracking-wider">
                                    {setInstance.cards?.length || 0} CARDS
                                </span>
                                <span className="text-xs font-black text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex items-center gap-1">
                                    Start Session →
                                </span>
                            </div>
                        </div>
                    ))}

                    <div onClick={handleGenerate} className="border-2 border-dashed border-base-300 hover:border-primary rounded-4xl p-6 flex flex-col items-center justify-center min-h-55 cursor-pointer group hover:bg-primary/5 transition-all duration-300">
                        <div className="w-12 h-12 bg-base-200 border border-base-300 text-base-content/40 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-300"><Plus size={20} /></div>
                        <p className="font-bold text-sm text-base-content/60 group-hover:text-primary transition-colors duration-200">Create target variant set</p>
                        <p className="text-[11px] text-base-content/40 mt-0.5">Use distinct sub-prompts via AI</p>
                    </div>
                </div>
            </div>
        );
    }

    
    const activeSet = flashcardSets[selectedSetIndex];
    const activeCards = activeSet?.cards || [];
    const currentCard = activeCards[currentIndex];

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-4 flex flex-col justify-start items-center min-h-full overflow-y-auto">

            
            <div className="w-full flex justify-between items-center mb-6">
                <button
                    onClick={() => setViewMode("list")}
                    className="flex items-center gap-2 font-bold text-sm text-base-content/60 hover:text-base-content transition-colors duration-200 bg-base-100 border border-base-300 px-4 py-2 rounded-xl shadow-sm hover:shadow"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-xs font-black text-base-content/60 uppercase tracking-widest bg-base-200 border border-base-300 px-3 py-1.5 rounded-xl">
                        Reviewing {activeSet?.setName || "Active Set"}
                    </span>
                </div>
            </div>

            
            <div
                className="w-full aspect-16/10 md:aspect-3/2 max-h-95 min-h-70 cursor-pointer perspective-[1500px] mb-6 group"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={`relative w-full h-full transition-transform duration-500 transform-3d ${isFlipped ? 'transform-[rotateX(180deg)]' : ''}`}>

                
                    <div className="absolute inset-0 w-full h-full bg-base-100 border border-base-300 rounded-4xl p-8 md:p-12 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-between [backface-visibility:hidden]">
                        <span className="text-xs font-black tracking-widest text-base-content/50 bg-base-200 border border-base-300 px-4 py-1.5 rounded-xl uppercase self-start">
                            Flashcard {currentIndex + 1}
                        </span>

                        <div className="flex-1 flex items-center justify-center my-4 overflow-y-auto max-w-2xl">
                            <h2 className="text-xl md:text-2xl font-bold text-base-content text-center leading-relaxed tracking-tight select-none">
                                {currentCard?.question || "No Question Provided"}
                            </h2>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-extrabold text-base-content/30 group-hover:text-base-content/70 transition-colors duration-200 bg-base-200/50 border border-base-300 px-4 py-2 rounded-xl">
                            <RotateCcw size={14} className="group-hover:rotate-45 transition-transform" />
                            Click card to flip and verify
                        </div>
                    </div>

                    
                   
                    <div className="absolute inset-0 w-full h-full bg-linear-to-br from-primary to-primary-focus text-primary-content rounded-4xl p-8 md:p-12 shadow-md flex flex-col items-center justify-between [backface-visibility:hidden] [transform:rotateX(180deg)]">
                        <span className="text-xs font-black tracking-widest text-primary-content/80 bg-black/20 border border-white/10 px-4 py-1.5 rounded-xl uppercase self-start">
                            Verified Answer
                        </span>

                        <div className="flex-1 flex items-center justify-center my-4 overflow-y-auto max-w-2xl">
                            <p className="text-lg md:text-xl font-medium text-center leading-relaxed select-none tracking-wide drop-shadow-sm">
                                {currentCard?.answer || "No Answer Provided"}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold text-primary-content/80 bg-black/10 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                            <RotateCcw size={14} /> Click to view query surface
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex items-center gap-2 bg-base-200/60 border border-base-content/5 p-1.5 rounded-xl w-fit shadow-inner shrink-0 select-none backdrop-blur-md">
                
                <button
                    disabled={currentIndex === 0}
                    onClick={() => { setCurrentIndex(p => p - 1); setIsFlipped(false); }}
                    className="btn btn-ghost btn-sm h-8 min-h-[32px] px-2.5 rounded-lg font-black text-[10px] tracking-wider uppercase transition-all duration-200 border-none bg-base-100 shadow-sm text-base-content/70 hover:bg-primary hover:text-primary-content disabled:opacity-20 flex items-center gap-1"
                >
                    <ArrowLeft size={12} strokeWidth={2.5} /> Prev
                </button>

                
                <div className="font-black text-[10px] tracking-widest bg-base-100 text-primary border border-primary/10 px-3 h-8 flex items-center justify-center rounded-lg min-w-[56px] shadow-sm">
                    {currentIndex + 1}
                    <span className="opacity-30 mx-1 font-normal">/</span>
                    <span className="text-base-content/40">{activeCards.length}</span>
                </div>

                
                <button
                    disabled={currentIndex === activeCards.length - 1}
                    onClick={() => { setCurrentIndex(p => p + 1); setIsFlipped(false); }}
                    className="btn btn-ghost btn-sm h-8 min-h-[32px] px-2.5 rounded-lg font-black text-[10px] tracking-wider uppercase transition-all duration-200 border-none bg-base-100 shadow-sm text-base-content/70 hover:bg-primary hover:text-primary-content disabled:opacity-20 flex items-center gap-1"
                >
                    Next <ArrowRight size={12} strokeWidth={2.5} />
                </button>
            </div>

        </div>
    );
};

export default FlashcardPage;