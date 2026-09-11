import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// import { useDocStore } from '../store/useDocStore';
const SummaryModal = ({ isOpen, onClose, loading, content,title }) => {
    // const {isExplaining}=useDocStore()
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
            <div className="relative w-full max-w-2xl bg-white rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
                </div>

                {/* Modal Content */}
                <div className="p-8 md:p-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-base-200"/>AI is thinking...</div>
                    ) : (
                        
                        <div className="prose prose-slate max-w-none">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="btn btn-primary rounded-xl">Close</button>
                </div>
            </div>
        </div>
    );
};

export default SummaryModal;