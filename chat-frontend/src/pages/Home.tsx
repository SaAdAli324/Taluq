import NavBar from "../shared/components/NavBar"
import Contacts from "../features/chat/Contacts.tsx"
import ChatBox from "../features/chat/ChatBox.tsx"

import { useAppSelector } from '../app/hooks.ts'

const Home = () => {
  
  const isChatOpen = useAppSelector((state) => state.ui.isChatOpen);
  return (
    <div className="h-screen  flex flex-col ">
      <div><NavBar /></div>
      <div className=" flex-1 relative grid gap-2 grid-cols-12 pt-1 ">
        <div className={` col-span-4 max-sm:col-span-12 py-2 shadow-2xl transition-all duration-300 ease-in-out     overflow-y-auto ${ (isChatOpen ? ' max-sm:absolute max-sm:h-full max-sm:z-0 max-sm:opacity-0 max-sm:pointer-events-none max-sm:w-full' : 'opacity-100 z-10')}`}><Contacts /></div>
        <div className={`col-span-8 max-sm:col-span-12 py-1 shadow-2xs overflow-y-auto flex flex-col transition-all duration-300 ease-in-out `}>{isChatOpen ? <ChatBox /> : (<p className="my-auto mx-auto text-lg transition-all duration-300 ease-in-out" >~select chat to start conversation and send messages</p>)}</div>

      </div>

    </div>
  )
}

export default Home
