"use client";

import { createSupabaseClientWithClerk } from './supabase';
import { useSession } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function CheckinForm({ incrementCount, checkinData }) {
    // Clerk session & supabase client
    const { session, isLoaded } = useSession();
    const [supabaseClient, setSupabaseClient] = useState(null);
    const [databaseLoaded, setDatabaseLoaded] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [fatalError, setFatalError] = useState(false);
    const [formData, setFormData] = useState({
        question1: '',
        question2: '',
        question3: '',
        comment: '',
    });
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);

    const toggleVisibility = () => {
      const newVisibility = !isVisible;
      setIsVisible(newVisibility);
    };
    
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent page reload on form submit

        // Extract form data
        const form = event.target;
        const formValues = {
            question1: form.question1.value,
            question2: form.question2.value,
            question3: form.question3.value,
            comment: form.comment.value,
        };
        uploadForm(formValues);

        incrementCount();
        console.log("Form submitted with values: ", formValues);
    };

    // insert identification into supabase
    async function uploadForm(formValues) {
        const { data, error } = await supabaseClient.rpc('update_checkin', {
            p_id: checkinData.id,
            p_feeling: formValues.question1,
            p_productivity: formValues.question2,
            p_procrastination: formValues.question3,
            p_comment: formValues.comment
          });
        if (error) {
            console.error('Error inserting new chat:', error);
            setUploadError(true);
        } else {
            toggleVisibility();
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
                console.log('Exception while loading database of checkin form:', e);
            }
        }
        loadDatabase();
    }, [isLoaded]);

    // Page loading ( 2: load data )
    useEffect(() => {
        if (databaseLoaded) {
            console.log("DATABASE LOADED FROM CHECKIN FORM")
        }
    }, [databaseLoaded]);

    if (!isVisible) return (<></>);

    return (
        <div className="container mt-5">
            <p className="custom-card-text-checkin">On <strong>{checkinData.date}</strong>:</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                <label className="form-label">
                    <h5>1. I felt good.</h5>
                </label>
                <div className="d-flex flex-column flex-md-row justify-content-between">
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question1" id={"q1-option1"+"checkin"+checkinData.id} value="1" required />
                    <label className="form-check-label" htmlFor={"q1-option1"+"checkin"+checkinData.id}>
                        Strongly Disagree
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question1" id={"q1-option2"+"checkin"+checkinData.id} value="2" required />
                    <label className="form-check-label" htmlFor={"q1-option2"+"checkin"+checkinData.id}>
                        Disagree
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question1" id={"q1-option3"+"checkin"+checkinData.id} value="3" required />
                    <label className="form-check-label" htmlFor={"q1-option3"+"checkin"+checkinData.id}>
                        Neutral
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question1" id={"q1-option4"+"checkin"+checkinData.id} value="4" required />
                    <label className="form-check-label" htmlFor={"q1-option4"+"checkin"+checkinData.id}>
                        Agree
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question1" id={"q1-option5"+"checkin"+checkinData.id} value="5" required />
                    <label className="form-check-label" htmlFor={"q1-option5"+"checkin"+checkinData.id}>
                        Strongly Agree
                    </label>
                    </div>
                </div>
                </div>

                <div className="mb-4">
                <label className="form-label">
                    <h5>2. I was productive.</h5>
                </label>
                <div className="d-flex flex-column flex-md-row justify-content-between">
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question2" id={"q2-option1"+"checkin"+checkinData.id} value="1" required />
                    <label className="form-check-label" htmlFor={"q2-option1"+"checkin"+checkinData.id}>
                        Strongly Disagree
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question2" id={"q2-option2"+"checkin"+checkinData.id} value="2" required />
                    <label className="form-check-label" htmlFor={"q2-option2"+"checkin"+checkinData.id}>
                        Disagree
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question2" id={"q2-option3"+"checkin"+checkinData.id} value="3" required />
                    <label className="form-check-label" htmlFor={"q2-option3"+"checkin"+checkinData.id}>
                        Neutral
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question2" id={"q2-option4"+"checkin"+checkinData.id} value="4" required />
                    <label className="form-check-label" htmlFor={"q2-option4"+"checkin"+checkinData.id}>
                        Agree
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question2" id={"q2-option5"+"checkin"+checkinData.id} value="5" required />
                    <label className="form-check-label" htmlFor={"q2-option5"+"checkin"+checkinData.id}>
                        Strongly Agree
                    </label>
                    </div>
                </div>
                </div>

                <div className="mb-4">
                <label className="form-label">
                    <h5>3. I finished my tasks for the day without procrastinating.</h5>
                </label>
                <div className="d-flex flex-column flex-md-row justify-content-between">
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question3" id={"q3-option1"+"checkin"+checkinData.id} value="1" required />
                    <label className="form-check-label" htmlFor={"q3-option1"+"checkin"+checkinData.id}>
                        Strongly Disagree
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question3" id={"q3-option2"+"checkin"+checkinData.id} value="2" required />
                    <label className="form-check-label" htmlFor={"q3-option2"+"checkin"+checkinData.id}>
                        Disagree
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question3" id={"q3-option3"+"checkin"+checkinData.id} value="3" required />
                    <label className="form-check-label" htmlFor={"q3-option3"+"checkin"+checkinData.id}>
                        Neutral
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question3" id={"q3-option4"+"checkin"+checkinData.id} value="4" required />
                    <label className="form-check-label" htmlFor={"q3-option4"+"checkin"+checkinData.id}>
                        Agree
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="question3" id={"q3-option5"+"checkin"+checkinData.id} value="5" required />
                    <label className="form-check-label" htmlFor={"q3-option5"+"checkin"+checkinData.id}>
                        Strongly Agree
                    </label>
                    </div>
                </div>
                </div>

                {/* Optional Comment Section */}
                <div className="mb-4">
                <label htmlFor="comment" className="form-label"><h5>Optional Comments:</h5></label>
                <textarea className="form-control" id="comment" name="comment" rows="4" placeholder="Leave a comment (optional)"></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <hr className="my-4" />
        </div>
    );
}
