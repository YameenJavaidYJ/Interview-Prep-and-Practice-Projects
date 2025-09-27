import React from "react";
import {createStore} from "redux";
import {Provider, useSelector, useDispatch} from "react-redux";

// 1. ACTION TYPES (constants)
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";
const SET_NAME = "SET_NAME";

// 2. ACTION CREATORS (functions that return actions)
const increment = () => ({type: INCREMENT});
const decrement = () => ({type: DECREMENT});
const setName = (name) => ({type: SET_NAME, payload: name});

// 3. INITIAL STATE
const initialState = {
    count: 0,
    name: "Guest"
};

// 4. REDUCER (pure function that updates state)
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case INCREMENT:
            return {
                ...state,
                count: state.count + 1
            };
        case DECREMENT:
            return {
                ...state,
                count: state.count - 1
            };
        case SET_NAME:
            return {
                ...state,
                name: action.payload
            };
        default:
            return state;
    }
};

// 5. CREATE STORE
const store = createStore(reducer);

// 6. COMPONENTS THAT USE REDUX
const Counter = () => {
    // useSelector to read from store
    const count = useSelector((state: any) => state.count);
    // useDispatch to dispatch actions
    const dispatch = useDispatch();

    return (
        <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-bold mb-2">Counter</h2>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => dispatch(decrement())}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    -
                </button>
                <span className="text-2xl font-bold">{count}</span>
                <button
                    onClick={() => dispatch(increment())}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    +
                </button>
            </div>
        </div>
    );
};

const NameChanger = () => {
    const name = useSelector((state: any) => state.name);
    const dispatch = useDispatch();

    const [inputValue, setInputValue] = React.useState("");

    const handleUpdate = () => {
        if (inputValue.trim()) {
            dispatch(setName(inputValue));
            setInputValue("");
        }
    };

    return (
        <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-bold mb-2">Name Changer</h2>
            <p className="mb-2">
                Hello, <span className="font-semibold">{name}!</span>
            </p>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter new name"
                    className="px-3 py-2 border rounded flex-1"
                    onKeyPress={(e) => e.key === "Enter" && handleUpdate()}
                />
                <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Update
                </button>
            </div>
        </div>
    );
};

const StateDisplay = () => {
    // You can select the entire state or parts of it
    const state = useSelector((state) => state);

    return (
        <div className="p-4 border rounded bg-gray-50">
            <h2 className="text-xl font-bold mb-2">Current State</h2>
            <pre className="text-sm">{JSON.stringify(state, null, 2)}</pre>
        </div>
    );
};

// 7. MAIN APP WRAPPED WITH PROVIDER
const App = () => {
    return (
        <Provider store={store} children={undefined}>
            <div className="max-w-md mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Redux Minimal Example</h1>
                <Counter />
                <NameChanger />
                <StateDisplay />
            </div>
        </Provider>
    );
};

export default App;
