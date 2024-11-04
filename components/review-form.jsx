"use client";

import { createSupabaseClientWithClerk } from './supabase';
import { useSession } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ReviewForm({ incrementCount, reviewData }) {

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
  const [messages, setMessages] = useState([]);

  const identifications = {
    "AdaptEnvironment": "I get sidetracked because of my environment (e.g. text messages, background noise, clutter, ...).",
    "ImplementationIntention": "I get distracted even when nothing is disturbing me. My mind simply wanders to other things.",
    "GoalIntentions": "I don't know how to approach the task.",
    "FocusOnProcess": "I get frustrated with how much work is left to do.",
    "SelfForgiveness": "I feel guilty for procrastinating, which only makes me procrastinate more.",
    "SelfCompassion": "I feel ashamed or overly perfectionistic while working on this, which makes it hard to even start.",
    "PredictFutureEmotions": "I expect to strongly dislike the work ahead, which makes me put it off.",
    "EstablishMeaning": "I am procrastinating because I don't see the point in the work.",
    "DurationEstimation": "I am avoiding the work because I just don't feel like it right now."
  };
    
  const handleSubmit = (event) => {
      event.preventDefault(); // Prevent page reload on form submit

      // Extract form data
      const form = event.target;
      const formValues = {
          question1: form.question1.value,
          question2: form.question2.value,
          comment: form.comment.value,
      };
      uploadForm(formValues);

      incrementCount();
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
          p_rating_effective: formValues.question2,
          p_comment: formValues.comment
        });
      if (error) {
          console.error('Error updating review:', error);
          setUploadError(true);
      } else {
          toggleVisibility();
      }
  }

  async function loadData() {
      console.log("Loading review...");

      const { loaded_messages } =  await loadMessages(reviewData.chat_id);
      console.log("ABCDE: ", loaded_messages)
      setMessages(loaded_messages);

      console.log("Review loaded!")
  }

  async function loadMessages(chat_id) {
      const { data, error } = await supabaseClient
      .from('message')
      .select('role,content,isPrompt')
      .eq('chat_id', chat_id)
      .order('send_time', { ascending: true });
      if (!error) {
          console.log("Message entities loaded!");
          return {loaded_messages: data};
      } else {
          console.error("Unable to retrieve message entities.");
          setFatalError(true);
          return {loaded_messages: null};
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
          loadData();
      }
  }, [databaseLoaded]);

  if (!isVisible) return (<></>);

  return (
    <div className="container mt-5">
        <p className="custom-card-text-checkin">On <strong>{reviewData.date}</strong>, you stated:</p>
        <p className="custom-card-text-checkin-2">
            <i>&quot;{identifications[reviewData.identification]}&quot;</i><br />
            <button className='btn btn-secondary' type="button" data-bs-toggle="modal" data-bs-target="#messagesModal">Chat history</button>
        </p>

        <div className="modal fade" id="messagesModal" tabIndex="-1" role="dialog" aria-labelledby="messagesModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="messagesModalLabel">Chat History</h5>
                    <button type="button" className="close custom-button-invisible" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="d-flex flex-column overflow-auto my-3" id="chat-window">
                        {messages.filter(msg => !msg.isPrompt).map((msg, index) => (
                            <div key={index} className={`${msg.role === 'user' ? 'custom-message-user' : 'custom-message-assistant'}`}>
                                <span className="text" style={{ wordBreak: 'break-word' }}>{msg.content}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Back</button>
                </div>
                </div>
            </div>
        </div>







      <br />

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label">
            <h5>The chatbot&apos;s suggestions felt <u>relevant</u>. (The chatbot understood my current situation well.)</h5>
          </label>
          <div className="d-flex flex-column flex-md-row justify-content-between">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question1" id={"q1-option1"+"review"+reviewData.id} value="1" required />
              <label className="form-check-label" htmlFor={"q1-option1"+"review"+reviewData.id}>
                Strongly Disagree
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question1" id={"q1-option2"+"review"+reviewData.id} value="2" required />
              <label className="form-check-label" htmlFor={"q1-option2"+"review"+reviewData.id}>
                Disagree
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question1" id={"q1-option3"+"review"+reviewData.id} value="3" required />
              <label className="form-check-label" htmlFor={"q1-option3"+"review"+reviewData.id}>
                Neutral
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question1" id={"q1-option4"+"review"+reviewData.id} value="4" required />
              <label className="form-check-label" htmlFor={"q1-option4"+"review"+reviewData.id}>
                Agree
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question1" id={"q1-option5"+"review"+reviewData.id} value="5" required />
              <label className="form-check-label" htmlFor={"q1-option5"+"review"+reviewData.id}>
                Strongly Agree
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">
            <h5>The chatbot&apos;s suggestions were <u>effective</u>. (The advice I got helped me stop procrastinating.)</h5>
          </label>
          <div className="d-flex flex-column flex-md-row justify-content-between">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question2" id={"q2-option1"+"review"+reviewData.id} value="1" required />
              <label className="form-check-label" htmlFor={"q2-option1"+"review"+reviewData.id}>
                Strongly Disagree
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question2" id={"q2-option2"+"review"+reviewData.id} value="2" required />
              <label className="form-check-label" htmlFor={"q2-option2"+"review"+reviewData.id}>
                Disagree
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question2" id={"q2-option3"+"review"+reviewData.id} value="3" required />
              <label className="form-check-label" htmlFor={"q2-option3"+"review"+reviewData.id}>
                Neutral
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question2" id={"q2-option4"+"review"+reviewData.id} value="4" required />
              <label className="form-check-label" htmlFor={"q2-option4"+"review"+reviewData.id}>
                Agree
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="question2" id={"q2-option5"+"review"+reviewData.id} value="5" required />
              <label className="form-check-label" htmlFor={"q2-option5"+"review"+reviewData.id}>
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
