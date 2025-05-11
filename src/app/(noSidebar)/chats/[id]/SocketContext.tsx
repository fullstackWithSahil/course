"use client";
import {io, Socket} from "socket.io-client";
import { createContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";

export const SocketContext = createContext<Socket|null>(null);

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket|null>(null);
    const {id} = useParams();
    useEffect(()=>{
        const _socket = io("http://localhost:8080");
        setSocket(_socket);
        _socket.emit('joinRoom',id);
        return()=>{
            _socket.disconnect();
        }
    },[id])
    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}