import { useState, useRef  } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

type Props = {
    handleStop: any;
};

function RecordMessage({ handleStop }: Props) {

    // wait stable press
    const TIME_TO_WAIT = 500;
    const isUpped = useRef<boolean>(false)

    // helper function to set isUpped
    function setIsUpped(ref: React.MutableRefObject<boolean>, valueToSet: boolean) {
        // set value
        ref.current = valueToSet;
    };
    
    // long click handle when start recording
    function handleOnMouseDown(start: () => void) {
        // set flag to upped
        setIsUpped(isUpped, true);


        // wait 500 ms anyway
        setTimeout(() => {
            // check if button was untouched
            if (isUpped.current) {
                // start recoeding
                start();
                // set flag to lower
                setIsUpped(isUpped, false);
                console.log("start recording...");
            };
        
        // set timeout to 500 ms
        } , TIME_TO_WAIT)

        
    };

    // long click handle when stop recording
    function handleOnMouseUp (stop: () => void) {
        // if the flag was lowered (recording started) then stop it
        if (!isUpped.current) {
            stop();
            console.log("stop recording...");
        }

        // set flag to lowered anyway
        setIsUpped(isUpped, false);
    };

    

    return (
        // record message with react functions
        <ReactMediaRecorder 
            audio 
            onStop={handleStop} 
            render={({ status, startRecording, stopRecording }) => (
                
                // recording icon and message
                <div className="mt-2">
                    <button
                        onMouseDown={() => handleOnMouseDown(startRecording)} 
                        onMouseUp={() => handleOnMouseUp(stopRecording)}
                        className="bg-white p-4 rounded-full"
                    >
                        ICON
                    </button>
                    <p className="mt-2 text-white font-light">
                        {
                            status === "recording" ? "запись" : "нажмите и удерживайте"
                        }
                        </p>
                </div> 
            )}
        />
    );
}

export default RecordMessage