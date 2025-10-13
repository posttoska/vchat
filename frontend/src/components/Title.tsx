import {useState} from 'react';
import axios from 'axios';

// set any values with this setter
type Props = {
    setMessages: any;
}

function Title({ setMessages }: Props) {

    const [isResetting, setIsResetting] = useState(false);

    // reset the conversation function
    const resetConversation = async () => {

        // start of convertation deleting
        setIsResetting(true);

        // reset all conversations
        await axios.get("http://127.0.0.1:8000/delete_conversations").then((res) => {
            // if response is successful then delete messages (frontend)
            if (res.status == 200) {
                setMessages([]);
            // error handeling (server case)
            } else {
                console.error("there was backend error while deleting convertations");
            }
        // error handeling (frontend case)
        }).catch((err) => {
            console.error(err.message);
        });

        // finish of convertation deleting
        setIsResetting(false);
    };

    return (
        //  reset convertation with button press
        <div className='flex justify-between items-center w-full p4 bg-blue-900 text-white font-bold shadow'>
            
            <div className='p-2'>Владиславий Панкорезов Чат</div>
            
            <button 
                onClick={resetConversation}
                className={
                    "p-3 hover:bg-gray-800 rounded transition-all duration-300 text-blue-300 hover:text-pink-500 " +
                    (isResetting && "animate-pulse")
                }
            >
                <svg xmlns="http://www.w3.org/2000/svg" 
                fill="none" viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="size-6">

                <path strokeLinecap="round" 
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>

        </div>
    )
}

export default Title