import { useState, useRef  } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import CHM from './CHM';

type Props = {
    handleStop: any;
};

function RecordMessage({ handleStop }: Props) {


    const some_value = CHM(some_arguments);

    // constants
    const TIME_TO_WAIT = 500;
    const MIN_RECORD_TIME = 1000;
    
    // flags 
    const isUpped = useRef<boolean>(false);
    const isRecAvailable = useRef<boolean>(true);

    // counters
    const lastTime = useRef<number>(0);
    
    
    // long click handle when start recording
    function handleOnMouseDown(start: () => void) {

        // record shielding
        if (isRecAvailable.current) {

            // set flag to upped
            isUpped.current = true;

            // count overclicking

            // overclick shielding

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
        if (isRecAvailable.current) {
            // if the flag was lowered (recording started) then stop it
            if (!isUpped.current) {

                // make sure recording more than 1 second
                if (performance.now() - lastTime.current < MIN_RECORD_TIME) {
                    // if no then shield recording
                    isRecAvailable.current = false;

                    // wait for 1 sec
                    setTimeout(() => {
                        console.log("recording 1 sec minimum");

                        // then unshield recording (after 1 sec) and then stop
                        isRecAvailable.current = true;
                        stop();

                        } , MIN_RECORD_TIME);
                    
                };
                
                // stop if rec is available
                if (isRecAvailable.current) {
                    console.log("stop recording...");
                    stop();
                };
            };

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
                        onMouseUp={}
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
};

export default RecordMessage;