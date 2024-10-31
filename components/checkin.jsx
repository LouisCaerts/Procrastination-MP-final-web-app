"use client";

import { Navbar } from 'components/navbar.jsx';
import { createSupabaseClientWithClerk } from './supabase';
import { useSession } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import { CheckinForm } from 'components/checkin-form'
import { ReviewForm } from 'components/review-form'
import Image from 'next/image';

export function Checkin() {
    // Clerk session & supabase client
    const { session, isLoaded } = useSession();
    const [supabaseClient, setSupabaseClient] = useState(null);
    const [databaseLoaded, setDatabaseLoaded] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [fatalError, setFatalError] = useState(false);
    // Other variables
    const [checkins, setCheckins] = useState([]);
    const [reviews, setReviews] = useState([]);
    const checkinExample = {
        "id": 34,
        "feeling": null,
        "productivity": null,
        "procrastination": null,
        "day": "2024-10-08",
        "completed": null,
        "comment": null,
        "user_id": "user_2h93fyVjbmpWdztb9cAEJwLuAGh"
    }
    const reviewExample = {
        "id": 1,
        "rating": null,
        "comment": null,
        "chat_id": 18,
        "user_id": "user_2h93fyVjbmpWdztb9cAEJwLuAGh",
        "chat": {
            "start": "2024-10-08T22:08:41.085968+00:00"
        }
    }
    const humanReadableDate1 = formatTimestampToHumanReadable(checkinExample.day);
    console.log(humanReadableDate1);
    const humanReadableDate2 = formatTimestampToHumanReadable(reviewExample.chat.start);
    console.log(humanReadableDate2);

    function formatTimestampToHumanReadable(timestamp) {
        const date = new Date(timestamp);
    
        // Format for day and date
        const weekdayOptions = { weekday: 'long' };
        const weekday = new Intl.DateTimeFormat('en-US', weekdayOptions).format(date);
    
        const monthYearOptions = { month: 'long' };
        const monthYear = new Intl.DateTimeFormat('en-US', monthYearOptions).format(date);
    
        const day = date.getDate();
        const ordinalSuffix = getOrdinalSuffix(day);
    
        let formattedDate = `${weekday}, ${monthYear} ${day}${ordinalSuffix}, ${date.getFullYear()}`;
    
        // Check if the timestamp contains time (hour and minute)
        if (timestamp.includes('T')) {
            const timeOptions = { hour: '2-digit', minute: '2-digit' };
            const time = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
            formattedDate += ` at ${time}`;
        }
    
        return formattedDate;
    }
    
    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    async function loadData() {
        console.log("Loading data...");

        console.log("Loading pending checkins...");
        const { pending_checkins } =  await loadCheckins();
        setCheckins(pending_checkins);
        console.log("Pending checkins: ", pending_checkins);

        console.log("Loading pending reviews...");
        const { pending_reviews } =  await loadReviews();
        setReviews(pending_reviews);
        console.log("Pending reviews: ", pending_reviews);

        /*
        if (messages.length == 0) {
            await sendMessage(false, prompt, true, chat_id);
            setReadyToSend(true);
        }
        else {
            setMessages(messages);
        }
        */

        console.log("Data loaded!")
    }

    async function loadCheckins() {
        const { data, error } = await supabaseClient
        .from('checkin')
        .select()
        .is('completed', null)
        .order('day', { ascending: true });
        if (!error) {
            console.log("Pending checkins loaded!");
            return {pending_checkins: data};
        } else {
            console.error("Unable to retrieve pending checkins.");
            setFatalError(true);
            return {pending_checkins: null};
        }
    }

    async function loadReviews() {
        const { data, error } = await supabaseClient
        .from('review')
        .select('*, chat(start, identification)')
        .is('rating', null)
        .order('chat(start)', { ascending: true });
        if (!error) {
            console.log("Pending reviews loaded!");
            return {pending_reviews: data};
        } else {
            console.error("Unable to retrieve pending reviews.");
            setFatalError(true);
            return {pending_reviews: null};
        }
    }
    
    // Page loading ( 1: database needs to be initialised )
    useEffect(() => {
        const loadDatabase = async () => {
                try {
                setDatabaseLoaded(false);
                if (isLoaded) {
                    const supabaseAccessToken = await session.getToken({
                        template: 'supabase',
                    });
                    setSupabaseClient(createSupabaseClientWithClerk(supabaseAccessToken));
                    setDatabaseLoaded(true);
                }
            } catch (e) {
                console.log('Exception while loading database:', e);
            }
        }
        loadDatabase();
    }, [isLoaded]);

    // Page loading ( 2: load data )
    useEffect(() => {
        if (databaseLoaded) {
            console.log("DATABASE LOADED")
            loadData();
        }
    }, [databaseLoaded]);

    return (
        <div className="d-flex flex-column col-12 custom-grow">

            <Navbar />

            <div className="d-flex flex-row w-100 h-100 py-4 px-4 justify-content-center">

                <div className="d-flex flex-column col-1">
                    <div className="ps-2">
                    </div>
                </div>

                <div className="d-flex flex-column col-10 justify-content-center">

                    <div className="d-flex flex-column text-center justify-content-top col">

                        <h2 className=''>Help us collect data to understand procrastination even better!</h2>
                        <br />
                        <br />

                        {checkins.length == 0 & reviews.length == 0 ? (
                            <div>
                                <h5>You have filled in all surveys for now. Thank you!</h5>
                                <h5>Please check back tomorrow night.</h5>
                                <br />
                                <br />
                                <iframe src="https://giphy.com/embed/uWlpPGquhGZNFzY90z" width="480" height="350" style={{}} frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/moodman-thank-you-funny-uWlpPGquhGZNFzY90z">via GIPHY</a></p>
                            </div>
                        ) : (<></>)}
                            
                        {checkins.length > 0 ? (
                            <div>
                                <hr className="my-4" />
                                <h4><ins>Pending personal reflections:</ins></h4>

                                <div className='d-flex flex-column'>
                                    <div className="card text-start">
                                        <div className="card-body">
                                            {checkins.map((checkin, index) => (
                                                <div key={index}>
                                                    <CheckinForm checkinData={{id: checkin.id, date:formatTimestampToHumanReadable(checkin.day)}} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (<></>)}

                        {reviews.length > 0 ? (
                            <div>
                                <hr className="my-4" />
                                <h4><ins>Pending user reviews:</ins></h4>

                                <div>
                                    <div className="card text-start">
                                        <div className="card-body">
                                            {reviews.map((review, index) => (
                                                <div key={index}>
                                                    <ReviewForm reviewData={{id: review.id, date:formatTimestampToHumanReadable(review.chat.start), chat_id: review.chat_id, identification: review.chat.identification}} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (<></>)}

                    </div>
                </div>

                <div className="d-flex flex-column col-1 justify-content-start align-items-end">
                </div>

            </div>
        </div>
    )
}