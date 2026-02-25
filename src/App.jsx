import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import BookDetail from './pages/BookDetail.jsx'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import Home from './pages/Home.jsx'
import Books from './pages/Books.jsx'
import Category from './pages/Category.jsx'
import Author from './pages/Author.jsx'
import Search from './pages/Search.jsx'
import About from './pages/About.jsx'
import CategoryStrip from './components/layout/CategoryStrip.jsx'
import { useState } from 'react'

function NotFound() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <p className="text-slate-700">Page not found.</p>
      <Link to="/" className="text-slate-900 underline">
        Go home
      </Link>
    </div>
  )
}

export default function App() {
  const [activeId, setActiveId] = useState(null)
  return (
    <BrowserRouter>
      <div  className="min-h-screen bg-white flex flex-col">
        <Header setActiveId={setActiveId} />
        <CategoryStrip activeId={activeId} setActiveId={setActiveId} />
        <main onMouseMove={() => setActiveId(null)} className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/category" element={<Category />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/author" element={<Author />} />
            <Route path="/author/:id" element={<Author />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
