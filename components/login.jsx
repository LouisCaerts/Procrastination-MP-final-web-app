"use client";
import { useAuth, useUser, UserButton, SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react';

export function Login() {
    return (
        <div className="d-flex flex-row w-100 h-100 py-4 px-4">

            <div className="d-flex flex-column col"></div>

            <div className="d-flex flex-column col-8 justify-content-center text-center">
                <h1 className="fw-bold">Concrastination</h1>
                <h2 className='fw-lighter'>Your anti-procrastination helper</h2>
                <br />
                <div className='horizontal'>
                    <SignInButton mode="modal">
                        <button className="custom-button">Sign in</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <button className="custom-button inverted-black-white">Register</button>
                    </SignUpButton>
                </div>
            </div>

            <div className="d-flex flex-column col justify-content-end"></div>

        </div>
    );
}