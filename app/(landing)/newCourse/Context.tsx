"use client";
import { Dispatch, ReactNode,createContext, useContext, useReducer } from "react";

// context.ts
export type Video = {
  id: string;
  title: string;
  description: string;
};

export type Module = {
  id: string;
  name: string;
  videos: Video[];
};

export type State = Module[];

export type Action =
  | { type: "ADD_MODULE"; payload: { id: string; name: string } }
  | { type: "REMOVE_MODULE"; payload: { id: string } }
  | { type: "ADD_VIDEO"; payload: { moduleId: string; video: Video } }
  | { type: "REMOVE_VIDEO"; payload: { moduleId: string; videoId: string } }
  | { type: "UPDATE_MODULE_NAME"; payload: { id: string; name: string } }
  | {
      type: "UPDATE_VIDEO_DETAILS";
      payload: { moduleId: string; video: Video };
    };

export const initialState: State = [];

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_MODULE":
      return [
        ...state,
        { id: action.payload.id, name: action.payload.name, videos: [] },
      ];
    case "REMOVE_MODULE":
      return state.filter((module) => module.id !== action.payload.id);
    case "ADD_VIDEO":
      return state.map((module) =>
        module.id === action.payload.moduleId
          ? { ...module, videos: [...module.videos, action.payload.video] }
          : module
      );
    case "REMOVE_VIDEO":
      return state.map((module) =>
        module.id === action.payload.moduleId
          ? {
              ...module,
              videos: module.videos.filter(
                (video) => video.id !== action.payload.videoId
              ),
            }
          : module
      );
    case "UPDATE_MODULE_NAME":
      return state.map((module) =>
        module.id === action.payload.id
          ? { ...module, name: action.payload.name }
          : module
      );
    case "UPDATE_VIDEO_DETAILS":
      return state.map((module) =>
        module.id === action.payload.moduleId
          ? {
              ...module,
              videos: module.videos.map((video) =>
                video.id === action.payload.video.id
                  ? action.payload.video
                  : video
              ),
            }
          : module
      );
    default:
      return state;
  }
}

const Context = createContext<{state:State,dispatch:Dispatch<Action>}|null>(null);

export default function ContextWrapper({children}:{children:ReactNode}){
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <Context.Provider value={{state,dispatch}}>
            {children}
        </Context.Provider>
    )
}

export function useCourseContext(){
    const data = useContext(Context);
    if (!data){
        throw new Error("Course context is empty");
    }
    return data;
}