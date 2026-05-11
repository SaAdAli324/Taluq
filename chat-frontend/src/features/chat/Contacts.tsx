import { useAppDispatch } from "../../app/hooks.ts";
import { openChat } from "../ui/UiSlice.ts";
import { CiSearch } from "react-icons/ci";
import api from "../../api.ts";
import { useEffect, useState } from "react";
import { IoPersonAddOutline, IoClose } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { ContactDocument, searhedUserInterface } from "../../types/type.ts";
import { setContact } from "../../app/store/slices/chatSlice.ts";
import { socket } from "../../utils/socket.ts";
import ConfirmModel from "../../components/ui/ConfirmModel.tsx";
import { deleteResource } from "../../apiFunctions/crudUtils.ts";
import NavBar from "../../shared/components/NavBar.tsx";
import { useSelector } from "react-redux";
const Contacts = () => {
  const contactInfo = useSelector((state: any) => state.contact.contactInfo)
  const dispatch = useAppDispatch();
  const [contacts, setContacts] = useState<ContactDocument[]>([])
  const [searchedUser, setSearchedUser] = useState<searhedUserInterface>({
    _id: null,
    name: null,
    email: null,
    profilePic: null
  })

  const [newMessage, setNewMessage] = useState(false)
  const [openOptions, setOpenOptions] = useState<string | null>(null)
  const [openConfirmModal, setOpenConfirmModal] = useState<string | null>(null)
  const [userNameForConfirmModal, setUserNameForConfirmModal] = useState<string | null>(null)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get("/api/conversation/get")
        console.log(response.data.data);
        setContacts(response.data.data)

      } catch (error) {
        console.log(error);

      }
    }
    fetchContacts()

  }, [])

  useEffect(() => {
    socket.on("receive_message", (incomingData) => {
      if (incomingData) {
        setNewMessage(true)
      }


    })
    return () => {
      socket.off("receive_message", () => {
        setNewMessage(false)
      })
    }
  }, [])


  const searchUSER = async (_id: string) => {
    try {
      if (!_id.trim()) return
      const query: any = {
        _id
      }
      const response = await api.post("/api/search/user", query)
      console.log(response.data.data);
      setSearchedUser(response.data.data)

    } catch (error) {
      console.log(error);

    }
  }

  const addContact = async (contactId: string, savedName: string) => {
    try {
      if (!contactId || !savedName) return
      const payload = { contactId, savedName }
      const response = await api.post('/api/conversation/add', payload)
      console.log(response.data);

      setContacts(prev => [...prev, response.data.data])

    } catch (error) {
      console.log(error);

    }
  }
  const openChatBox = async (conversationId: string, contact: any) => {
    if (contactInfo?._id === contact?._id) {
      return
    }
    const payload = {
      ...contact,
      conversationId: conversationId
    }


    dispatch(setContact(payload))

  }


  return (
    <div
      className="Chat-box flex flex-col gap-2 px-1 py-3"
    >

      <div className="flex relative items-center justify-center w-full min-w-0 ">
        <input
          type="search"
          placeholder="Search by id and hit enter"
          className="chat-input  w-full min-w-0 "
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchUSER(e.currentTarget.value)
            }
          }}
          onChange={(e) => {
            if (e.target.value === "") {
              setSearchedUser({
                _id: null,
                name: null,
                email: null,
                profilePic: null
              })
            }
          }}
        />
        <CiSearch className="absolute right-8" />
      </div>
      {searchedUser.name ? <div className="  flex items-center gap-2  px-4 py-2">
        <div className="border relative w-full h-14 rounded-2xl flex items-center gap-2 px-1 hover:bg-slate-100">
          <div className="max-w-12 border max-h-12 rounded-full overflow-hidden "><img src={searchedUser.profilePic ? searchedUser.profilePic : ""} alt="" /></div>
          <h2>{searchedUser.name ? searchedUser.name : ""}</h2>
          <IoPersonAddOutline className="absolute right-4 cursor-pointer" onClick={() => addContact(searchedUser._id as string, searchedUser.name as string)} />
        </div>
      </div>
        : ""}
      <div className="">
        {contacts.length > 0 &&
          contacts.map((contact) => {
            return (
              <>
                <div key={contact._id} onClick={() => openChatBox(contact._id as string, contact.participants[0] as any)} className="chat-bullet text-black">
                  <div className="contact-profile-pic rounded-full min-w-14 min-h-14 overflow-hidden">
                    {
                      contact.participants.map((participant) => {
                        return (
                          <img
                            loading="lazy"
                            src={participant.profilePic ? participant.profilePic : "https://img.wattpad.com/8f19b412f2223afe4288ed0904120a48b7a38ce1/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5650722d38464e2d744a515349673d3d2d3234323931353831302e313434336539633161633764383437652e6a7067?s=fit&w=720&h=720"}
                            className="overflow-hidden"
                            alt=""
                          />
                        )
                      })
                    }

                  </div>
                  <div className=" w-full flex flex-col justify-between ">
                    <h2 className="font-medium ">{contact.participants[0]?.name ? contact.participants[0].name : "user"}</h2>
                    <div className=" w-full flex  gap-2 justify-between  items-center ">
                      {newMessage ? "new messages" : <p className="text-slate-500 font-mono  font-medium text-sm w-full min-w-0 max-w-xs max-h-fit min-h-fit">
                        {contact.lastMessage.text ? contact.lastMessage.text?.length>20 ? contact.lastMessage.text.slice(0,20) + "..." : contact.lastMessage.text : "No message yet"}
                      </p>}
                      <div className="flex items-center  justify-center gap-2 relative min-h-8">
                        {openOptions === contact._id ? (
                          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                            <button onClick={() => (setOpenConfirmModal(contact._id as string), setOpenOptions(null), setUserNameForConfirmModal(contact?.participants[0]?.name))} className="flex cursor-pointer items-center gap-1 px-3 py-1 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-all group">
                              <MdDeleteOutline className="text-lg  group-hover:scale-110 transition-transform" />
                              <span>Delete</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenOptions(null);
                              }}
                              className="p-1 hover:bg-slate-100 cursor-pointer rounded-full transition-colors text-slate-500"
                              title="Cancel"
                            >
                              <IoClose className="text-xl" />
                            </button>
                          </div>
                        ) : (
                          <>
                            {contact.lastMessage ? <p className="text-xs text-slate-500 min-w-fit ">{new Date(contact.lastMessage.createdAt).toLocaleTimeString()}</p> : null}
                            <span
                              className="text-lg flex items-center justify-center cursor-pointer hover:bg-slate-100 rounded-full w-8 h-8 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenOptions(contact._id);
                              }}
                            >
                              <BsThreeDotsVertical className="text-slate-500" />
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </>
            );
          })}

      </div>
      {openConfirmModal !== null ? <ConfirmModel isOpen={openConfirmModal !== null} title="Delete" message={`Are you sure you want to delete conversation with ${userNameForConfirmModal ? userNameForConfirmModal : "this user"}?`} onConfirm={() => { deleteResource(`api/conversation/delete/${openConfirmModal}`) }} onCancel={() => { setOpenConfirmModal(null), setOpenOptions(null) }} /> : null}

    </div>
  );
};

export default Contacts;