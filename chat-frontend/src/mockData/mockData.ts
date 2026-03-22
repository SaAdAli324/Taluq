import type {Conversation} from "../types/chat";

export const DUMMY_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    participantName: "Zain Ahmed",
    participantImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zain",
    isOnline: true,
    lastMessage: "The project looks great, bhai!",
    messages: [
      { id: "m1", senderid: "me", text: "Assalam o Alaikum! How is the UI looking?", timestamp: "2026-03-05T10:00:00Z", status: "read" },
      { id: "m2", senderid: "1", text: "Walaikum Assalam! The green theme is fire 🔥", timestamp: "2026-03-05T10:02:00Z", status: "read" },
      { id: "m3", senderid: "1", text: "The project looks great, bhai!", timestamp: "2026-03-05T10:05:00Z", status: "read" },
      { id: "m1", senderid: "me", text: "ja payn yakka kam kr ", timestamp: "2026-03-05T10:00:00Z", status: "read" },
   
    ]
  },
  {
    id: "2",
    participantName: "Sara Khan",
    participantImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    isOnline: false,
    lastMessage: "Did you fix the Redux bug?",
    messages: [
      { id: "m4", senderid: "2", text: "Hey, are you free for a meeting?", timestamp: "2026-03-05T09:00:00Z", status: "read" },
      { id: "m5", senderid: "me", text: "Yes, just finishing the routing logic.", timestamp: "2026-03-05T09:15:00Z", status: "delivered" },
      { id: "m6", senderid: "2", text: "Nice! Did you fix the Redux bug?", timestamp: "2026-03-05T09:20:00Z", status: "sent" },
    ]
  },
  {
    id: "3",
    participantName: "Taluq Official",
    participantImage: "https://api.dicebear.com/7.x/identicon/svg?seed=Taluq",
    isOnline: true,
    lastMessage: "Welcome to Taluq! Connect with the world.",
    messages: [
      { id: "m7", senderid: "3", text: "Welcome to Taluq! Connect with the world.", timestamp: "2026-03-05T08:00:00Z", status: "read" },
    ]
  }
];