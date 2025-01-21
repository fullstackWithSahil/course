import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ChatProvider from '../ChatContext'
import NewMessages from '../NewMessages'
import Chats from '../Chats'

export default function ChatInterface() {
    return (
        <ChatProvider>
            <Card className="w-full m-0 rounded-none">
                <CardHeader>
                    <CardTitle>Chat Room</CardTitle>
                </CardHeader>
                <CardContent>
                    <Chats/>
                </CardContent>
                <CardFooter>
                    <NewMessages/>
                </CardFooter>
            </Card>
        </ChatProvider>
    )
}