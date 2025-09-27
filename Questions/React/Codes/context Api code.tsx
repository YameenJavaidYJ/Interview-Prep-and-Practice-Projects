import React, {createContext, useContext, useState} from "react";

// 1. Create the Context
interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Create a Provider Component
const ThemeProvider = ({children}: {children?: React.ReactNode}) => {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return <ThemeContext.Provider value={{theme, toggleTheme}}>{children}</ThemeContext.Provider>;
};

// 3. Custom hook to consume context (optional but recommended)
const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};

// 4. Components that consume the context
const Header = () => {
    const {theme, toggleTheme} = useTheme();

    return (
        <header className={`p-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h1 className="text-2xl font-bold">My App</h1>
            <button onClick={toggleTheme} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Toggle to {theme === "light" ? "Dark" : "Light"} Mode
            </button>
        </header>
    );
};

const Content = () => {
    const {theme} = useTheme();

    return (
        <main className={`p-4 min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <p className="text-lg">
                Current theme: <span className="font-semibold">{theme}</span>
            </p>
            <p className="mt-2">This content automatically updates when the theme changes!</p>
        </main>
    );
};

// 5. Main App wrapped with Provider
const App = () => {
    return (
        <ThemeProvider>
            <div>
                <Header />
                <Content />
            </div>
        </ThemeProvider>
    );
};

export default App;
