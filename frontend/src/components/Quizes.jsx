import React, { useState, useEffect } from 'react'
import { Brain, CheckCircle2, XCircle, ArrowRight, Award, Layers, ArrowLeft } from 'lucide-react'
import { useDocStore } from '../store/useDocStore'
import QuizLibrary from './QuizLibrary' 
import toast from 'react-hot-toast'

const Quizzes = ({ docID, doc }) => {
    const { isGeneratingQuiz, fetchDocQuizzes, createNewQuizSet } = useDocStore()

    
    const [viewMode, setViewMode] = useState('library') 
    const [activeSet, setActiveSet] = useState(null)

    
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState({}) 
    const [isReviewed, setIsReviewed] = useState(false) 

    
    useEffect(() => {
        if (docID) {
            fetchDocQuizzes(docID).catch((err) => {
                console.error("Quiz store sync exception:", err);
            });
        }
    }, [docID, fetchDocQuizzes]);

    const quizSets = doc?.quizSets || [];

    const handleStartQuizSet = (setObject) => {
        setActiveSet(setObject);
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setIsReviewed(false);
        setViewMode('quiz');
    }

    const handleOptionSelect = (optionText) => {
        if (isReviewed) return; 
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion]: optionText
        }));
    }

    const handleNextQuestion = () => {
        if (!activeSet) return;
        if (currentQuestion + 1 < activeSet.questions.length) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setIsReviewed(true);
            toast.success("Assessment submitted successfully.");
        }
    }

    const handleCreateNewQuizSet = async () => {
        try {
            const data = await createNewQuizSet(docID);
            toast.success("New evaluation matrix compiled.");
            console.log(data)
            
            if (data?.activeSetId) {
                const targetSet = data.quizSets.find(s => s.setId === data.activeSetId);
                if (targetSet) handleStartQuizSet(targetSet);
            }
        } catch (error) {
            toast.error("Failed to initialize AI quiz core engine");
        }
    }

    const calculateScore = () => {
        if (!activeSet) return 0;
        let finalScore = 0;
        activeSet.questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correctAnswer) finalScore++;
        });
        return finalScore;
    }

    return (
        <div className="flex flex-col flex-1 h-full bg-base-100 overflow-hidden select-none font-sans">
            
            
            <div className="pb-4 border-b border-base-content/5 bg-base-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                    {viewMode === 'quiz' ? (
                        <button 
                            onClick={() => setViewMode('library')}
                            className="btn btn-ghost btn-xs btn-square border border-base-content/10 text-base-content rounded-lg h-9 w-9"
                            title="Return to vault"
                        >
                            <ArrowLeft size={16} />
                        </button>
                    ) : (
                        <div className="bg-primary/10 p-2 rounded-xl border border-primary/5 text-primary">
                            <Layers size={18} />
                        </div>
                    )}
                    <div>
                        <h3 className="font-bold text-sm text-base-content">
                            {viewMode === 'quiz' ? 'Assessment Engine' : 'AI Quiz Repository'}
                        </h3>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-wider">
                            {viewMode === 'quiz' ? 'Runtime Session' : 'Multi-Set Evaluation Hub'}
                        </p>
                    </div>
                </div>

                {viewMode === 'quiz' && activeSet && (
                    <span className="text-xs font-mono font-black opacity-50 bg-base-200 px-3 py-1.5 rounded-lg border border-base-content/5">
                        Index: {currentQuestion + 1} / {activeSet.questions.length}
                    </span>
                )}
            </div>

            
            <div className="flex-1 overflow-y-auto py-6 px-1 min-h-0 flex flex-col justify-start">
                
                
                {viewMode === 'library' && (
                    <QuizLibrary 
                        quizSets={quizSets}
                        isGeneratingQuiz={isGeneratingQuiz}
                        onStartQuiz={handleStartQuizSet}
                        onCreateSet={handleCreateNewQuizSet}
                    />
                )}

                {viewMode === 'quiz' && activeSet && (
                    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
                        
                        {isReviewed && (
                            <div className="bg-success/5 border border-success/20 p-5 rounded-2xl text-center flex flex-col items-center gap-3 mb-2 animate-fadeIn">
                                <Award size={32} className="text-success" />
                                <h3 className="text-base font-black text-base-content tracking-tight">Performance Analytics Released</h3>
                                <p className="text-xs text-base-content/40 font-medium">Review granular answer mapping and node integrity diagnostics below.</p>
                                <div className="text-sm font-mono font-black bg-base-100 border border-base-content/5 px-5 py-2 rounded-xl mt-1">
                                    Total Accuracy: <span className="text-success">{calculateScore()}</span> / {activeSet.questions.length} Correct
                                </div>
                            </div>
                        )}

                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-base-content leading-relaxed tracking-tight px-1">
                            {activeSet.questions[currentQuestion].question}
                        </h2>

                        <div className="flex flex-col gap-3">
                            {activeSet.questions[currentQuestion].options.map((option, index) => {
                                const userChosenAnswer = selectedAnswers[currentQuestion];
                                const isSelected = userChosenAnswer === option;
                                const isCorrectOptionText = activeSet.questions[currentQuestion].correctAnswer === option;
                                
                                let optionStyle = "bg-base-100 border-base-content/10 hover:border-base-content/20";
                                if (isSelected) optionStyle = "bg-primary/5 border-primary/40 ring-1 ring-primary/15";
                                
                                if (isReviewed) {
                                    if (isCorrectOptionText) optionStyle = "bg-success/10 border-success/30 text-success font-semibold pointer-events-none";
                                    else if (isSelected) optionStyle = "bg-error/10 border-error/30 text-error font-medium pointer-events-none";
                                    else optionStyle = "bg-base-100 border-base-content/5 opacity-30 pointer-events-none";
                                }

                                return (
                                    <div 
                                        key={index}
                                        onClick={() => handleOptionSelect(option)}
                                        className={`p-4 rounded-xl border flex items-center justify-between text-xs sm:text-sm transition-all duration-200 cursor-pointer ${optionStyle}`}
                                    >
                                        <span className="font-medium pr-4 leading-normal">{option}</span>
                                        <div className="flex-shrink-0 ml-2">
                                            {isReviewed && isCorrectOptionText && <CheckCircle2 size={16} className="text-success" />}
                                            {isReviewed && isSelected && !isCorrectOptionText && <XCircle size={16} className="text-error" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        
                        <div className="flex justify-between items-center gap-3 mt-4 border-t border-base-content/5 pt-5 w-full">
                            <button 
                                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestion === 0}
                                className="btn btn-ghost border border-base-content/10 btn-sm h-11 px-5 rounded-xl font-bold text-xs disabled:opacity-20 normal-case"
                            >
                                Previous
                            </button>

                            <div className="flex gap-2">
                                {isReviewed ? (
                                    currentQuestion + 1 === activeSet.questions.length ? (
                                        <button 
                                            onClick={() => setViewMode('library')}
                                            className="btn btn-neutral normal-case font-bold text-xs rounded-xl px-6 h-11 min-h-[44px] shadow-sm flex items-center gap-2"
                                        >
                                            <Layers size={14}/>
                                            <span>Exit to Registry</span>
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={handleNextQuestion}
                                            className="btn btn-neutral normal-case font-bold text-xs rounded-xl px-6 h-11 min-h-[44px] gap-2 shadow-sm"
                                        >
                                            <span>Next Node</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    )
                                ) : (
                                    <button 
                                        onClick={handleNextQuestion}
                                        disabled={!selectedAnswers[currentQuestion]}
                                        className="btn btn-primary normal-case font-bold text-xs rounded-xl px-8 h-11 min-h-[44px] disabled:opacity-20 shadow-sm flex items-center gap-2"
                                    >
                                        <span>{currentQuestion + 1 === activeSet.questions.length ? "Submit Session" : "Next Question"}</span>
                                        <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    )
}

export default Quizzes