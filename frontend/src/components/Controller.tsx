import {useState} from 'react';
import Title from './Title';
import RecordMessage from './RecordMessage';
import RecordMessage2 from './RecordMessage2';


function Controller() {

    const [isLoading, setisLoading] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    const [blob, setBlob] = useState("");

    const createBlobUrl = (data: any) => {

    };

    const handleStop = async (blobUrl: string) => {
        console.log(blobUrl);
        setBlob(blobUrl);
    }

    return (
        
        <div>
            <div className='h-screen overflow-y-hidden'>

                {/* title */}
                <Title setMessages={setMessages} />

                {/* image */}
                <div className='flex items-center justify-center p-2'>
                    <img
                    className="w-24 h-24 rounded-full object-cover shadow"
                    alt="Chat Icon"
                    src="/vladislaviy.png"
                    />
                </div>

                <audio src={blob} controls />

                {/* recorder */}
                <div className='fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r from-red-500 to-violet-600'>
                    <div className='flex justify-center items-center w-full'>
                        <RecordMessage handleStop={handleStop}/>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Controller