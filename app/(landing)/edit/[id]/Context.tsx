"use client";
import { Dispatch, ReactNode,createContext, useContext, useReducer } from "react";

// context.ts
export type Video = {
  id: string;
  title: string;
  description: string;
  url:string;
  thumbnail:string;
  lesson: number;
};

export type Module = {
  id: string;
  name: string;
  videos: Video[];
};

export type State = Module[];

export type Action =
  | { type: "ADD_MODULE"; payload: { id: string; name: string } }
  | { type: "ADD_VIDEO"; payload: { moduleId: string; video: Video } }
  | { type: "UPDATE_MODULE_NAME"; payload: { id: string; name: string } }
  | {
      type: "UPDATE_VIDEO_DETAILS";
      payload: { moduleId: string; video: Video };
    }
  |{ type: "CHANGE_VIDEO_TITLE"; payload: { id: string; title: string} }
  |{ type: "CHANGE_VIDEO_DESCRIPTION"; payload: { id: string; description: string} }
  |{ type: "CHANGE_VIDEO_LESSON"; payload: { id: string; lesson: number} }
  |{ type: "CHANGE_VIDEO_URL"; payload: { id: string; url: string} }
  |{ type: "CHANGE_VIDEO_THUMBNAIL"; payload: { id: string; thumbnail: string} }


export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_MODULE":
      return [
        ...state,
        { id: action.payload.id, name: action.payload.name, videos: [] },
      ];
    case "ADD_VIDEO":
      return state.map((module) =>
        module.id === action.payload.moduleId
          ? { ...module, videos: [...module.videos, action.payload.video] }
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
      case "CHANGE_VIDEO_TITLE":
        return state.map((module) => ({
          ...module,
          videos: module.videos.map((video) =>
            video.id === action.payload.id
              ? { ...video, title: action.payload.title }
              : video
          ),
        }));
      case "CHANGE_VIDEO_DESCRIPTION":
        return state.map((module) => ({
          ...module,
          videos: module.videos.map((video) =>
            video.id === action.payload.id
              ? { ...video, description: action.payload.description }
              : video
          ),
        }));
      case "CHANGE_VIDEO_LESSON":
        return state.map((module) => ({
          ...module,
          videos: module.videos.map((video) =>
            video.id === action.payload.id
              ? { ...video, lesson: action.payload.lesson}
              : video
          ),
        }));
    default:
      return state;
  }
}

const Context = createContext<{state:State,dispatch:Dispatch<Action>}|null>(null);

export default function ContextWrapper({children,initialState}:{children:ReactNode,initialState:State}) {
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