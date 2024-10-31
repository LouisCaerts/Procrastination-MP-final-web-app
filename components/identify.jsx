"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useData } from './data-context';
import { useRouter } from 'next/navigation';
import { createSupabaseClientWithClerk } from './supabase';
import { useSession } from '@clerk/nextjs'

export function Identify() {
    /* Supabase client */
    const [supabaseClient, setSupabaseClient] = useState(null);
    const { session, isLoaded } = useSession();
    const [databaseLoaded, setDatabaseLoaded] = useState(false);
    const [uploadError, setUploadError] = useState(false);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [previousQuestion, setPreviousQuestion] = useState([]);
    const [finalAnswer, setFinalAnswer] = useState("None");
    const [fadeOut, setFadeOut] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const router = useRouter();
    const { setChatId } = useData();

    const questions = [
        {
          question: 'Which of these statements best describes why you think you are procrastinating?',
          answers: [
            { text: "I keep getting distracted by other things when I try to start.", nextQuestion: 1, previousQuestion: 999, finalAnswer: "None" },
            { text: "I feel overwhelmed or stressed just thinking about what I need to do.", nextQuestion: 2, previousQuestion: 999, finalAnswer: "None" },
            { text: "I just don't feel motivated to work on this task.", nextQuestion: 5, previousQuestion: 999, finalAnswer: "None" }
          ]
        },
        {
          question: 'Which statement most resembles you when you get distracted?',
          answers: [
            { text: "I get sidetracked because of my environment (e.g. text messages, background noise, clutter, ...).", nextQuestion: 999, previousQuestion: 0, finalAnswer: "AdaptEnvironment" },
            { text: "I get distracted even when nothing is disturbing me. My mind simply wanders to other things.", nextQuestion: 999, previousQuestion: 0, finalAnswer: "ImplementationIntention" }
          ]
        },
        {
          question: 'Which of these sentences best describes your struggle when trying to start?',
          answers: [
            { text: "The work doesn't feel manageable and/or just too overwhelming.", nextQuestion: 3, previousQuestion: 0, finalAnswer: "None" },
            { text: "I am too critical of myself, so it is easier to put it off.", nextQuestion: 4, previousQuestion: 0, finalAnswer: "None" }
          ]
        },
        {
          question: 'Lastly, please select which of these things is making you feel most overwhelmed.',
          answers: [
            { text: "Not knowing how to approach the task.", nextQuestion: 999, previousQuestion: 2, finalAnswer: "GoalIntentions" },
            { text: "Frustration with how much work is left to do.", nextQuestion: 999, previousQuestion: 2, finalAnswer: "FocusOnProcess" }
          ]
        },
        {
          question: 'Lastly, please select the sentiment that best describes your self-criticism.',
          answers: [
            { text: "I feel guilty for procrastinating, which only makes me procrastinate more.", nextQuestion: 999, previousQuestion: 2, finalAnswer: "SelfForgiveness" },
            { text: "I feel ashamed or overly perfectionistic while working on this, which makes it hard to even start.", nextQuestion: 999, previousQuestion: 2, finalAnswer: "SelfCompassion" },
            { text: "I expect to strongly dislike the work ahead, which makes me put it off.", nextQuestion: 999, previousQuestion: 2, finalAnswer: "PredictFutureEmotions" }
          ]
        },
        {
          question: 'What would you say best describes your current state?',
          answers: [
            { text: "I am procrastinating because I don't see the point in the work.", nextQuestion: 999, previousQuestion: 0, finalAnswer: "EstablishMeaning" },
            { text: "I am avoiding the work because I just don't feel like it right now.", nextQuestion: 999, previousQuestion: 0, finalAnswer: "DurationEstimation" }
          ]
        }
    ];

    const handleAnswerSelect = (nextQuestion, finalAnswer) => {
        setFadeOut(true);  // Trigger fade-out

        setFinalAnswer(finalAnswer);
    
        // After fade-out completes, update the question and trigger fade-in
        setTimeout(() => {
          setPreviousQuestion([...previousQuestion, currentQuestion]);
          setCurrentQuestion(nextQuestion);
          setFadeOut(false);
          setFadeIn(true);
          
          // Delay fade-in effect to match transition
          setFadeIn(false);
        }, 500);  // Match the CSS transition duration for fade-out
    };

    const handleReturn = () => {
        if (previousQuestion.length == 0) router.push('/');

        setFadeOut(true);

        setFinalAnswer("None")

        setTimeout(() => {
            setCurrentQuestion(previousQuestion[previousQuestion.length-1])
            setPreviousQuestion(previousQuestion.slice(0, -1));
            setFadeOut(false)
            setFadeIn(true)

            setFadeIn(false);
        }, 500);
    };

    useEffect(() => {
        if (currentQuestion >= questions.length && finalAnswer != "None" && databaseLoaded) {
            uploadResult();
        }
        else if (currentQuestion >= questions.length && finalAnswer != "None" && !databaseLoaded) {
            setUploadError(true);
        }
    }, [currentQuestion, questions.length, finalAnswer, databaseLoaded]);

    // insert identification into supabase
    async function uploadResult(result) {
        let interv = await selectIntervention(finalAnswer);
        const { data, error } = await supabaseClient.from('chat').insert({ identification: finalAnswer, intervention: interv, reviewed: false, quick_selected: false }).select('id')
        if (error) {
            console.error('Error inserting new chat:', error);
            setUploadError(true);
        }
    
        if (data && data.length > 0 && data[0].id) {
            console.log("NEW CHAT ID = ", data[0].id)
            const { data2, error2 } = await supabaseClient.from('review').insert({ chat_id: data[0].id })
            if (error2) {
                console.error('Error inserting new review:', error);
                setUploadError(true);
            }
            setChatId(data[0]);
            handleNavigate();
        }
    }

    async function selectIntervention(trueresult) {
        var switchdate = '';
        const currentdate = new Date();
        var newresult = '';

        const { data, error } = await supabaseClient
        .from('user')
        .select('switched_at, group');
        const usergroup = data[0].group;
        switchdate = new Date(data[0].switched_at);
        if (!error) {
            if (data.length == 0) { return null; }
            else {
                console.log("User entity loaded!");
                if ((usergroup == 'A' && currentdate > switchdate) || (usergroup == 'B' && currentdate <= switchdate)) {
                    const choiceoptions = ["FocusOnProcess", "DurationEstimation", "SelfForgiveness", "SelfCompassion"];
                    while (newresult == '' || newresult == trueresult) {
                        
                        console.log(newresult);
                        let randomIndex = Math.floor(Math.random() * choiceoptions.length);
                        newresult = choiceoptions[randomIndex];
                    }
                    return newresult;
                } else {
                    return trueresult;
                }
            }
        } else {
            console.error("Unable to retrieve last user entity.");
            return null;
        }
    }

    const handleNavigate = () => {
        const timer = setTimeout(() => {
            router.push('/chat');
        }, 1000);

        // Clean up the timer if the component unmounts
        return () => clearTimeout(timer);
    };

    const handleReset = () => {
        router.push('/');
    };

    

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
                console.log('Exception while fetching todos:', e);
            }
        }
        loadDatabase();
    }, [isLoaded]);

    // Page loading ( 2: load identification )
    useEffect(() => {
        if (databaseLoaded) {
            console.log("DATABASE LOADED")
        }
    }, [databaseLoaded]);

    if (uploadError) {
        return (
          <div className="d-flex flex-column align-items-center justify-content-center w-100 custom-grow text-center">
            <p>Error uploading your result to the database.</p>
            <p>Please return to the home screen and try again.</p>
            <Link href="/" className="inline-block px-1.5 py-1 transition hover:opacity-80 sm:px-3 sm:py-2" >
                <button className="" onClick={handleReset}>
                    <i className="bi bi-house custom-icon-normal align-self-start"></i>
                </button>
            </Link>
          </div>
        );
    }

    return (
        <div className="d-flex flex-row w-100 h-100 custom-grow py-4 px-4 justify-content-center">

            <div className="d-flex flex-column col-8 justify-content-center text-center">

                <div className={`custom-question ${fadeOut ? 'fade-out' : ''} ${fadeIn ? 'fade-in' : ''}`}>
                    {currentQuestion !== null && currentQuestion < questions.length ? (
                        <>
                        <h2>{questions[currentQuestion].question}</h2>

                        <br />

                        <div className="d-flex flex-column">
                            {questions[currentQuestion].answers.map((answer, index) => (
                                <button className="custom-button-small px-5" key={index} onClick={() => handleAnswerSelect(answer.nextQuestion, answer.finalAnswer)}>
                                {answer.text}
                                </button>
                            ))}
                        </div>

                        <br />

                        <button className="custom-button-invisible" onClick={() => handleReturn()}>
                            <i className="bi bi-arrow-left" style={{ fontSize: '50px' }}></i>
                        </button>
                        
                        </>
                    ) : (
                        <>
                            <h2>All done! Redirecting to the chat bot...</h2>

                            <br />

                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </>
                    )}
                </div>

            </div>

        </div>
    );
}