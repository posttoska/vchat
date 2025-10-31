
import {useState} from 'react';
import Title from './Title';
import RecordMessage from './RecordMessage';
import RecordMessage2 from './RecordMessage2';
import axios from 'axios';


function Controller() {

    const [isLoading, setisLoading] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);


    const createBlobUrl = (data: any) => {
        const innerBlob = new Blob([data], { type: "audio/mpeg" });
        const url = window.URL.createObjectURL(innerBlob);
        return url;
    };

    const handleStop = async (blobUrl: string) => {
        setisLoading(true);

        // append recorded message to messages
        const myMessage = { sender: "me", blobUrl: blobUrl };
        const messagesArr = {...messages, myMessage};

        // 1st .then: convert response to a blob
        // 2nd .then: use the blob to send it to api endpoint
        // 3rd .then: handle server response

        fetch(blobUrl)
            .then( (res) => res.blob())
            .then(async (blob) => {

                // construct audio to send a file
                const formData = new FormData();
                formData.append("file", blob, "myFile.wav");

                // send form data to api endpoint
                await axios.post("http://127.0.0.1:8000/post-audio",
                      formData,
                      {headers: {"Content-Type": "audio.mpeg"},
                      responseType: "arraybuffer",
                })
                .then((res: any) => {
                    // get responsed blob
                    const blob = res.data;
                    const audio = new Audio();
                    // create audio from that
                    audio.src = createBlobUrl(blob);

                    // append model's answer to message context 
                    const modelMessage = { sender: "model", blobUrl: audio.src };
                    messagesArr.push(modelMessage);

                    // 
                    setMessages(messagesArr);

                })
                .catch((err) => {});
            

            });

        setisLoading(false);
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