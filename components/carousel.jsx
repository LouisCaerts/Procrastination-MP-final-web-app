"use client";
import React, {useEffect } from 'react';

export function Carousel() {
    const carouselHomeInterval = 10000;

    useEffect(() => {
      if (typeof window !== 'undefined') {
        // Bootstrap carousel auto-initialization after page load or navigation
        const carouselElement = document.querySelector('.carousel');
        if (carouselElement) {
          new window.bootstrap.Carousel(carouselElement);
        }
      }
    }, []); // This effect runs only once, after the component mounts

    return (
        <div className="">
            
            <h3 className='text-center fw-normal'>Did you know:</h3>
            <div id="carouselHome" className="carousel slide d-flex justify-content-center" data-bs-ride="carousel">
              <div className="carousel-inner d-inline-flex text-center">
                <div className="carousel-item active" data-bs-interval={carouselHomeInterval}>
                  <p>20% of people are chronic procrastinators! You're definitely not alone in putting things off.</p>
                </div>
                <div className="carousel-item" data-bs-interval={carouselHomeInterval}>
                  <p>Ancient Greek philosophers even had a word for procrastination: 'akrasia'—acting against your better judgment.</p>
                </div>
                <div className="carousel-item" data-bs-interval={carouselHomeInterval}>
                  <p>Studies show that procrastination peaks among university students, especially around exam time.</p>
                </div>
                <div className="carousel-item" data-bs-interval={carouselHomeInterval}>
                  <p>Mark Twain once said, 'Never put off till tomorrow what may be done the day after tomorrow just as well.' Even famous writers procrastinated!</p>
                </div>
                <div className="carousel-item" data-bs-interval={carouselHomeInterval}>
                  <p>Procrastination is not about time management but about managing emotions like anxiety or self-doubt.</p>
                </div>
                <div className="carousel-item" data-bs-interval={carouselHomeInterval}>
                  <p>We tend to remember unfinished tasks better than completed ones. That’s why incomplete tasks stay on our minds! That's the Zeigarnik effect!</p>
                </div>
                <div className="carousel-item" data-bs-interval={carouselHomeInterval}>
                  <p>There's 'active procrastination,' where you delay but stay productive, and 'passive procrastination,' where you avoid tasks entirely.</p>
                </div>
              </div>
            </div>

        </div>
    );
}