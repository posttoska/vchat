import { useState, useRef  } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

type Props = {
    handleStop: any;
};

function RecordMessage({ handleStop }: Props) {

    // wait stable press
    const TIME_TO_WAIT = 500;
    const isUpped = useRef<boolean>(false);

    // check if recording available right now (for short recordings handling)
    const isRecAvailable = useRef<boolean>(true);
    const lastTime = useRef<number>(0);
    const MIN_RECORD_TIME = 1000;
    
    
    // long click handle when start recording
    function handleOnMouseDown(start: () => void) {

        // record shielding
        if (isRecAvailable) {

            // set flag to upped
            isUpped.current = true;


            // wait 500 ms
            setTimeout(() => {
                // check if button was untouched
                if (isUpped.current) {
                    // start time measuring
                    lastTime.current = performance.now();
                    // start recoeding
                    start();
                    // set flag to lower
                    isUpped.current = false;
                    console.log("start recording...");
                };
            
            // set timeout to 500 ms
            } , TIME_TO_WAIT);
        };
    };

    // long click handle when stop recording
    function handleOnMouseUp (stop: () => void) {

        // record shielding
        if (isRecAvailable) {
            // if the flag was lowered (recording started) then stop it
            if (!isUpped.current) {

                // make sure recording more than 1 second
                if (performance.now() - lastTime.current < MIN_RECORD_TIME) {
                    // if no then shield recording
                    isRecAvailable.current = false;

                    // wait for 1 sec
                    setTimeout(() => {
                        console.log("recording 1 sec minimum");
                        } , MIN_RECORD_TIME);

                    // then unshield recording
                    isRecAvailable.current = true;
                }
                
                // stop recording
                stop();
                console.log("stop recording...");
            }

            // set flag to lowered anyway
            isUpped.current = false;
        };
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