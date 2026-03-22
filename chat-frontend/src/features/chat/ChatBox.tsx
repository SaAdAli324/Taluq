
import { closeChat } from '../ui/UiSlice.ts';
import { useAppDispatch } from '../../app/hooks.ts';
import { DUMMY_CONVERSATIONS } from '../../mockData/mockData.ts';
const ChatBox = () => {
    console.log(DUMMY_CONVERSATIONS);

    const dispatch = useAppDispatch()
    return (
        <div className='flex bg-white h-full flex-col '>
            <div className="Chat-box shadow-xl px-2  flex w-full">
                <span onClick={() => dispatch(closeChat())}>Back</span>
                <div className=" w-full flex items-center gap-4 p-2">
                    <div className="contact-profile-pic rounded-full border min-w-14 min-h-14 overflow-hidden">
                        <img src={DUMMY_CONVERSATIONS[0].participantImage} className='overflow-hidden' alt="" /></div>
                    <div>
                        <h2 className='font-medium text-lg'>{DUMMY_CONVERSATIONS[0].participantName}</h2>
                        <p className="text-sm ">{DUMMY_CONVERSATIONS[0].isOnline ? "Online" : "Offline"}</p>
                    </div>
                </div>
            </div>
            <div className='messageArea flex-1  px-2 flex flex-col gap-4 py-8'>
                {DUMMY_CONVERSATIONS && DUMMY_CONVERSATIONS[0].messages.map((message) => {
                    return (<>
                        {message.senderid !== "me" ? (<p className='arrivedMessages '>{message.text}</p>) : (<p className='deliveredMessages'> {message.text} </p>)}


                    </>
                    )
                })}
            </div>
            
            <div className='typeArea'>
                <input type="text" placeholder='Type a message' className=' ' />

            </div>
        </div>
    )
}

export default ChatBox
