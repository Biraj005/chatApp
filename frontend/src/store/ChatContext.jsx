import { createContext} from "react";
export const ChatContext = createContext();


export const ChatProvider = (props) => {

   
    const value = {
    


    }

    return <ChatContext.Provider value={value}>
        {props.children}
    </ChatContext.Provider>
}