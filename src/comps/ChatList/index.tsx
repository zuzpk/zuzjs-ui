import { ChatBubble } from ".."
import { BubbleProps } from "../ChatBubble/types"
import List from "../List"

type ChatMessage = BubbleProps

const ChatList : React.FC<{
    messages: ChatMessage[]
}> = ({ messages }) => {
    return <List 
        items={messages.map((m, i) => <ChatBubble 
                key={m.id || i}
                {...m} />)} />
}

export default ChatList