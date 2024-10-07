"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useData } from './data-context';
import { useRouter } from 'next/navigation';

export function Identify() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [previousQuestion, setPreviousQuestion] = useState([]);
    const [finalAnswer, setFinalAnswer] = useState("lklklk");
    const [fadeOut, setFadeOut] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const { identifyResult, setIdentifyResult, setChatHistory } = useData();
    const router = useRouter();

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

          if (nextQuestion > questions.length) {
              setChatHistory([]);
          }
          
          // Delay fade-in effect to match transition
          setTimeout(() => {
            setFadeIn(false);
          }, 1000);
        }, 1000);  // Match the CSS transition duration for fade-out
    };

    const handleReturn = () => {
        if (previousQuestion.length == 0) return;

        setFadeOut(true);

        setFinalAnswer("None")

        setTimeout(() => {
            setCurrentQuestion(previousQuestion[previousQuestion.length-1])
            setPreviousQuestion(previousQuestion.slice(0, -1));
            setFadeOut(false)
            setFadeIn(true)

            setTimeout(() => {
                setFadeIn(false);
            }, 1000);
        }, 1000);
    };

    const handleNavigate = () => {
      setIdentifyResult({ value: finalAnswer });
      router.push('/chat');
    };

    useEffect(() => {
        if (currentQuestion >= questions.length) {
            const timer = setTimeout(() => {
                handleNavigate();
            }, 3000);
    
            // Clean up the timer if the component unmounts
            return () => clearTimeout(timer);
        }
    }, [currentQuestion, questions.length]); // Dependencies to run effect

    return (
        <div className="d-flex flex-row w-100 h-100 py-4 px-4 justify-content-center">

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

                        <button className="custom-button-invisible" onClick={() => handleReturn()} disabled={previousQuestion.length === 0}>
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