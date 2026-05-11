import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { socket } from "../../utils/socket.ts";
import { useAppSelector } from "../../app/hooks.ts";
import api from "../../api.ts"
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import { IoCheckmarkOutline } from "react-icons/io5";
import ConfirmModel from "../../components/ui/ConfirmModel.tsx";
import { setContact } from "../../app/store/slices/chatSlice.ts";
import { AiOutlineLoading } from "react-icons/ai"
import { Loader } from "../../cutomHooks/Loader.tsx";
import { model } from "../../cutomHooks/openModel.tsx";
import UpdateModel from "../../components/ui/UpdataModel.tsx";
const ChatBox = () => {
  const contactInfo = useAppSelector((state) => state.contact.contactInfo)
  const user = useSelector((state: any) => state.protectRoutes.user)
  const [messages, setMessages] = useState<any[]>([])
  const [openOptions, setOpenOptions] = useState<string | null>(null)
         
  const [isOnline, setIsOnline] = useState<boolean>(false)
  const { isLoading, startLoading, stopLoading } = Loader(false)
  const { openModel, closeModel, activeModel } = model(null)
  const [openUpdateModel, setOpenUpdateModel] = useState<string | null>(null)
  const [currentMessage, setCurrentMessage] = useState<string | null>(null)
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const olderMessages = useRef<HTMLDivElement>(null)
  const allMessages = []
  const scrollToBottom = (isSmooth: boolean) => {
    chatBoxRef.current?.scrollIntoView({
      behavior: isSmooth ? "smooth" : "auto"
    });
  };
  useLayoutEffect(() => {

    if (!isLoading && messages.length > 0) {
      scrollToBottom(false);
    }
  }, [isLoading]);


  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(true);
    }
  }, [messages.length]);
  useEffect(() => {
    if (!contactInfo?._id) return
    const fetchMessages = async () => {
      try {
        startLoading()
        const response = await api.get(`/api/messages/${contactInfo?.conversationId}`)
        console.log(response.data.data);
        allMessages.unshift(...response.data.data)
        setMessages(response.data.data.slice(-50))
        stopLoading()
      } catch (error) {
        console.log(error);
        stopLoading()
      }
    }
    fetchMessages()
  }, [contactInfo?.conversationId]);


  useEffect(() => {

    if (!contactInfo?._id) return

    const handleGetOnlineUsers = (userId: string[]) => {
      console.log("these are the online users", userId);
      setIsOnline(userId.includes(contactInfo?._id as string))
    }

    const handleUserJoined = (newUser: string) => {
      if (newUser === contactInfo?._id) {
        setIsOnline(true)
      }
    }

    const handleUserLeft = (leftUser: string) => {
      if (leftUser === contactInfo?._id) {
        setIsOnline(false)
      }
    }
    socket.on("get_online_users", handleGetOnlineUsers)
    socket.on("user_online", handleUserJoined)
    socket.on("user_offline", handleUserLeft)
    socket.emit("request_online_users")
    socket.on('receive_message', (data) => {
      console.log(data.message._id, "these are the recive mesage");
      setMessages((prev) => [...prev, data.message])

    });
    socket.on('delete_message', (data) => {
      setMessages((prev) => prev.map((message) => message._id === data.message._id ? { ...message, deleted: true } : message))
    })
    socket.on('update_message', (data) => {
      setMessages((prev) => prev.map(message => message._id === data.message._id ? { ...message, text: data.message.text } as string : message))
    })

    return () => {
      socket.off('receive_message')
      socket.off('delete_message')
      socket.off("get_online_users", handleGetOnlineUsers)
      socket.off("user_online", handleUserJoined)
      socket.off("user_offline", handleUserLeft)
    }
  }, [contactInfo?._id])

  const sendMessage = async (message: string) => {
    try {
      const _id = Math.random().toString()
      setMessages((prev) => [...prev, { text: message as string, createdAt: new Date().toISOString(), sender: user?._id, seen: false, __v: 0, _id: _id }])
      const response = await api.post(`/api/messages/send/${contactInfo?._id}`, { message })
      setMessages((prev) => prev.map(m => m._id === _id ? response.data.data : m))

    } catch (error) {
      console.log(error);
    }
  }

  const instantUpdate = async (messageId: string, text: string) => {
    try {
      setMessages((prev) => prev.map((m) => {
        if (m._id === messageId) m.text = text as string
        return m
      }));

      const response = await api.patch(`/api/messages/update/${messageId}/${contactInfo?._id}`, { text })
      setMessages((prev) => (prev.map(m => m._id === messageId ? response.data.data : m)))

      setOpenUpdateModel(null)


    } catch (error) {
      console.log("error while instant updating", error);

    }
  }

  const patchResource = async (messageId: string) => {
    try {
      startLoading()
      if (!messageId) {
        stopLoading()
        console.log("no message id provided");
        return
      }
      setMessages((prev) => prev.map((message) => message._id === messageId ? { ...message, deleted: true } : message))
      const response = await api.patch(`/api/messages/delete/${messageId}/${contactInfo?._id}`)
      console.log("this is resopnse ", response.data.data);
      setMessages((prev) => prev.map((message) => message._id === messageId ? response.data.data : message))
      stopLoading()
      closeModel()
      setOpenOptions(null)

    } catch (error) {
      stopLoading()
      console.log(`error in patching resource ${messageId} :`, error);

    }
  }

  const dispatch = useDispatch()
  return (
    <div className="animate-fade-in  flex transition-all duration-700 ease-in-out  h-full max-h-full flex-col px-1 pt-3 min-h-0">
      <div className="Chat-box border-b border-gray-500 px-2  flex w-full ">
        <div className="flex items-center justify-center ">
          <span className="cursor-pointer" onClick={() => dispatch(setContact(null))}><IoArrowBack className="text-lg" /></span>
        </div>
        <div className=" w-full flex items-center gap-4 p-2">
          <div className="contact-profile-pic rounded-full border min-w-14 min-h-14 overflow-hidden">
            <img
              src={contactInfo?.profilePic ? contactInfo?.profilePic : "https://img.wattpad.com/8f19b412f2223afe4288ed0904120a48b7a38ce1/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5650722d38464e2d744a515349673d3d2d3234323931353831302e313434336539633161633764383437652e6a7067?s=fit&w=720&h=720"}
              className="overflow-hidden"
              alt=""
            />
          </div>
          <div>
            <h2 className="font-medium text-lg">
              {contactInfo?.name}
            </h2>
            <p className={`text-sm ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>
      <div className="messageArea [overflow-anchor:auto]  px-2 flex flex-col flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-taluq-green min-h-0 gap-4 py-8">
        <div ref={olderMessages} className="border">{isLoading ? <AiOutlineLoading className="animate-spin mx-auto my-auto text-xl " /> : ""}</div>
        {isLoading ? <AiOutlineLoading className="animate-spin mx-auto my-auto text-xl " /> : messages?.length > 0 ? messages.map((message) => {
          const isMe = message?.sender === user?._id
          return (
            <div className="flex flex-col  h-fit"  >
              <div className={` flex items-center gap-2  group ${isMe ? "ml-auto" : "mr-auto flex-row-reverse"}`}>
                {isMe && !message.deleted ? <div className="relative"> <BsThreeDotsVertical onClick={() => setOpenOptions(message._id)} className=" cursor-pointer opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200" />
                  <div className={`absolute z-10 gap-4 py-2 w-fit h-fit transition-all ease-in-out duration-200  -right-8 -bottom-18 bg-gray-200 rounded-sm ${openOptions === message._id ? "visible opacity-100" : "invisible opacity-0"}`}>
                    <IoClose className="cursor-pointer absolute top-0 right-0" onClick={() => setOpenOptions(null)} />

                    <button onClick={() => { setOpenUpdateModel(message._id), setCurrentMessage(message.text) }} className="hover:bg-slate-100 w-full flex items-center gap-1 px-2"><MdEdit className="cursor-pointer text-lg" onClick={() => console.log("i am getting triggered")} /> edit</button>

                    <button onClick={() => { activeModel(message._id); setOpenOptions(null), console.log(openModel) }} className="hover:bg-slate-100 w-full flex items-center gap-1 px-2"><MdDeleteOutline className="cursor-pointer text-lg" /> delete</button>

                  </div>
                </div>
                  : null}<span className="text-xs opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200">{new Date(message?.createdAt).toLocaleString().split(" ")[1]}</span>
                {isMe ? message.issend || message.isEdited ? <IoCheckmarkOutline /> : <CiClock2 className="animation-rotate" /> : null

                }
                <div onClick={() => console.log(message)} className=" max-w-xs min-w-0  whitespace-pre-wrap wrap-break-word ">
                  <p
                    key={message._id}
                    className={isMe ? `deliveredMessages ${!message.deleted ? "" : "opacity-50"}` : `arrivedMessages ${!message.deleted ? "" : "opacity-50"}`}
                  >
                    {!message.deleted ? message.text : "this message has been deleted"}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500 w-fit self-center px-2 py-1  rounded-4xl bg-slate-200 text-center">{new Date(message?.createdAt).toLocaleString().split(" ")[0] === new Date(Date.now()).toLocaleString().split(" ")[0] ? "" : new Date(message?.createdAt).toLocaleString().split(" ")[0]}</span>
            </div>
          );
        }) : <div className="flex items-center justify-center h-full w-full ">~ No messages yet send a message to start</div>}
        <div className="[overflow-anchor:auto]" ref={chatBoxRef}></div>
      </div>
      <div className="typeArea">
        <input
          type="text"
          placeholder="Type a message"
          className="chat-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.currentTarget.value.trim() === "") {
                return
              }
              sendMessage(e.currentTarget.value)
              e.currentTarget.value = ""
            }
          }}
        />
      </div>
      {openModel !== null ? <ConfirmModel loading={Boolean(isLoading)} isOpen={openModel !== null} title="Delete" message={`Are you sure you want to delete this message?`} onConfirm={() => patchResource(openModel)} onCancel={() => closeModel()} /> : ""}
      {openUpdateModel !== null ? <UpdateModel isOpen={openUpdateModel !== null} currentMessage={`${currentMessage}`} message={`${currentMessage}`} onConfirm={(newValue) => {
        console.log("New value from modal:", newValue);
        if (openUpdateModel) instantUpdate(openUpdateModel, newValue);
        setOpenUpdateModel(null);
      }} onCancel={() => { setOpenUpdateModel(null) }} /> : ""}
    </div>

  );
};

export default ChatBox;
