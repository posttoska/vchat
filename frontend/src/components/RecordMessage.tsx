import { ReactMediaRecorder } from "react-media-recorder";

type Props = {
    handleStop: any;
};

function RecordMessage({ handleStop }: Props) {

    // long click handle
    function handleOnMouseDown(start: () => void) {

    };

    function handleOnMouseUp (start: () => void) {

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