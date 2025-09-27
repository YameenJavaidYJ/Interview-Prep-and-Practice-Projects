// React Router Setup and Examples
// Install: npm install react-router-dom

// All imports at the top
import {BrowserRouter, Routes, Route, Link, useNavigate, useParams, Outlet} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// 1. Set Up Router in Your App
function Root() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

// 2. Define Routes
function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} /> {/* Default route */}
            <Route path="/about" element={<About />} /> {/* /about route */}
            <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
        </Routes>
    );
}

// 3. Navigation with Link and useNavigate
function Navbar() {
    const navigate = useNavigate();

    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>

            {/* Programmatic navigation */}
            <button onClick={() => navigate("/about")}>Go to About</button>
        </nav>
    );
}

// 4. Dynamic Routes & Parameters
// Route definition
<Route path="/users/:id" element={<UserProfile />} />;

// Component
function UserProfile() {
    const {id} = useParams();
    return <h2>User Profile: {id}</h2>;
}

// 5. Nested Routes
<Route path="/dashboard" element={<Dashboard />}>
    <Route path="settings" element={<Settings />} />
    <Route path="profile" element={<Profile />} />
</Route>;

// Inside Dashboard component
function Dashboard() {
    return (
        <div>
            <h2>Dashboard</h2>
            <Outlet /> {/* Nested routes will render here */}
        </div>
    );
}
