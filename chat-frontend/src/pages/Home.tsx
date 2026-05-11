import NavBar from "../shared/components/NavBar"
import Contacts from "../features/chat/Contacts.tsx"
import ChatBox from "../features/chat/ChatBox.tsx"

import { useAppSelector } from '../app/hooks.ts'
import { socket } from '../utils/socket.ts'
import { useEffect } from "react"

const Home = () => {
  const user = useAppSelector((state) => state.protectRoutes.user)
  const contactInfo = useAppSelector((state) => state.contact.contactInfo)

  useEffect(() => {
    if (user) {
      console.log("user authenticated");
      socket.connect()

      return () => {
        socket.disconnect()
      }
    }
  }, [user])


  const isChatOpen = useAppSelector((state) => state.ui.isChatOpen);
  return (
    <div className="h-screen flex flex-col ">

      <div className=" flex-1 relative grid gap-2 grid-cols-12 min-h-0 h-full">
        <div className={` col-span-4  max-lg:col-span-5 
            transition-all duration-300 ease-in-out 
            border-slate-200 border-r    
            overflow-y-auto
             ${(contactInfo !== null ? ' max-md:h-full max-md:z-0 max-md:opacity-0 max-md:pointer-events-none max-md:w-full' : 'max-md:opacity-100 max-md:pointer-events-auto max-md:w-full max-md:absolute z-10 ')}`}>
          <NavBar />
          <Contacts />
        </div>
        <div className={`col-span-8  max-lg:col-span-7
           ${contactInfo !== null ? 'max-md:absolute max-md:h-full max-md:z-0 max-md:opacity-100 max-md:pointer-events-auto max-md:w-full' : 'max-md:opacity-0 max-md:pointer-events-none max-md:w-full'}  
              flex flex-col pb-1 transition-all duration-500 ease-in-out h-full min-h-0 overflow-hidden`}>{contactInfo !== null ? <ChatBox /> :
            (<p className={`  max-md:animate-fade-in my-auto mx-auto text-lg transition-all duration-500 ease-in-out max-md:hidden max-md:dura'} `} >
              ~select chat to start conversation and send messages</p>)}
        </div>

      </div>

    </div>
  )
}

export default Home
