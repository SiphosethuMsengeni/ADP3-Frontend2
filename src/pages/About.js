import React from 'react';
import { Link } from 'react-router-dom';
import './AboutContact.css';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center p-3">
                <img 
                  src="/images/book-stack-logo.svg" 
                  alt="Snuggle Read Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Snuggle Read
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
              Fueling brilliant minds, one course at a time. We're the campus premier bookstore, 
              dedicated to supporting your educational journey every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link 
                to="/books"
                className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-lg font-semibold inline-flex items-center transition"
              >
                <span className="mr-2">→</span>
                Browse Our Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Founded in the heart of South Africa, Snuggle Reads began as a small dream to create 
                  a cozy corner of the internet where book lovers could find their next great adventure. 
                  We believe that every book has the power to transport, transform, and embrace readers 
                  in ways that feel deeply personal and wonderfully warm.
                </p>
                <p>
                  Our carefully curated selection spans genres from timeless classics to contemporary 
                  bestsellers, ensuring that whether you're seeking escapism, education, or enlightenment, 
                  you'll find exactly what your soul needs.
                </p>
                <p>
                  With over 50,000 titles and growing, we pride ourselves on supporting both local 
                  South African authors and bringing international voices to your doorstep. Every book 
                  we stock is chosen with love, care, and the understanding that reading is one of 
                  life's greatest pleasures.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1750124673101-fd056ba41e39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYm9va3N0b3JlJTIwaW50ZXJpb3IlMjB3YXJtJTIwbGlnaHRpbmd8ZW58MXx8fHwxNzU4NDIxOTI4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Cozy bookstore interior with warm lighting"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">❤️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">What We Stand For</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our values guide everything we do, from book selection to customer service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-orange-200 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <div className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">❤️</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Passion for Reading</h3>
              </div>
              <div className="text-center">
                <p className="text-slate-600">
                  We're genuine book lovers who understand the magic of a great story. 
                  Our recommendations come from the heart, because we've lived these stories too.
                </p>
              </div>
            </div>

            <div className="border border-orange-200 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <div className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Community First</h3>
              </div>
              <div className="text-center">
                <p className="text-slate-600">
                  We're more than a bookstore – we're a community. Supporting local authors, 
                  readers, and the South African literary scene is at the heart of what we do.
                </p>
              </div>
            </div>

            <div className="border border-orange-200 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <div className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Quality Promise</h3>
              </div>
              <div className="text-center">
                <p className="text-slate-600">
                  Every book is carefully selected, quality-checked, and packaged with care. 
                  We guarantee authentic titles and excellent condition, every time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Readers Choose Us</h2>
            <p className="text-lg text-slate-600">
              We're committed to making your book-buying experience exceptional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">South African Owned</h3>
              <p className="text-slate-600 text-sm">
                Proudly local, supporting South African readers and authors
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Award-Winning Service</h3>
              <p className="text-slate-600 text-sm">
                Recognized for excellence in customer service and satisfaction
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Curated Selection</h3>
              <p className="text-slate-600 text-sm">
                Hand-picked titles across all genres for every type of reader
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💜</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Made with Love</h3>
              <p className="text-slate-600 text-sm">
                Every order packaged with care and attention to detail
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping & Services Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Services</h2>
            <p className="text-lg text-slate-600">Making book shopping convenient and affordable across South Africa</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border border-orange-200 bg-white rounded-lg p-6 shadow-sm">
              <div className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Free Shipping</h3>
              </div>
              <div className="text-center">
                <p className="text-slate-600 mb-2">
                  Enjoy free shipping on all orders over <strong>R650</strong> nationwide
                </p>
                <p className="text-sm text-slate-500">
                  Standard delivery: R89.99 | Express: R149.99
                </p>
              </div>
            </div>

            <div className="border border-orange-200 bg-white rounded-lg p-6 shadow-sm">
              <div className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Quality Guarantee</h3>
              </div>
              <div className="text-center">
                <p className="text-slate-600 mb-2">
                  All books guaranteed authentic and in excellent condition
                </p>
                <p className="text-sm text-slate-500">
                  30-day return policy for your peace of mind
                </p>
              </div>
            </div>

            <div className="border border-orange-200 bg-white rounded-lg p-6 shadow-sm">
              <div className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Personal Service</h3>
              </div>
              <div className="text-center">
                <p className="text-slate-600 mb-2">
                  Book recommendations and personalized customer support
                </p>
                <p className="text-sm text-slate-500">
                  Chat with our book-loving team for help
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Have questions? Need recommendations? We'd love to hear from you and help you 
            find your next perfect read.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-orange-100">hello@snugglereads.co.za</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-orange-100">0800 BOOKS (26657)</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Hours</h3>
              <p className="text-orange-100">Mon-Fri: 8AM-6PM<br />Sat: 9AM-4PM</p>
            </div>
          </div>
          
          <div className="mt-12">
            <Link 
              to="/books"
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-lg font-semibold inline-flex items-center transition"
            >
              <span className="mr-2">📚</span>
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
