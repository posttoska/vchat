import {useState} from 'react';
import Title from './Title';
import RecordMessage from './RecordMessage';
import RecordMessage2 from './RecordMessage2';
import axios from 'axios';


function Controller() {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

    const createBlobUrl = (data: any) => {
        const innerBlob = new Blob([data], { type: "audio/mpeg" });
        const url = window.URL.createObjectURL(innerBlob);
        return url;
    };

    // pause audio if record started
    const handleStart = () => {
        if (currentAudio) {

            currentAudio.pause();
            currentAudio.currentTime = 0;

        };
    };

    // send then get messages and play audio
    const handleStop = async (blobUrlLocal: string) => {
        setIsLoading(true);

        // append recorded message to messages
        const myMessage = { sender: "me", blobUrl: blobUrlLocal };
        const messagesArr = {...messages, myMessage};

        // 1st .then: convert request to a blob
        // 2nd .then: use the blob to send it to api endpoint
        // 3rd .then: handle server response

        fetch(blobUrlLocal)
            .then( (res) => res.blob())
            .then(async (blobReq) => {

                // construct audio to send a file
                const formData = new FormData();
                formData.append("file", blobReq, "myFile.wav");

                // send form data to api endpoint
                await axios.post("http://127.0.0.1:8000/post-audio",
                      formData,
                      {headers: {"Content-Type": "audio.mpeg"},
                      responseType: "arraybuffer",
                })
                .then((res: any) => {
                    // get responsed blob
                    const blobRes = res.data;
                    const audio = new Audio();
                    // create audio from that
                    audio.src = createBlobUrl(blobRes);

                    // append model's answer to message array
                    const modelMessage = { sender: "model", blobUrl: audio.src };
                    messagesArr.push(modelMessage);

                    // remember convertation globally
                    setMessages(messagesArr);

                    // lower the flag and play audio
                    setIsLoading(false);
                    audio.play();

                })
                .catch((err) => {
                    console.error(err.message);
                    setIsLoading(false);
                });
            });
    };

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

                {/* recorder */}
                <div className='fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r from-red-500 to-violet-600'>
                    <div className='flex justify-center items-center w-full'>
                        <RecordMessage handleStart={handleStart} handleStop={handleStop}/>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Controller;