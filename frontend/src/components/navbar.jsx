// import React from 'react'
// import { ChevronLeft, Settings } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'
// import { useAuthStore } from '../store/useAuthStore'


// const Navbar = () => {
//     const navigate = useNavigate()
//     const { authUser } = useAuthStore()


//     return (
//         /* Transparent layout container ensuring text layers float seamlessly on top of bento containers */
//         <header className="w-full h-20 pr-8 pl-4 flex items-center justify-between bg-transparent select-none shrink-0 font-sans antialiased">
            
//             {/* LEFT SECTION: Minimal Back Control Node */}
//             <div 
//                 onClick={() => navigate(-1)} 
//                 className="flex items-center gap-2.5 cursor-pointer group"
//                 title="Go Back"
//             >
//                 <div className="w-8 h-8 rounded-full bg-[#1c1c1e] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
//                     <ChevronLeft size={16} strokeWidth={2.5} />
//                 </div>
//                 <span className="text-[#1c1c1e]/40 text-[11px] font-black uppercase tracking-widest group-hover:text-[#1c1c1e] transition-colors duration-200">
//                     Back
//                 </span>
//             </div>

//             {/* MIDDLE SECTION: Bold Center Title Branding */}
//             <div className="text-center px-6 py-2.5 flex flex-col items-center justify-center gap-0.5 mx-auto transition-all duration-300">
//     <h2 className="text-xs sm:text-sm font-black tracking-wide text-white uppercase leading-none">
//         Hey, 
//         <span className=" font-fredoka normal-case tracking-normal text-lg sm:text-base font-bold pl-0.5">
//             {authUser?.name}!
//         </span>
//     </h2>
// </div>


//             {/* RIGHT SECTION: Interactive Setting Shortcut Module */}
//             <div 
//                 onClick={() => navigate('/settings')}
//                 className="w-9 h-9 rounded-full bg-white border border-black/5 text-[#1c1c1e]/50 hover:text-[#1c1c1e] hover:border-black/20 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 group"
//                 title="Workspace Settings"
//             >
//                 <Settings 
//                     size={16} 
//                     strokeWidth={2.2} 
//                     className="group-hover:rotate-45 transition-transform duration-500 ease-out" 
//                 />
//             </div>

//         </header>
//     )
// }

// export default Navbar