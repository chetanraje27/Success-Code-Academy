"use client";

import React, { useState, useEffect } from "react";
import { testimonials } from "@/data/home";
import SectionHeading from "@/components/ui/SectionHeading";
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < testimonials.length - visibleCards) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const totalDots = testimonials.length - visibleCards + 1;

  return (
    <section className="testimonials-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="testimonials-header-row">
          <SectionHeading
            title="Voices of Success"
            subtitle="Hear from our students and parents who turned their NEET dreams into reality with our expert guidance."
            align="left"
          />
          
          <div className="slider-nav-arrows">
            <button 
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="nav-arrow"
              aria-label="Previous testimonials"
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={nextSlide}
              disabled={currentIndex >= testimonials.length - visibleCards}
              className="nav-arrow"
              aria-label="Next testimonials"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Carousel Slider Window */}
        <div 
          className="slider-window"
          style={{ 
            "--visible-cards": visibleCards, 
            "--visible-gap": visibleCards - 1 
          } as React.CSSProperties}
        >
          <div 
            className="slider-track"
            style={{ 
              transform: `translate3d(calc(-${currentIndex} * (100% / ${visibleCards})), 0, 0)` 
            }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="slider-item">
                <div className="testimonial-card">
                  <div className="quote-icon-wrapper">
                    <FaQuoteLeft className="quote-icon" />
                  </div>
                  
                  <div className="stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="star-icon" />
                    ))}
                  </div>

                  <p className="quote-text">"{testimonial.quote}"</p>

                  <div className="author-info">
                    <div className="avatar-placeholder">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="author-details">
                      <h4 className="author-name">{testimonial.name}</h4>
                      <p className="author-designation">{testimonial.designation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {totalDots > 1 && (
          <div className="slider-dots">
            {Array.from({ length: totalDots }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`slider-dot ${currentIndex === idx ? "active" : ""}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>

      <style jsx>{`
        .testimonials-section {
          padding: 60px 0;
          background: #f8fafc;
          overflow: hidden;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .testimonials-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }

        /* Navigation Arrows */
        .slider-nav-arrows {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
        }
        
        .nav-arrow {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: #0f172a;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.95rem;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.15);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .nav-arrow:hover:not(:disabled) {
          transform: scale(1.08);
          background: #2563eb;
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
        }
        
        .nav-arrow:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Slider track structure */
        .slider-window {
          width: 100%;
          overflow: hidden;
          padding: 10px 0 20px;
          position: relative;
        }
        
        .slider-track {
          display: flex;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          gap: 24px;
          width: 100%;
          will-change: transform;
        }
        
        .slider-item {
          flex: 0 0 calc((100% - (var(--visible-gap) * 24px)) / var(--visible-cards));
          box-sizing: border-box;
          height: 100%;
        }

        .testimonial-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 2.5rem;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.3s ease;
          height: 100%;
          min-height: 280px;
          box-sizing: border-box;
        }

        .testimonial-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(5, 28, 74, 0.06);
          border-color: rgba(64, 181, 193, 0.25);
        }

        .quote-icon-wrapper {
          position: absolute;
          top: -20px;
          right: 30px;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
          box-shadow: 0 6px 14px rgba(64, 181, 193, 0.25);
        }

        .stars {
          display: flex;
          gap: 4px;
          margin-bottom: 1.25rem;
          color: #fbbf24;
        }

        .quote-text {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: 2rem;
          flex: 1;
          font-style: italic;
          text-align: left;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
          padding-top: 1.5rem;
          margin-top: auto;
        }

        .avatar-placeholder {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(30, 64, 175, 0.06);
          color: var(--accent-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .author-details {
          text-align: left;
        }

        .author-name {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 1.05rem;
          margin: 0 0 2px 0;
        }

        .author-designation {
          font-size: 0.82rem;
          color: var(--accent-secondary);
          font-weight: 600;
          margin: 0;
        }

        /* Pagination Dots */
        .slider-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
        }
        
        .slider-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: #cbd5e1;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        
        .slider-dot:hover {
          background: #94a3b8;
        }
        
        .slider-dot.active {
          width: 28px;
          border-radius: 5px;
          background: #1e40af;
        }

        @media (max-width: 768px) {
          .testimonials-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .slider-nav-arrows {
            margin-bottom: 0;
          }
        }

        @media (max-width: 640px) {
          .testimonials-section {
            padding: 40px 0;
          }
          .testimonial-card {
            padding: 1.75rem;
            min-height: auto;
          }
        }
      `}</style>
    </section>
  );
}