import { useState, useRef, useEffect  } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import RecordIcon from "./RecordIcon";

type Props = {
    handleStop: any;
};

function RecordMessage({ handleStop }: Props) {

    // message
    const [message, setMessage] = useState<string>("нажмите и удерживайте");
    
    // constants
    const TIME_TO_WAIT = 500;
    const MIN_RECORD_TIME = 1000;
    const MARGIN_THRESHOLD = 950;
    const MARGIN_WAIT = 50;

    // flags (DCM stands for detect clicker misalignment)
    const isUpped = useRef<boolean>(false);
    const isIgnored = useRef<boolean>(false);
    const isDCMFired = useRef<boolean>(false);
    const isRecAvailable = useRef<boolean>(true);
    
    // counters (OOB - out of bounds)
    const overClickerCount = useRef<number>(0);
    const OOBCounter = useRef<number>(0);
    const lastTime = useRef<number>(0);
    const diff = useRef<number | null>(null);

    // states
    const waitId500 = useRef<number | null>(null);
    const [REC, setREC] = useState<"OFF" | "ON" | "PENDING">("OFF");


    // clicker misalignment function 
    function detectClickerMisalignment(misalignmentValue: number, start: () => void, stop: () => void)  {
        
        // detect over down clicker misalignment
        if (misalignmentValue > 1) {
            // invoke handleOnMouseUp function
            handleOnMouseUp(start, stop);
        };

        // detect over up clicker misalignment
        if (misalignmentValue < 0) {
            // invoke ignoring sequence and reset
            isIgnored.current = true;
            OOBCounter.current = 0;
        };

        // ensure code above happened (but not while recording is pending)
        isDCMFired.current = true;
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
        if (isRecAvailable.current && isDCMFired.current) {

            // set flag to upped
            if (!isUpped.current) { 
                isUpped.current = true;
            };
            
            // count overclicking
            overClickerCount.current = overClickerCount.current + 1;

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
                    // message 
                    setREC("ON");

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

        // forget about the code at the very start of this function
        if (isDCMFired.current) {
            isDCMFired.current = false;
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
        if (isRecAvailable.current && isDCMFired.current && !isIgnored.current) {

            // if the flag was lowered (recording started) then stop it
            if (!isUpped.current) {

                // count time diff
                diff.current = performance.now() - lastTime.current;

                // make sure recording more than 1 second
                if (diff.current < MIN_RECORD_TIME) {

                    // if no then shield recording
                    isRecAvailable.current = false;

                    // message 
                    setREC("PENDING");

                    // make recording min 1 sec long (depends how long rec lasted)
                    setTimeout(() => {
                        console.log("recording minimum 1 sec");
                        // then stop and unshield recording (after 1 sec) and then
                        stop();
                        // message 
                        setREC("OFF");

                        // reset oob counter since user can do any actions while button is not available
                        // so we need to reset the button
                        OOBCounter.current = 0;

                        // clear lsat time
                        lastTime.current = 0;

                        // very specific bug handling when buttom is double down clicked and record is pending with small margin
                        if (diff.current > MARGIN_THRESHOLD) {
                            // release isRecAvailable a little bit later after pending is out
                            setTimeout(() => { isRecAvailable.current = true}, MARGIN_WAIT );
                        } else {
                            // release isRecAvailable instantly after pending is out
                            isRecAvailable.current = true;
                        };

                        // clear diff
                        diff.current = null;

                        } , (MIN_RECORD_TIME - diff.current));
                    
                };
                
                // stop if rec is available
                if (isRecAvailable.current) {
                    console.log("stop recording...");
                    stop();

                    // message 
                    setREC("OFF");

                    // clear diff
                    diff.current = null;

                    // clear lsat time
                    lastTime.current = 0;
                };
            };
            
            // set flag to lowered
            if (isUpped.current) {
                isUpped.current = false;
            };
        };

        // reset ignoring if it was ignored
        if (isIgnored.current) {
                isIgnored.current = false;
            };
        
        // forget about the code at the very start of this function
        if (isDCMFired.current) {
            isDCMFired.current = false;
        };
    };

    // message
    useEffect( () => {
        switch (REC) {
            case "ON":
                setMessage("запись");
                break;

            case "PENDING":
                setMessage("кнопка недоступна, запись продлевается");
                break;

            default:
                setMessage("нажмите и удерживайте");
            };
    }, [REC]);

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
                        <RecordIcon classText={status === "recording" ? "animate-pulse text-red-500" : "text-sky-500"} />
                    </button>
                    <p className="mt-2 text-white font-light">
                        {message}
                    </p>
                </div> 
            )}
        />
    );
};

export default RecordMessage