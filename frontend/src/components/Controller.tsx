import {useState} from 'react';
import Title from './Title';


function Controller() {

    const [isLoading, setisLoading] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    const createBlobUrl = (data: any) => {

    };

    const handleStop = async () => {

    }

    return (
        
        <div>
            <div className='h-screen overflow-y-hidden'>

                <Title setMessages={setMessages} />

                <div className='flex items-center justify-center p-2'>
                    <img
                    className="w-24 h-24 rounded-full object-cover shadow"
                    alt="Chat Icon"
                    src='./vladislaviy.png'
                    />
                </div>

                <div className='flex flex-col justify-between h-full overflow-y-scroll pb-96'>
                    Placeholder
                </div>

            </div>
        </div>
    )
}

export default Controller