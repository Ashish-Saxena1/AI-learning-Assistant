import React from 'react'
import { Brain, Sparkles, Loader2, Calendar } from 'lucide-react'

const QuizLibrary = ({ quizSets, isGeneratingQuiz, onStartQuiz, onCreateSet }) => {
    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 h-full font-sans">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-200/30 border border-base-content/5 p-5 rounded-2xl">
                <div>
                    <h4 className="text-sm font-black text-base-content">Generate Custom Testing Datasets</h4>
                    <p className="text-xs text-base-content/40 mt-0.5">Every set is uniquely sampled with different core evaluation structures.</p>
                </div>
                <button 
                    onClick={onCreateSet}
                    disabled={isGeneratingQuiz}
                    className="btn btn-primary normal-case rounded-xl font-bold text-xs h-11 shadow-sm px-6 w-full sm:w-auto shrink-0"
                >
                    {isGeneratingQuiz ? (
                        <Loader2 className="animate-spin" size={15}/>
                    ) : (
                        <><Sparkles size={14}/> Generate New Quiz</>
                    )}
                </button>
            </div>

            
            {quizSets.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto mt-10">
                    <Brain size={36} className="text-base-content/20 mb-3" />
                    <h3 className="text-sm font-black text-base-content">No practice sets cached</h3>
                    <p className="text-[11px] text-base-content/40 mt-1 leading-relaxed">
                        Launch your first multiple-choice context module using the compiler control bar above.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {quizSets.map((setObj, index) => (
                        <div 
                            key={setObj.setId || index}
                            onClick={() => onStartQuiz(setObj)}
                            className="bg-base-100 border border-base-content/10 hover:border-primary/20 hover:shadow-md p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between gap-4 group"
                        >
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-primary font-mono bg-primary/5 px-2.5 py-1 rounded-md border border-primary/5">
                                        SET #{index + 1}
                                    </span>
                                    <Brain size={14} className="opacity-0 group-hover:opacity-30 transition-opacity text-primary" />
                                </div>
                                <h4 className="text-sm font-bold text-base-content mt-2">
                                    {setObj.questions?.length || 5} Evaluation Tokens
                                </h4>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-base-content/40 font-semibold border-t border-base-content/5 pt-3">
                                <Calendar size={12}/>
                                <span>Generated: {setObj.createdAt ? new Date(setObj.createdAt).toLocaleDateString() : 'Recent Log'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default QuizLibrary