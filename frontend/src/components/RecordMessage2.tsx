import { useState, useRef  } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

type Props = {
    handleStop: any;
};

function RecordMessage2({ handleStop }: Props) {

    // constants
    const timeToWait = 500;
    
    // containers
    const timerRef = useRef<number | null>(null);

    // flags
    const isLongPress = useRef<boolean>(false);

    // timer start
    function startPressTimer(start: () => void, stop: () => void, status: string) {
    
        // start timer
        timerRef.current = setTimeout(() => {

            // start rec if button is not upped
            start();

            }, timeToWait);
    };

    // click down
    function handleOnMouseDown(start: () => void, stop: () => void, status: string) {

        // start timer
        console.log('handleOnMouseDown');
        startPressTimer(start, stop, status);
    };

    // click up
    function handleOnMouseUp(start: () => void, stop: () => void, status: string) {

        // stop recording if it was started
        if (status === "recording") {
            stop();
            return;
        };

        // clear timer
        console.log('handleOnMouseUp');
        clearTimeout(timerRef.current);

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
                        onMouseDown={() => handleOnMouseDown(startRecording, stopRecording, status)} 
                        onMouseUp={() => handleOnMouseUp(startRecording, stopRecording, status)}
                        className="bg-white p-4 rounded-full"
                    >
                        ICON
                    </button>
                    <p className="mt-2 text-white font-light">
                        {status}
                    </p>
                </div> 
            )}
        />
    );

};

export default RecordMessage2