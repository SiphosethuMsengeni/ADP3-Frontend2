import React from 'react';
import { Link } from 'react-router-dom';
import './AboutContact.css';

const About = () => {


  return (
    <main className="about-page"
    style ={{
    backgroundImage: 'url(/library.PNG)', // Reference from the public folder
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',

    }}>
      <section className="hero-small">
        <div className="container">
        <div className="card">
          <h1>About Snuggle Read</h1>
          <p className="lead">We make learning cozy. Books, resources, and a little bit of sunshine for your campus life.</p>
        </div>
        </div>
      </section>

      <section className="team-section container">
        <div className="card large">
          <div className="card-media mascot" aria-hidden="true">📚</div>
          <div className="card-body">
            <h2>Our Story</h2>
            <p>Started by students for students, Snuggle Read grew from a simple idea: make textbooks affordable, accessible, and delightful. We partner with campus bookstores and educators to bring the best materials to your doorstep.</p>
            <p>We believe education should feel warm — inviting students to explore, learn and grow.</p>
            <Link to="/books" className="btn">Browse Books</Link>
          </div>
        </div>

        <div className="cards-grid">
          <div className="card">
            <h3>Mission</h3>
            <p>Deliver quality academic resources with exceptional service and student-first pricing.</p>
          </div>
          <div className="card">
            <h3>Vision</h3>
            <p>Be the trusted university bookstore that brings learning closer to every campus.</p>
          </div>

          <div className="card">
            <h3>Values</h3>
            <ul>
              <li>Accessibility</li>
              <li>Care</li>
              <li>Integrity</li>
            </ul>
          </div>

             <div className="card">
                    <h3>📚 Academic Excellence</h3>
                    <p>Curated collection of textbooks, reference materials, and scholarly resources
                       to support your academic journey at the university.</p>
                  </div>

                     <div className="card">
                            <h3>🛒 Easy Shopping</h3>
                            <p>Seamless online shopping experience with secure cart management and
                               convenient ordering system for students.</p>
                          </div>

                          <div className="card">
                            <h3>📖 Diverse Genres</h3>
                            <p>From academic textbooks to fiction, science, and technology - explore
                               our extensive collection across multiple genres.</p>
                          </div>

                          <div className="card">
                            <h3>🎓 Student-Friendly</h3>
                            <p>Special pricing and deals for university students with quick delivery
                               and flexible payment options.</p>
                          </div>

                          <div className="card">

                            <h3>✏️  Creators</h3>
                            <p> Siphosethu Msengeni, Ashton Peterson, Musa Nkosi, Tyrese Ntate and Aimee Paulus</p>
                          </div>

        </div>
      </section>
    </main>
  );
};

export default About;
