import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import MeshBackground from "./components/MeshBackground";
import { SocketProvider } from "./context/SocketContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Connections from "./pages/Connections";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPostPage";
import BlogEditor from "./pages/BlogEditor";

export default function App() {
  return (
    <SocketProvider>
      <MeshBackground />
      <div className="min-h-screen flex flex-col relative z-0">
        <Navbar />
        <main className="flex-1 w-full animate-fade-slide-up">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/blog" element={<Blog />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/search" element={<Search />} />
              <Route path="/connections" element={<Connections />} />
              {/* Static route /blog/new MUST come before dynamic /blog/:slug */}
              <Route path="/blog/new" element={<BlogEditor />} />
            </Route>

            {/* Dynamic Route placed after static paths */}
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </main>
      </div>
    </SocketProvider>
  );
}

