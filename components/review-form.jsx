"use client";

import { createSupabaseClientWithClerk } from './supabase';
import { useSession } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ReviewForm({ reviewData }) {

  // Clerk session & supabase client
  const { session, isLoaded } = useSession();
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [databaseLoaded, setDatabaseLoaded] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [fatalError, setFatalError] = useState(false);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [formData, setFormData] = useState({
      question1: '',
      comment: '',
  });
    
  const handleSubmit = (event) => {
      event.preventDefault(); // Prevent page reload on form submit

      // Extract form data
      const form = event.target;
      const formValues = {
          question1: form.question1.value,
          comment: form.comment.value,
      };
      uploadForm(formValues);

      console.log("Form submitted with values: ", formValues);
  };

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
  };

  // insert identification into supabase
  async function uploadForm(formValues) {
      const { data, error } = await supabaseClient.rpc('update_review', {
          p_id: reviewData.id,
          p_rating: formValues.question1,
          p_comment: formValues.comment
        });
      if (error) {
          console.error('Error updating review:', error);
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
              console.log('Exception while loading database of review form:', e);
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
      <p className="custom-card-text-checkin">On <strong>{reviewData.date}</strong>:</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label">
            <h5>The chatbot's suggestions were effective and relevant for my concerns at the time.</h5>
          </label>
          <div className="d-flex flex-column flex-md-row justify-content-between">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question1" id="q1-option1" value="1" required />
              <label className="form-check-label" htmlFor="q1-option1">
                Strongly Disagree
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question1" id="q1-option2" value="2" required />
              <label className="form-check-label" htmlFor="q1-option2">
                Disagree
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question1" id="q1-option3" value="3" required />
              <label className="form-check-label" htmlFor="q1-option3">
                Neutral
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question1" id="q1-option4" value="4" required />
              <label className="form-check-label" htmlFor="q1-option4">
                Agree
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question1" id="q1-option5" value="5" required />
              <label className="form-check-label" htmlFor="q1-option5">
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
    </div>
  );
}
