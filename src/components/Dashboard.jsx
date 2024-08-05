import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { io } from "socket.io-client";
import AxiosService from "../common/ApiService";

function Dashboard() {
  const [userData, setUserData] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [text, setText] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({ messages: [] });
  const messageRef = useRef(null);

  const [currentReceiver, setCurrentReceiver] = useState(() => {
    const storedReceiver = sessionStorage.getItem("currentReceiver");
    return storedReceiver ? JSON.parse(storedReceiver) : {};
  });

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_API_URL}`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      socket.on("getUsers", (users) => {
        const uniqueUsers = new Map();
        users.forEach((user) => {
          const key = `${user.socketId}-${user.userId}`;
          if (!uniqueUsers.has(key)) {
            uniqueUsers.set(key, user);
          }
        });
        const uniqueUserArray = Array.from(uniqueUsers.values());
        setActiveUsers(uniqueUserArray);
      });

      return () => socket.off("getUsers");
    }
  }, [socket]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await AxiosService.get(`/user/getconvo/${userData._id}`);
        if (res.status === 200 && Array.isArray(res.data)) {
          setConversations(res.data);
        } else {
          console.warn("Unexpected data format:", res.data);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    if (userData._id) {
      fetchConversations();
    }
  }, [userData._id]);

  useEffect(() => {
    if (socket) {
      socket.emit("addUser", userData);
      socket.on("getMessage", (data) => {
        setMessages((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              user: data.user,
              message: data.message,
              senderName: data.senderName,
              receiverName: data.receiverName,
            },
          ],
        }));
      });

      return () => socket.off("getMessage");
    }
  }, [socket, userData]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.messages]);

  const sendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!messages?.conversationId) {
        console.error("Conversation ID is not defined");
        return;
      }

      const messageContent = text || `Hi ${currentReceiver?.name || "there"}`;
      setText("");

      const messageData = {
        senderId: userData._id,
        senderName: userData.name,
        receiverId: currentReceiver?.userId?._id,
        receiverName: currentReceiver?.userId?.name,
        message: messageContent,
        conversationId: messages?.conversationId,
      };

      socket?.emit("sendMessage", messageData);

      try {
        const res = await AxiosService.post("/user/sendMessage", messageData);

        if (res.status === 200) {
          const newMessage = res.data.messages;

          setMessages((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                sender: {
                  id: newMessage.sender._id,
                  name: newMessage.sender.name,
                },
                receiver: {
                  id: newMessage.receiver._id,
                  name: newMessage.receiver.name,
                },
                message: newMessage.message,
                createdAt: newMessage.createdAt,
              },
            ],
          }));
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [text, messages, socket, userData, currentReceiver]
  );

  const fetchMessages = useCallback(async (conversationId) => {
    try {
      const res = await AxiosService.get(`/user/getMessage/${conversationId}`);
      if (res.status === 200) {
        setMessages({
          messages: res.data,
          conversationId,
        });
      } else {
        console.error("Failed to fetch messages. Status:", res.status);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  const startConvo = useCallback(
    async (receiverId, receiver) => {
      setCurrentReceiver(receiver);
      sessionStorage.setItem("currentReceiver", JSON.stringify(receiver));
      try {
        const res = await AxiosService.post("/user/startconvo", {
          senderId: userData._id,
          receiverId,
        });

        if (res.status === 200) {
          const conversationId = res.data.conversationId;
          if (conversationId) {
            await fetchMessages(conversationId);
          } else {
            const initialMessage = `Hi ${receiver.userId.name}`;
            await AxiosService.post("/user/sendMessage", {
              conversationId: res.data.conversationId,
              senderId: userData._id,
              message: initialMessage,
              receiverId: receiver.userId._id,
            });

            setMessages({
              messages: [],
              receiver,
              conversationId: res.data.conversationId,
            });
          }
        } else {
          console.error("Failed to start conversation. Status:", res.status);
        }
      } catch (error) {
        console.error("Error starting conversation:", error);
      }
    },
    [userData, fetchMessages]
  );

  console.log("conversations", conversations);
  const filteredActiveUsers = useMemo(() => activeUsers.filter((e) => e.userId._id !== userData._id), [activeUsers, userData]);

  const filteredConversations = useMemo(() => conversations.filter(({ userId }) => userId?._id !== userData._id), [conversations, userData]);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-3 vh-100 overflow-auto" style={{ backgroundColor: "#e3e8f8" }}>
          <div className="d-flex align-items-center my-4 mx-4">
            <div className="ms-3">
              <h2 style={{ color: "#203562" }}>
                {" "}
                <strong>{userData.name}</strong>
              </h2>
              <p className="small">My Account</p>
            </div>
          </div>
          <hr />
          <div className="mx-4 mt-4">
            <h5>
              <strong>Messages</strong>
            </h5>
            <div>
              {filteredConversations.length > 0 ? (
                filteredConversations.map((e) => {
                  
                  return (
                    <div className="d-flex align-items-center py-3 border-bottom" key={e.conversationId}>
                      <div className="d-flex align-items-center cursor-pointer" onClick={() => startConvo(e.userId?._id, e)}>
                        <div>
                          <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="ms-3">
                          <h6>{e.userId?.name}</h6>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center mt-5">No Conversations</div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="col-6 vh-100 bg-light d-flex flex-column align-items-center">
          {currentReceiver && (
            <div className="my-4 py-2 px-4 d-flex align-items-center w-75">
              <div className="cursor-pointer">
                <i className="bi bi-person-circle"></i>
              </div>
              <div className="ms-3 me-auto">
                <h6>{currentReceiver.userId?.name}</h6>
                <p className="small text-muted">{currentReceiver.userId?.email}</p>
              </div>
            </div>
          )}

          <div className="flex-grow-1 w-100 overflow-auto shadow-sm">
            {messages?.messages?.length > 0 ? (
              messages.messages.map((e) => {
                const isSender = e.sender?.id === userData._id;
                return (
                  <div className={`p-4 ${isSender ? "text-end" : "text-start"}`} key={e._id || e.message}>
                    <div className={`max-w-50 rounded-3 p-3 mb-3 ${isSender ? "senderColor text-white align-self-end" : "receiverColor"}`}>
                      <div>
                        <strong>{isSender ? userData.name : e.sender?.name}</strong>
                      </div>
                      <div className={`${isSender ? "text-end" : "text-start"}`}>{e.message}</div>
                    </div>
                    <div ref={messageRef}></div>
                  </div>
                );
              })
            ) : (
              <div className="text-center mt-5">No Messages or No Conversation Selected</div>
            )}
          </div>

          {currentReceiver && (
            <div className="p-4 w-100 d-flex align-items-center">
              <input type="text" placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} className="form-control rounded-pill me-3" />
              <button className="btn btn-light rounded-circle" onClick={sendMessage} disabled={!text}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-send"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2c3e50"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                  <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* People List */}
        <div className="col-3 vh-100 px-4 py-4 overflow-auto" style={{ backgroundColor: "#e3e8f8" }}>
          <h5>
            <strong>Active Users</strong>
          </h5>
          <div>
            {filteredActiveUsers.length > 0 ? (
              filteredActiveUsers.map((e) => (
                <div className="d-flex align-items-center py-3 border-bottom" key={e.socketId}>
                  <div className="d-flex align-items-center cursor-pointer" onClick={() => startConvo(e.userId._id, e)}>
                    <div>
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <div className="ms-3">
                      <h6>{e.userId.name}</h6>
                      <p className="small text-muted">{e.userId.email}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-5">No Active Users</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
