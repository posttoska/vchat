import {useState} from 'react';
import Title from './Title';
import RecordMessage from './RecordMessage';


export function CHM() {

    const [isLoading, setisLoading] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    // define states
    const state = [
        "INIT",
        "MD",
        "MTC1",
        "HOLD",
        "MTC2",
        "R",
        "RECS"
    ];

    // define initial state
    const initState = state[0];

    // define accepting
    const acceptState = [
        state[4],
        state[6],
    ];

    const inputLng = [
        "<md>",
        "<md500>",
        "<muib>",
        "<muoob>",
        "<recexd>"
    ];

    // trantion table
    const transTable =
        {
            0: [ state[1], state[5], state[5], state[5], state[5] ],
            1: [ state[5], state[2], state[0], state[0], state[5] ],
            2: [ state[5], state[5], state[6], state[3], state[6] ],
            3: [ state[4], state[5], state[5], state[5], state[5] ],
            4: [ state[6], state[6], state[6], state[6], state[6] ],
            5: [ state[5], state[5], state[5], state[5], state[5] ],
            6: [ state[6], state[6], state[6], state[6], state[6] ],

        };

    
}