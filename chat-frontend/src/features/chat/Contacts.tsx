import { useAppDispatch } from "../../app/hooks.ts";
import { openChat } from "../ui/UiSlice.ts";
import { DUMMY_CONVERSATIONS } from "../../mockData/mockData.ts";
import  { CiSearch } from "react-icons/ci";
const Contacts = () => {
  const dispatch = useAppDispatch();
  return (
    <div
      onClick={() => dispatch(openChat())}
      className="Chat-box  flex flex-col gap-2 px-1"
    >
      <div className="flex relative items-center justify-center w-full min-w-0 ">
        <input
          type="search"
          placeholder="Search chat or person"
          className="chat-input  w-full min-w-0 "
        />
        <CiSearch className="absolute right-4"/>
      </div>

      {DUMMY_CONVERSATIONS &&
        DUMMY_CONVERSATIONS.map((contact) => {
          return (
            <>
              <div className="chat-bullet text-black">
                <div className="contact-profile-pic ">
                  <img src={contact.participantImage} alt="" />
                </div>
                <div>
                  <h2 className="font-medium ">{contact.participantName}</h2>
                  <p className="text-sm">
                    {contact.isOnline ? "Online" : `${contact.lastMessage}`}
                  </p>
                </div>
              </div>
            </>
          );
        })}
    </div>
  );
};

export default Contacts;
