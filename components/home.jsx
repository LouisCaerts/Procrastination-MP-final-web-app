"use client";
import React, {useState, useEffect } from 'react';
import { Carousel } from 'components/carousel.jsx'
import Link from 'next/link';

export function Home() {
    return (
        <div className="d-flex flex-row w-100 h-100 py-4 px-4 justify-content-center">

            <div className="d-flex flex-column col-8 justify-content-center">
                <div className="d-flex flex-column col">
                </div>

                <div className="d-flex flex-column text-center justify-content-center col">
                    <h2 className=''>Need help getting started?</h2>
                    <h2 className=''>Find out what&apos;s holding you back!</h2>
                    <br />
                    <Link href="/identify" className="custom-link-text" >
                        <button className="custom-button-big centered">I am procrastinating!</button>
                    </Link>

                    <br />
                    <br />
                    <br />
                    <br />
                </div>
                
                <div className="d-flex flex-column col">
                    <Carousel/>
                </div>
            </div>

        </div>
    );
}