import { FileText, Sparkles, Brain, BookOpen } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
    return (
        <div className="hidden lg:flex items-center justify-center bg-base-200/50 p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>

            <div className="max-w-md w-full">
                <div className="relative grid grid-cols-2 gap-4 mb-12">

                    <div className="bg-base-100 p-6 rounded-3xl shadow-sm border border-base-300 flex flex-col items-center gap-3 animate-bounce [animation-duration:3s]">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                            <FileText className="text-blue-600 w-6 h-6" />
                        </div>
                        <div className="h-2 w-16 bg-base-300 rounded-full"></div>
                    </div>

                    <div className="bg-primary p-6 rounded-3xl shadow-lg flex flex-col items-center gap-3 mt-8">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                            <Sparkles className="text-white w-6 h-6 animate-pulse" />
                        </div>
                        <div className="h-2 w-20 bg-white/30 rounded-full"></div>
                    </div>

                    <div className="bg-base-100 p-6 rounded-3xl shadow-sm border border-base-300 flex flex-col items-center gap-3 -mt-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                            <Brain className="text-purple-600 w-6 h-6" />
                        </div>
                        <div className="h-2 w-12 bg-base-300 rounded-full"></div>
                    </div>

                    <div className="bg-base-100 p-6 rounded-3xl shadow-sm border border-base-300 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                            <BookOpen className="text-green-600 w-6 h-6" />
                        </div>
                        <div className="h-2 w-24 bg-base-300 rounded-full"></div>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-[-1] opacity-20">
                        <svg width="100%" height="100%" className="stroke-primary">
                            <path d="M50,20 Q100,100 180,150" fill="none" strokeWidth="2" strokeDasharray="5,5" />
                        </svg>
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-base-content">{title}</h2>
                    <p className="text-lg text-base-content/60 leading-relaxed">
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthImagePattern;