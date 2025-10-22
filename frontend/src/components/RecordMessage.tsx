import { useState, useRef  } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

type Props = {
    handleStop: any;
};

function RecordMessage({ handleStop }: Props) {

    // constants
    const TIME_TO_WAIT = 500;
    const MIN_RECORD_TIME = 1000;

    // flags 
    const isUpped = useRef<boolean>(false);
    const isRecAvailable = useRef<boolean>(true);
    
    // counters (OOB - out of bounds)
    const overClickerCount = useRef<number>(0);
    const OOBCounter = useRef<number>(0);
    const lastTime = useRef<number>(0);

    // states
    const waitId500 = useRef<number | null>(null);

    // clicker misalignment function 
    function detectClickerMisalignment(misalignmentValue: number, start: () => void, stop: () => void)  {
        
        // detect over down clicker misalignment
        if (misalignmentValue > 1) {
            // decrement counter
            OOBCounter.current = OOBCounter.current - 1;
            // invoke handleOnMouseUp function
            handleOnMouseUp(start, stop);
            // increment counter to immetate button click
            OOBCounter.current = OOBCounter.current + 1;
        };

        // detect over up clicker misalignment
        if (misalignmentValue < 0) {
            // invoke handleOnMouseDown function
            handleOnMouseDown(start, stop);
        };
    };



    // long click handle when start recording
    function handleOnMouseDown(start: () => void, stop: () => void) {

        // record shielding
        if (isRecAvailable.current) {
            // down press is +1
            OOBCounter.current = OOBCounter.current + 1;
            // detect clicker misalignment and align
            detectClickerMisalignment(OOBCounter.current, start, stop);
        };
        
        // record shielding
        if (isRecAvailable.current) {

            // set flag to upped
            if (!isUpped.current) { 
                isUpped.current = true;
            };
            
            // count overclicking
            overClickerCount.current = overClickerCount.current + 1

            // detect overclicking
            if (overClickerCount.current > 1) {
                // cancel recording sequence
                clearTimeout(waitId500.current);
                // return state to null to clear context
                waitId500.current = null;
                // reset oveclicker counter to single click
                overClickerCount.current = 1;
            };

            // wait 500 ms
            waitId500.current = setTimeout(() => {

                // check if button was untouched and protect from overclick
                if (isUpped.current) {
                    // start time measuring
                    lastTime.current = performance.now();
                    // start recoeding
                    start();
                    // set flag to lower
                    isUpped.current = false;
                    console.log("start recording...");
                };
                // reset oveclicker counter after 500 ms
                overClickerCount.current = 0;
                // clear itself
                waitId500.current = null;
            
            // set timeout to 500 ms
            } , TIME_TO_WAIT);

        };
    };

    // long click handle when stop recording
    function handleOnMouseUp(start: () => void, stop: () => void) {

        // record shielding
        if (isRecAvailable.current) {
            // up press is -1
            OOBCounter.current = OOBCounter.current - 1;
            // detect clicker misalignment and align
            detectClickerMisalignment(OOBCounter.current, start, stop);
        };

        // record shielding
        if (isRecAvailable.current) {

            // if the flag was lowered (recording started) then stop it
            if (!isUpped.current) {

                // make sure recording more than 1 second
                if (performance.now() - lastTime.current < MIN_RECORD_TIME) {
                    // if no then shield recording
                    isRecAvailable.current = false;

                    // make recording min 1 sec long (depends how long rec lasted)
                    setTimeout(() => {
                        console.log("recording minimum 1 sec");
                        // then stop and unshield recording (after 1 sec) and then
                        stop();
                        isRecAvailable.current = true;

                        } , (MIN_RECORD_TIME - (performance.now() - lastTime.current)));
                    
                };
                
                // stop if rec is available
                if (isRecAvailable.current) {
                    console.log("stop recording...");
                    stop();
                };
            };
            
            // set flag to lowered
            if (isUpped.current) {
                isUpped.current = false;
            };
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
                        onMouseDown={() => handleOnMouseDown(startRecording, stopRecording)} 
                        onMouseUp={() => handleOnMouseUp(startRecording, stopRecording)}
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