
import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export const useDocStore = create((set, get) => ({
    documents: [],
    chatMessages: [],
    summary: '',
    isfetchingDocuments: false,
    isUploadingDocs: false,
    isGenerating: false,
    isExplaining: false,
    isChatting: false,
    isGeneratingQuiz:false, 


    uploadDocument: async (formdata) => {
        set({ isUploadingDocs: true })
        try {
            const res = await axiosInstance.post('/docs/upload', formdata)
            set((state) => ({
                documents: [...state.documents, res.data],
                isUploadingDocs: false
            }));
        } catch (error) {
            set({ isUploadingDocs: false });
            toast.error(error.response?.data?.message || "Server Error");
        }
    },

    fetchDocuments: async () => {
        set({ isfetchingDocuments: true })
        try {
            const res = await axiosInstance.get("/docs/all");
            set({ documents: res.data });
        } catch (error) {
            console.log("Error fetching documents:", error);
            toast.error(error.response?.data?.message || "Failed to load documents");
        } finally {
            set({ isfetchingDocuments: false })
        }
    },
    deleteDocument: async (id) => {
        try {
            const res = await axiosInstance.delete(`/docs/delete/${id}`);
            
            set((state) => ({
                documents: state.documents.filter((doc) => doc._id !== id)
            }));
            
            toast.success(res.data?.message || "Document permanently deleted");
            return { success: true };
        } catch (error) {
            console.error("Document deletion failed:", error);
            const message = error.response?.data?.message || "Failed to delete document";
            toast.error(message);
            throw error;
        }
    },

    getTotalDocs: () => get().documents.length,
    getTotalFlashcard: () => {
        const docs = get().documents;
        return docs.reduce((total, doc) => total + (doc.flashcards?.length || 0), 0)
    },
    getTotalQuizzes: () => {
        const docs = get().documents;
        return docs.reduce((total, doc) => total + (doc.quizzes?.length || 0), 0)
    },
    addDocument: (newDoc) => {
        set((state) => ({
            documents: [newDoc, ...state.documents],
        }));
    },
    getSelectedDoc: (id) => get().documents.find((doc) => doc._id === id),

    getExplaination: async (docID, topic) => {
        set({ isExplaining: true })
        try {
            const res = await axiosInstance.post(`/docs/explain/${docID}`, { topic })
            set({ isExplaining: false })
            return res.data
        } catch (error) {
            set({ isExplaining: false });
            const message = error.response?.data?.message || "AI logic failed";
            toast.error(message);
            throw error;
        }
    },


    getAIflashCard: async (docID) => {
        if (!docID) return;
        set({ isGenerating: true })
        try {
            const res = await axiosInstance.post(`/docs/flashcards/${docID}`)
            console.log("Backend cards received:", res.data)

            set((state) => {
                const updatedDocs = state.documents.map((doc) =>
                    doc._id === docID ? { ...doc, flashcards: res.data } : doc
                );
                return {
                    documents: updatedDocs,
                    isGenerating: false
                };
            });

            toast.success("Flashcards generated successfully!");
            return res.data;
        } catch (error) {
            set({ isGenerating: false });
            const message = error.response?.data?.message || "AI logic failed";
            toast.error(message);
            throw error;
        }
    },



fetchDocQuizzes: async (docID) => {
    try {
        const res = await axiosInstance.get(`/docs/quizz/${docID}`); // 👈 GET Request
        set((state) => ({
            documents: state.documents.map((doc) =>
                doc._id === docID ? { ...doc, quizSets: res.data.quizSets } : doc
            )
        }));
        return res.data;
    } catch (error) {
        console.error("Fetching quizzes failed:", error);
        throw error;
    }
},



createNewQuizSet: async (docID) => {
    set({ isGeneratingQuiz: true });
    try {
        const res = await axiosInstance.post(`/docs/quizz/${docID}`); // 👈 POST Request
        set((state) => ({
            documents: state.documents.map((doc) =>
                doc._id === docID ? { ...doc, quizSets: res.data.quizSets } : doc
            )
        }));
        set({ isGeneratingQuiz: false });
        return res.data;
    } catch (error) {
        console.error("Generating quiz failed:", error);
        set({ isGeneratingQuiz: false });
        throw error;
    }
}


}));
