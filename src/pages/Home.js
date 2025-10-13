import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import IconBook from '../assets/icons/book.svg';
import IconCart from '../assets/icons/cart.svg';
import IconDelivery from '../assets/icons/delivery.svg';
import IconStar from '../assets/icons/star.svg';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    genres: 4,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const booksResponse = await api.get("/book/all");
      setStats({
        totalBooks: booksResponse.data?.length || 150,
        totalUsers: 1250,
        genres: 4,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        totalBooks: 150,
        totalUsers: 1250,
        genres: 4,
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 font-sans">
      {/* Hero Section */}
      <div className="hero bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300 rounded-3xl shadow-lg p-10 flex flex-col md:flex-row items-center justify-between transition-all">
        <div className="flex flex-col gap-4 md:w-1/2">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/logo.png"
              alt="Snuggle Read Logo"
              className="w-16 h-16 rounded-full shadow-md border-2 border-orange-400"
            />
            <h2 className="text-4xl font-extrabold text-orange-800 drop-shadow-sm">
              Welcome to Snuggle Read
            </h2>
          </div>
          <p className="text-orange-900 text-lg leading-relaxed">
            Your cozy university bookstore — where learning meets comfort!  
            Discover academic and leisure books to fuel your journey.
          </p>
          <div className="flex gap-3 mt-4">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition-all"
              onClick={() => navigate("/books")}
            >
              Browse Books
            </button>
            {!isAuthenticated() && (
              <button
                className="bg-white hover:bg-orange-100 text-orange-800 font-semibold px-6 py-2 rounded-xl border border-orange-300 shadow-sm transition-all"
                onClick={() => navigate("/register")}
              >
                Join Snuggle Read
              </button>
            )}
          </div>
        </div>

        <img
          src="/logo.png"
          alt="Snuggle Read"
          className="hidden md:block w-52 h-52 object-contain drop-shadow-md"
        />
      </div>

      {/* Stats Section */}
      <div className="stats grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 text-center">
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-orange-100">
          <img src={IconBook} alt="books" className="mx-auto w-8 h-8 mb-2" />
          <div className="text-3xl font-bold text-orange-800">
            {stats.totalBooks}+
          </div>
          <div className="text-orange-700">Books Available</div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-orange-100">
          <img src={IconStar} alt="students" className="mx-auto w-8 h-8 mb-2" />
          <div className="text-3xl font-bold text-orange-800">
            {stats.totalUsers}+
          </div>
          <div className="text-orange-700">Happy Students</div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-orange-100">
          <img src={IconBook} alt="genres" className="mx-auto w-8 h-8 mb-2" />
          <div className="text-3xl font-bold text-orange-800">
            {stats.genres}+
          </div>
          <div className="text-orange-700">Book Genres</div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-orange-100">
          <img src={IconDelivery} alt="online" className="mx-auto w-8 h-8 mb-2" />
          <div className="text-3xl font-bold text-orange-800">24/7</div>
          <div className="text-orange-700">Online Access</div>
        </div>
      </div>

      {/* Features Section */}
      <div
        className="grid gap-6 mt-12"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        <div className="bg-orange-50 p-6 rounded-3xl shadow-md hover:shadow-lg transition">
          <img src={IconBook} alt="academic" className="w-7 h-7 mb-3" />
          <h3 className="font-semibold text-lg text-orange-800 mb-2">
            Academic Excellence
          </h3>
          <p className="text-orange-900">
            Curated academic resources to support your studies and success.
          </p>
        </div>

        <div className="bg-orange-50 p-6 rounded-3xl shadow-md hover:shadow-lg transition">
          <img src={IconCart} alt="easy shopping" className="w-7 h-7 mb-3" />
          <h3 className="font-semibold text-lg text-orange-800 mb-2">
            Easy Shopping
          </h3>
          <p className="text-orange-900">
            Simple, secure, and delightful online bookstore experience.
          </p>
        </div>

        <div className="bg-orange-50 p-6 rounded-3xl shadow-md hover:shadow-lg transition">
          <img src={IconBook} alt="diverse genres" className="w-7 h-7 mb-3" />
          <h3 className="font-semibold text-lg text-orange-800 mb-2">
            Diverse Genres
          </h3>
          <p className="text-orange-900">
            From academic textbooks to cozy fiction — something for everyone.
          </p>
        </div>

        <div className="bg-orange-50 p-6 rounded-3xl shadow-md hover:shadow-lg transition">
          <img src={IconStar} alt="student-friendly" className="w-7 h-7 mb-3" />
          <h3 className="font-semibold text-lg text-orange-800 mb-2">
            Student-Friendly
          </h3>
          <p className="text-orange-900">
            Affordable prices, fast delivery, and student discounts await you.
          </p>
        </div>
      </div>

      {/* Vision & Mission moved to About page */}

      {/* Featured Genres */}
      <div className="bg-orange-50 p-8 rounded-3xl shadow-md mt-12 text-center">
        <h3 className="text-2xl font-bold text-orange-800 mb-4">
          Featured Genres
        </h3>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {[
            "Academic Textbooks",
            "Science & Technology",
            "Literature & Fiction",
            "Business & Economics",
          ].map((genre) => (
            <div
              key={genre}
              className="bg-orange-200 text-orange-900 px-5 py-2 rounded-full text-sm font-semibold shadow-sm hover:bg-orange-300 transition"
            >
              {genre}
            </div>
          ))}
        </div>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold shadow-md transition"
          onClick={() => navigate("/books")}
        >
          Explore All Books
        </button>
      </div>
    </div>
  );
}

export default Home;
