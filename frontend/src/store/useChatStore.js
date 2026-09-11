import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
    isChatting: false,
    chatMessages: [], 
    isFetchingHistory: false,

    fetchChatHistory: async (docID) => {
        if (!docID) return
        set({ isFetchingHistory: true })
        try {
            const res = await axiosInstance.get(`/chat/history/${docID}`)
            if (res.data) {
                set({ chatMessages: res.data })
            }
        }
        catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            set({ isFetchingHistory: false });
        }
    },

    getAIchat: async (docID, ques_message) => {
        
        set({ isChatting: true });

        try {

            const res = await axiosInstance.post(`/chat/aiChat/${docID}`, { ques_message });


            if (res.data.fullHistory) {
                set({ chatMessages: res.data.fullHistory });
            } else {

                set((state) => ({
                    chatMessages: [...state.chatMessages, { role: 'ai', content: res.data.reply }]
                }));
            }

        } catch (error) {
            console.error("Chat Error:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {

            set({ isChatting: false });
        }
    },


    clearChat: () => set({ chatMessages: [] }),
}));