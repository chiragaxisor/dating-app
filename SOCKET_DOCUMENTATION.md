# Socket.IO Implementation Guide - Dating App

This guide is for the iOS/App developers to integrate real-time chat features.

---

## 1. Connection Setup

### Connection URL
- **Development**: `http://34.231.120.162:3040` (Replace with your local server IP)
- **Production**: `https://api.yourdomain.com`
- **Path**: `/socket.io/` (Default)

### Connection Workflow
1.  **Connect** with JWT token in `auth`.
2.  **Listen** for the `connect` event.
3.  **Emit** `join room` immediately after connection success.
4.  **Listen** for incoming events (`private message`, `last message`, etc.).

---

## 2. Authentication (Required)

You MUST pass the JWT Access Token in the connection configuration.

**iOS (Socket.IO Client Swift) Example**:
```swift
let socketURL = URL(string: "http://34.231.120.162:3040")! // Use your server IP
let manager = SocketManager(socketURL: socketURL, config: [
    .log(true),
    .compress,
    .extraHeaders(["Authorization": "Bearer YOUR_TOKEN"]), // Optional but recommended
    .auth(["token": "YOUR_JWT_ACCESS_TOKEN"]) // <--- EXTREMELY IMPORTANT
])
let socket = manager.defaultSocket
socket.connect()
```

---

## 3. The "Join Room" Logic (Crucial)

After the socket connects, you **MUST** call `join room`. This tells the server to route private messages to your specific device/socket.

**Emit Event**: `join room`
**Payload**: Empty object `{}` (The server identifies you by your token).

```swift
socket.on(clientEvent: .connect) { data, ack in
    print("Socket connected")
    // JOIN ROOM IMMEDIATELY
    socket.emit("join room", []) 
}
```

---

## 4. Full Event Reference (Emit vs Listen)

### A. Events to EMIT (Client -> Server)

| Event Name | When to use? | Payload Example |
| :--- | :--- | :--- |
| `join room` | **Mandatory** right after connection. | `{}` |
| `private message` | When sending a new message. | `{"chatId": 1, "senderId": 10, "message": "Hi", "messageType": "TEXT"}` |
| `read message` | When the user opens/views a message. | `{"messageId": 101, "senderId": 11, "receiverId": 10}` |
| `status online` | To check if a specific user is online. | `{"receiverId": 20, "senderId": 10}` |
| `active users` | To get a list of current online friends. | `{"authUserId": 10}` |
| `join group` | To join a group chat room. | `{"groupId": 5}` |
| `group message` | When sending a message to a group. | `{"groupId": 5, "senderId": 10, "message": "Hi all", "messageType": "text"}` |

### B. Events to LISTEN for (Server -> Client)

| Event Name | What does it mean? | Response Data |
| :--- | :--- | :--- |
| `private message` | You received a new message or your message was sent. | Chat message object (includes `messageId`, `createdAt`, etc.) |
| `last message` | Triggered for ANY message update. Use this to update your **Chat List/Inbox** UI. | Updated Chat/Conversation object with `unReadMessageCount`. |
| `status online` | A user's online status changed (IsOnline: 1 or 0). | `{"isOnline": 1, "senderId": "20"}` |
| `read message` | The other person just read your message. | The message object with `isSeen: true`. |
| `active users` | The result of your `active users` request. | Array of user objects currently online. |
| `group message` | Received when someone sends a message in a group you've joined. | Group message object (includes `id`, `message`, `sender`, etc.) |

---

## 5. Message Data Models

### Message Object (`private message` response)
```json
{
  "chatId": 1,
  "senderId": 10,
  "receiverId": 20,
  "message": "Hello!",
  "messageType": "text", // "text", "images", or "sticker"
  "messageId": 999,
  "createdAt": 1706532000, // Unix Timestamp
  "isSeen": false
}
```

### Group Message Object (`group message` response)
```json
{
  "id": 501,
  "message": "Hey everyone!",
  "messageType": "text", // "text", "images", or "sticker"
  "groupId": 5,
  "sender": {
    "id": 10,
    "name": "Alex",
    "profilePic": "..."
  },
  "createdAt": 1706532000
}
```

### Chat Object (`last message` response)
*Use this for the Inbox/Conversation list screen.*
```json
{
  "id": 1,
  "lastMessage": "Hello!",
  "messageType": "TEXT",
  "unReadMessageCount": 2,
  "lastMessageAt": 1706532000,
  "receiverUser": {
    "id": 20,
    "name": "Alex",
    "profilePic": "https://...",
    "isOnline": true
  }
}
```

---

## 6. Group Chat System

The app automatically joins users into gender-based groups (e.g., "Male Group", "Female Group") upon registration.

### Joining a Group Room
You must explicitly join a group room to receive messages from it.
**Emit**: `join group`
**Payload**: `{"groupId": number}`

### Sending a Group Message
**Emit**: `group message`
**Payload**:
```json
{
  "groupId": 1,
  "senderId": 10,
  "message": "Hello everyone!",
  "messageType": "text" // Use "sticker" for stickers/gifts
}
```

---

## 7. Stickers & Gifts

Stickers and Gifts are handled as a specific `messageType`.

1. **Fetch Stickers**: Use the API `GET /api/v1/stickers/list` to get the list of available stickers/gifts and their URLs.
2. **Sending**: When a user selects a sticker, send it using `private message` or `group message` with:
   - `messageType`: `"sticker"`
   - `message`: The full URL of the sticker.

---

## 8. Pro Tips for Developers

1.  **Reconnection**: On reconnection, you MUST emit `join room` again.
2.  **Image Messages**: For `IMAGE` type, the `message` field will contain the full URL to the image.
3.  **Online Indicators**: Don't poll the server. Listen to `status online` to update green/grey dots in real-time.
4.  **Unix Timestamps**: All dates are sent as Unix Timestamps (seconds) for easy conversion in Swift/Kotlin.
