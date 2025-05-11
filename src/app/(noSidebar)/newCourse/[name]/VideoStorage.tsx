//VideoStorage.tsx
"use client";

import { createContext, ReactNode, useReducer, useContext, Dispatch } from "react";

type VideoType = {
    key: string;
    videoFile: File;
}

type StateType = {
    uploading: boolean;
    videos: VideoType[];
}

// Define action types
type ActionType = 
    | { type: "SET_UPLOADING"; payload: boolean }
    | { type: "ADD_VIDEO"; payload: VideoType }
    | { type: "REMOVE_VIDEO"; payload: string }
    | { type: "UPDATE_VIDEO"; payload: VideoType };

const initialState: StateType = {
    uploading: false,
    videos: []
}

// Create context with proper types
type VideoContextType = {
    state: StateType;
    dispatch: Dispatch<ActionType>;
}

const VideoStorage = createContext<VideoContextType>({
    state: initialState,
    dispatch: () => null
});

// Use the context
export const useVideoStorage = () => useContext(VideoStorage);

function reducer(state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case "SET_UPLOADING":
            return {
                ...state,
                uploading: action.payload
            };
        case "ADD_VIDEO":
            return {
                ...state,
                videos: [...state.videos, action.payload]
            };
        case "REMOVE_VIDEO":
            return {
                ...state,
                videos: state.videos.filter(video => video.key !== action.payload)
            };
        case "UPDATE_VIDEO":
            return {
                ...state,
                videos: state.videos.map(video => 
                    video.key === action.payload.key ? action.payload : video
                )
            };
        default:
            return state;
    }
}

export default function VideoStorageProvider({children}: {children: ReactNode}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    return (
        <VideoStorage.Provider value={{state, dispatch}}>
            {children}
        </VideoStorage.Provider>
    );
}

// Helper functions to use with the context
export const videoActions = {
    setUploading: (isUploading: boolean): ActionType => ({
        type: "SET_UPLOADING",
        payload: isUploading
    }),
    
    addVideo: (video: VideoType): ActionType => ({
        type: "ADD_VIDEO",
        payload: video
    }),
    
    removeVideo: (key: string): ActionType => ({
        type: "REMOVE_VIDEO",
        payload: key
    }),
    
    updateVideo: (video: VideoType): ActionType => ({
        type: "UPDATE_VIDEO",
        payload: video
    })
};