
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    saveAnswer,
    getSavedAnswers,
    submitAttempt
} from "../services/attemptService";

const LEAVE_WARNING =
    "Your test is still in progress. If you leave now, your attempt will remain active and you can resume it later. Are you sure you want to leave?";

const MockTestScreen = ({ attempt, onBack, onSubmitted }) => {

    // ==========================================
    // 1. STATES
    // ==========================================

    const questions = useMemo(() => {
        return [...(attempt?.questions || [])].sort(
            (a, b) => a.questionOrder - b.questionOrder
        );
    }, [attempt?.questions]);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [savedAnswers, setSavedAnswers] = useState({});

    const [isLoadingAnswers, setIsLoadingAnswers] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [saveMessage, setSaveMessage] = useState("");
    const [saveError, setSaveError] = useState("");
    const [loadError, setLoadError] = useState("");

    const [remainingSeconds, setRemainingSeconds] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [submitError, setSubmitError] = useState("");

    const submittingRef = useRef(false);
    const autoSubmitTriggeredRef = useRef(false);

    const questionTimeSpentRef = useRef({});
    const activeQuestionStartRef = useRef(null);

    // Keep the latest dashboard callback available to browser events.
    const onBackRef = useRef(onBack);

    // Prevent an in-app Back click from triggering a second warning
    // when its corresponding browser history entry is removed.
    const skipPopStateRef = useRef(false);

    useEffect(() => {
        onBackRef.current = onBack;
    }, [onBack]);


    // ==========================================
    // 2. CURRENT QUESTION
    // ==========================================

    const currentQuestion = questions[currentIndex];

    const totalQuestions = questions.length;

    const currentQuestionId = currentQuestion?.questionId;

    const currentSelectedOption =
        selectedAnswers[currentQuestionId];


    // ==========================================
    // 3. RESET WHEN A NEW ATTEMPT STARTS
    // ==========================================

    useEffect(() => {

        setCurrentIndex(0);

        setSelectedAnswers({});
        setSavedAnswers({});

        setIsLoadingAnswers(true);

        setRemainingSeconds(null);

        setSubmissionResult(null);
        setSubmitError("");

        setSaveMessage("");
        setSaveError("");
        setLoadError("");

        submittingRef.current = false;
        autoSubmitTriggeredRef.current = false;

        questionTimeSpentRef.current = {};
        activeQuestionStartRef.current = null;

    }, [attempt?.attemptId]);


    // ==========================================
    // 4. FETCH PREVIOUSLY SAVED ANSWERS
    // ==========================================

    useEffect(() => {

        if (!attempt?.attemptId) return;

        let active = true;

        const fetchAnswers = async () => {

            setIsLoadingAnswers(true);
            setLoadError("");

            try {

                const response = await getSavedAnswers(
                    attempt.attemptId
                );

                if (!active) return;

                const savedMap = {};
                const selectedMap = {};

                const answers = Array.isArray(response)
                    ? response
                    : [];

                answers.forEach((answer) => {

                    savedMap[answer.questionId] =
                        answer.selectedOptionId;

                    if (answer.selectedOptionId != null) {

                        selectedMap[answer.questionId] =
                            answer.selectedOptionId;

                    }

                });

                setSavedAnswers(savedMap);
                setSelectedAnswers(selectedMap);

            } catch (error) {

                if (active) {

                    console.error(
                        "Error fetching saved answers:",
                        error
                    );

                    setLoadError(
                        "Could not load previously saved answers. Please refresh and try again."
                    );

                }

            } finally {

                if (active) {
                    setIsLoadingAnswers(false);
                }

            }

        };

        fetchAnswers();

        return () => {
            active = false;
        };

    }, [attempt?.attemptId]);


    // ==========================================
    // 5. WARN BEFORE REFRESH OR TAB CLOSE
    // ==========================================

    useEffect(() => {

        if (!attempt?.attemptId || submissionResult) {
            return;
        }

        const handleBeforeUnload = (event) => {

            if (isSubmitting || submissionResult) {
                return;
            }

            event.preventDefault();

            // Modern browsers display their own warning text.
            event.returnValue = "";

        };

        window.addEventListener(
            "beforeunload",
            handleBeforeUnload
        );

        return () => {

            window.removeEventListener(
                "beforeunload",
                handleBeforeUnload
            );

        };

    }, [
        attempt?.attemptId,
        isSubmitting,
        submissionResult
    ]);


    // ==========================================
    // 6. WARN WHEN BROWSER BACK IS PRESSED
    // ==========================================

    useEffect(() => {

        if (!attempt?.attemptId || submissionResult) {
            return;
        }

        // Add a history entry so browser Back can be intercepted.
        window.history.pushState(
            {
                mockTestGuard: true,
                attemptId: attempt.attemptId
            },
            "",
            window.location.href
        );

        const handlePopState = () => {

            // This popstate was caused by our own in-app Back button.
            if (skipPopStateRef.current) {

                skipPopStateRef.current = false;
                return;

            }

            const shouldLeave = window.confirm(LEAVE_WARNING);

            if (shouldLeave) {

                // The browser Back action has already moved back.
                // Return to the dashboard without submitting the attempt.
                onBackRef.current?.();

            } else {

                // User cancelled. Put the guard entry back.
                window.history.pushState(
                    {
                        mockTestGuard: true,
                        attemptId: attempt.attemptId
                    },
                    "",
                    window.location.href
                );

            }

        };

        window.addEventListener(
            "popstate",
            handlePopState
        );

        return () => {

            window.removeEventListener(
                "popstate",
                handlePopState
            );

        };

    }, [
        attempt?.attemptId,
        submissionResult
    ]);


    // ==========================================
    // 7. IN-APP BACK BUTTON
    // ==========================================

    const handleBack = useCallback(() => {

        // Once submitted, leaving the result screen needs no warning.
        if (submissionResult) {

            onBackRef.current?.();
            return;

        }

        const shouldLeave = window.confirm(LEAVE_WARNING);

        if (!shouldLeave) {
            return;
        }

        // Remove the history guard entry without displaying
        // the browser Back warning a second time.
        skipPopStateRef.current = true;

        window.history.back();

        // Return to dashboard. The backend attempt remains active.
        onBackRef.current?.();

    }, [submissionResult]);


    // ==========================================
    // 8. QUESTION TIME TRACKING
    // ==========================================

    useEffect(() => {

        if (!currentQuestion) return;

        const questionId = currentQuestion.questionId;

        activeQuestionStartRef.current = {
            questionId,
            startedAt: Date.now()
        };

        return () => {

            const active = activeQuestionStartRef.current;

            if (
                active &&
                String(active.questionId) === String(questionId)
            ) {

                const elapsed = Math.floor(
                    (Date.now() - active.startedAt) / 1000
                );

                questionTimeSpentRef.current[questionId] =
                    (questionTimeSpentRef.current[questionId] || 0)
                    + Math.max(0, elapsed);

                activeQuestionStartRef.current = null;

            }

        };

    }, [currentQuestionId]);


    // ==========================================
    // 9. SELECT AN OPTION
    // ==========================================

    const handleOptionSelect = (optionId) => {

        setSelectedAnswers((previous) => ({
            ...previous,
            [currentQuestionId]: Number(optionId)
        }));

        setSaveMessage("");
        setSaveError("");

    };


    // ==========================================
    // 10. SAVE / UPDATE ANSWER IN DATABASE
    // ==========================================

    const handleSave = async () => {

        if (currentSelectedOption == null) {

            setSaveError("Please select an option first.");
            return;

        }

        if (isSaving || isLoadingAnswers) return;

        setIsSaving(true);

        setSaveMessage("");
        setSaveError("");

        const active = activeQuestionStartRef.current;

        const currentTime =
            active &&
            String(active.questionId) === String(currentQuestionId)
                ? Math.floor(
                    (Date.now() - active.startedAt) / 1000
                )
                : 0;

        const timeTakenSeconds =
            (questionTimeSpentRef.current[currentQuestionId] || 0)
            + Math.max(0, currentTime);

        const answerData = {
            questionId: currentQuestionId,
            selectedOptionId: currentSelectedOption,
            timeTakenSeconds
        };

        try {

            await saveAnswer(
                attempt.attemptId,
                answerData
            );

            setSavedAnswers((previous) => ({
                ...previous,
                [currentQuestionId]: currentSelectedOption
            }));

            setSaveMessage("Answer saved successfully!");

        } catch (error) {

            console.error("Error saving answer:", error);

            const data = error?.response?.data;

            setSaveError(
                typeof data === "string"
                    ? data
                    : data?.message ||
                        "Failed to save answer. Please try again."
            );

        } finally {

            setIsSaving(false);

        }

    };


    // ==========================================
    // 11. QUESTION NAVIGATION
    // ==========================================

    const goToQuestion = (index) => {

        if (
            index < 0 ||
            index >= totalQuestions ||
            isSaving ||
            isSubmitting
        ) {
            return;
        }

        setCurrentIndex(index);

        setSaveMessage("");
        setSaveError("");

    };

    const handlePrevious = () => {
        goToQuestion(currentIndex - 1);
    };

    const handleNext = () => {
        goToQuestion(currentIndex + 1);
    };


    // ==========================================
    // 12. QUESTION PALETTE STATUS
    // ==========================================

    const getQuestionStatus = (question) => {

        const id = question.questionId;

        const selected = selectedAnswers[id];
        const saved = savedAnswers[id];

        if (
            selected != null &&
            saved != null &&
            String(selected) === String(saved)
        ) {
            return "saved";
        }

        if (selected != null) {
            return "unsaved";
        }

        if (saved != null) {
            return "saved";
        }

        return "unanswered";

    };

    const unsavedCount = questions.filter(
        (question) => getQuestionStatus(question) === "unsaved"
    ).length;


    // ==========================================
    // 13. TIMER
    // ==========================================

    const expiryTimestamp = attempt?.expiresAt
        ? new Date(attempt.expiresAt).getTime()
        : null;

    useEffect(() => {

        if (
            !Number.isFinite(expiryTimestamp) ||
            submissionResult
        ) {
            return;
        }

        const updateTimer = () => {

            const remaining = Math.max(
                0,
                Math.ceil(
                    (expiryTimestamp - Date.now()) / 1000
                )
            );

            setRemainingSeconds(remaining);

        };

        // Timer is based on the backend expiry time.
        // Resuming does not reset the duration.
        updateTimer();

        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);

    }, [expiryTimestamp, submissionResult]);


    const formatTime = (seconds) => {

        const minutes = Math.floor(seconds / 60);
        const remaining = seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remaining
        ).padStart(2, "0")}`;

    };


    // ==========================================
    // 14. SUBMIT TEST
    // ==========================================

    const handleSubmit = async (automatic = false) => {

        if (
            submittingRef.current ||
            submissionResult
        ) {
            return;
        }

        if (isSaving) {
            return;
        }

        if (!automatic) {

            const message = unsavedCount > 0
                ? `You have ${unsavedCount} unsaved answer(s). They will NOT be included in evaluation.\n\nSubmit the test anyway?`
                : "Are you sure you want to submit your test?";

            if (!window.confirm(message)) return;

        }

        submittingRef.current = true;

        setIsSubmitting(true);
        setSubmitError("");

        try {

            // The backend evaluates saved answers from the database.
            // We send only the attempt ID.

          const result = await submitAttempt({
    attemptId: attempt.attemptId
});

setSubmissionResult(result);

// Notify the parent component that submission was successful.
onSubmitted?.(attempt.attemptId);

        } catch (error) {

            console.error("Error submitting test:", error);

            const data = error?.response?.data;

            setSubmitError(
                typeof data === "string"
                    ? data
                    : data?.message ||
                        "Unable to submit test. Please try again."
            );

            submittingRef.current = false;

        } finally {

            setIsSubmitting(false);

        }

    };


    // ==========================================
    // 15. AUTOMATIC SUBMISSION AFTER EXPIRY
    // ==========================================

    useEffect(() => {

        if (remainingSeconds === null) return;

        if (
            remainingSeconds <= 0 &&
            Number.isFinite(expiryTimestamp) &&
            !submissionResult &&
            !autoSubmitTriggeredRef.current
        ) {

            autoSubmitTriggeredRef.current = true;

            handleSubmit(true);

        }

    }, [
        remainingSeconds,
        expiryTimestamp,
        submissionResult
    ]);


    // ==========================================
    // 16. LOADING / EMPTY STATES
    // ==========================================

    if (!attempt) {
        return (
            <div className="mock-loading">
                Loading test...
            </div>
        );
    }

    if (totalQuestions === 0) {
        return (
            <div className="mock-loading">
                No questions available.
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="mock-loading">
                Preparing your questions...
            </div>
        );
    }


    // ==========================================
    // 17. SUBMISSION RESULT SCREEN
    // ==========================================

    if (submissionResult) {

        return (
            <div className="mock-page">

                <style>{styles}</style>

                <div className="result-card">

                    <div className="result-icon">✓</div>

                    <h1>Test Submitted!</h1>

                    <p>
                        Your answers have been evaluated successfully.
                    </p>

                    <p>
                        Attempt ID: {attempt.attemptId}
                    </p>

                    <button
                        className="primary-btn"
                        onClick={handleBack}
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>
        );

    }


    // ==========================================
    // 18. MAIN UI
    // ==========================================

    const progress =
        ((currentIndex + 1) / totalQuestions) * 100;

    return (

        <div className="mock-page">

            <style>{styles}</style>

            {/* TOP HEADER */}

            <header className="mock-header">

                <div className="brand-section">

                    <button
                        className="back-btn"
                        onClick={handleBack}
                        disabled={isSubmitting}
                    >
                        ← Back
                    </button>

                    <div>
                        <h2>CareerPilot</h2>
                        <span>Mock Assessment</span>
                    </div>

                </div>

                <div className="header-right">

                    <div className="timer-box">

                        <span>TIME REMAINING</span>

                        <strong
                            className={
                                remainingSeconds !== null &&
                                remainingSeconds < 300
                                    ? "timer-danger"
                                    : ""
                            }
                        >
                            {remainingSeconds !== null
                                ? formatTime(remainingSeconds)
                                : "--:--"}
                        </strong>

                    </div>

                    <button
                        className="submit-btn"
                        onClick={() => handleSubmit(false)}
                        disabled={isSubmitting || isSaving}
                    >
                        {isSubmitting
                            ? "Submitting..."
                            : "Submit Test"}
                    </button>

                </div>

            </header>


            {/* PROGRESS */}

            <section className="progress-section">

                <div className="progress-info">

                    <span>
                        Question {currentIndex + 1} of {totalQuestions}
                    </span>

                    <span>
                        {Math.round(progress)}% Completed
                    </span>

                </div>

                <div className="progress-track">

                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />

                </div>

            </section>


            {/* MAIN CONTENT */}

            <main className="mock-layout">

                {/* QUESTION AREA */}

                <section className="question-panel">

                    <div className="question-heading">

                        <span className="question-number">
                            QUESTION {currentIndex + 1}
                        </span>

                        <span className="question-count">
                            {totalQuestions} Questions
                        </span>

                    </div>

                    <h2 className="question-text">
                        {currentQuestion.question}
                    </h2>

                    {isLoadingAnswers && (
                        <p className="info-message">
                            Loading saved answers...
                        </p>
                    )}

                    {loadError && (
                        <p className="error-message">
                            {loadError}
                        </p>
                    )}


                    {/* OPTIONS */}

                    <div className="options-container">

                        {currentQuestion.options.map((option, index) => {

                            const isSelected =
                                String(currentSelectedOption) ===
                                String(option.optionId);

                            return (

                                <button
                                    key={option.optionId}
                                    className={`option-card ${
                                        isSelected ? "option-selected" : ""
                                    }`}
                                    onClick={() =>
                                        handleOptionSelect(option.optionId)
                                    }
                                    disabled={
                                        isLoadingAnswers ||
                                        isSubmitting
                                    }
                                >

                                    <span className="option-letter">
                                        {String.fromCharCode(65 + index)}
                                    </span>

                                    <span className="option-text">
                                        {option.option}
                                    </span>

                                    <span className="option-check">
                                        {isSelected ? "✓" : ""}
                                    </span>

                                </button>

                            );

                        })}

                    </div>


                    {/* SAVE STATUS */}

                    <div className="save-status">

                        {saveMessage && (
                            <span className="success-message">
                                ✓ {saveMessage}
                            </span>
                        )}

                        {saveError && (
                            <span className="error-message">
                                {saveError}
                            </span>
                        )}

                    </div>


                    {/* NAVIGATION BUTTONS */}

                    <div className="question-actions">

                        <button
                            className="secondary-btn"
                            onClick={handlePrevious}
                            disabled={
                                currentIndex === 0 ||
                                isSaving ||
                                isSubmitting
                            }
                        >
                            ← Previous
                        </button>

                        <div className="right-actions">

                            <button
                                className="save-btn"
                                onClick={handleSave}
                                disabled={
                                    isSaving ||
                                    isLoadingAnswers ||
                                    isSubmitting ||
                                    currentSelectedOption == null
                                }
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>

                            <button
                                className="primary-btn"
                                onClick={handleNext}
                                disabled={
                                    currentIndex === totalQuestions - 1 ||
                                    isSaving ||
                                    isSubmitting
                                }
                            >
                                Next →
                            </button>

                        </div>

                    </div>

                </section>


                {/* QUESTION PALETTE */}

                <aside className="palette-panel">

                    <h3>Question Palette</h3>

                    <p className="palette-description">
                        Navigate between questions
                    </p>

                    <div className="question-grid">

                        {questions.map((question, index) => {

                            const status =
                                getQuestionStatus(question);

                            const isCurrent =
                                index === currentIndex;

                            return (

                                <button
                                    key={question.questionId}
                                    className={`palette-item ${
                                        status
                                    } ${
                                        isCurrent ? "current-question" : ""
                                    }`}
                                    onClick={() => goToQuestion(index)}
                                    disabled={isSaving || isSubmitting}
                                >
                                    {index + 1}
                                </button>

                            );

                        })}

                    </div>


                    {/* LEGEND */}

                    <div className="palette-legend">

                        <div>
                            <span className="legend-dot saved-dot" />
                            Answer Saved
                        </div>

                        <div>
                            <span className="legend-dot unsaved-dot" />
                            Unsaved Selection
                        </div>

                        <div>
                            <span className="legend-dot unanswered-dot" />
                            Not Answered
                        </div>

                        <div>
                            <span className="legend-dot current-dot" />
                            Current Question
                        </div>

                    </div>


                    {/* SUMMARY */}

                    <div className="palette-summary">

                        <div>
                            <span>Saved</span>
                            <strong>
                                {
                                    questions.filter(
                                        q => getQuestionStatus(q) === "saved"
                                    ).length
                                }
                            </strong>
                        </div>

                        <div>
                            <span>Unsaved</span>
                            <strong>{unsavedCount}</strong>
                        </div>

                        <div>
                            <span>Unanswered</span>
                            <strong>
                                {
                                    questions.filter(
                                        q => getQuestionStatus(q) === "unanswered"
                                    ).length
                                }
                            </strong>
                        </div>

                    </div>

                </aside>

            </main>


            {/* SUBMISSION STATUS */}

            {(submitError || isSubmitting) && (

                <div className="submission-status">

                    {isSubmitting && "Submitting your test..."}

                    {submitError && (
                        <span className="error-message">
                            {submitError}
                        </span>
                    )}

                </div>

            )}

        </div>

    );

};


// ==========================================
// 19. UI STYLES
// ==========================================

const styles = `

* {
    box-sizing: border-box;
}

.mock-page {
    min-height: 100vh;
    background: #f4f6fb;
    color: #1e293b;
    font-family: Inter, Arial, sans-serif;
}

.mock-header {
    background: white;
    padding: 18px 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    gap: 20px;
}

.brand-section,
.header-right {
    display: flex;
    align-items: center;
    gap: 22px;
}

.brand-section h2 {
    margin: 0;
    font-size: 21px;
    color: #2563eb;
}

.brand-section span {
    color: #64748b;
    font-size: 12px;
}

.back-btn {
    border: none;
    background: transparent;
    color: #475569;
    cursor: pointer;
    font-size: 14px;
}

.timer-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
}

.timer-box span {
    font-size: 10px;
    color: #64748b;
    letter-spacing: 1px;
}

.timer-box strong {
    font-size: 22px;
    color: #16a34a;
}

.timer-box .timer-danger {
    color: #dc2626;
}

.submit-btn {
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 20px;
    font-weight: 600;
    cursor: pointer;
}

.progress-section {
    background: white;
    padding: 18px 5%;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #64748b;
    margin-bottom: 10px;
}

.progress-track {
    width: 100%;
    height: 7px;
    background: #e2e8f0;
    border-radius: 20px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: #2563eb;
    transition: width 0.3s ease;
}

.mock-layout {
    max-width: 1400px;
    margin: 30px auto;
    padding: 0 30px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 290px;
    gap: 24px;
    align-items: start;
}

.question-panel,
.palette-panel {
    background: white;
    border-radius: 14px;
    padding: 28px;
    box-shadow: 0 3px 15px rgba(15, 23, 42, 0.04);
}

.question-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.question-number {
    color: #2563eb;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
}

.question-count {
    color: #64748b;
    font-size: 12px;
}

.question-text {
    margin: 30px 0;
    font-size: 21px;
    line-height: 1.6;
    color: #1e293b;
}

.options-container {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.option-card {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 17px;
    background: white;
    border: 1px solid #dbe2ea;
    border-radius: 10px;
    cursor: pointer;
    text-align: left;
    transition: 0.2s;
}

.option-card:hover {
    border-color: #2563eb;
    background: #f8faff;
}

.option-selected {
    border: 2px solid #2563eb;
    background: #eff6ff;
}

.option-letter {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f1f5f9;
    font-weight: 700;
    color: #475569;
    flex-shrink: 0;
}

.option-selected .option-letter {
    background: #2563eb;
    color: white;
}

.option-text {
    flex: 1;
    font-size: 15px;
}

.option-check {
    color: #2563eb;
    font-size: 19px;
    font-weight: bold;
}

.save-status {
    min-height: 35px;
    padding-top: 12px;
    font-size: 13px;
}

.success-message {
    color: #15803d;
}

.error-message {
    color: #dc2626;
}

.info-message {
    color: #64748b;
    font-size: 13px;
}

.question-actions {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.right-actions {
    display: flex;
    gap: 10px;
}

.primary-btn,
.secondary-btn,
.save-btn {
    padding: 12px 22px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    border: none;
}

.primary-btn {
    background: #2563eb;
    color: white;
}

.save-btn {
    background: #16a34a;
    color: white;
}

.secondary-btn {
    background: #e2e8f0;
    color: #334155;
}

button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.palette-panel h3 {
    margin: 0;
    font-size: 17px;
}

.palette-description {
    font-size: 12px;
    color: #64748b;
    margin: 8px 0 22px;
}

.question-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 11px;
}

.palette-item {
    height: 42px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #f1f5f9;
    color: #475569;
    font-weight: 600;
    cursor: pointer;
}

.palette-item.saved {
    background: #dcfce7;
    border-color: #16a34a;
    color: #166534;
}

.palette-item.unsaved {
    background: #fef3c7;
    border-color: #d97706;
    color: #92400e;
}

.palette-item.current-question {
    outline: 3px solid #2563eb;
    outline-offset: 2px;
}

.palette-legend {
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    gap: 13px;
    font-size: 12px;
    color: #475569;
}

.palette-legend > div {
    display: flex;
    align-items: center;
    gap: 10px;
}

.legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 3px;
}

.saved-dot {
    background: #16a34a;
}

.unsaved-dot {
    background: #d97706;
}

.unanswered-dot {
    background: #cbd5e1;
}

.current-dot {
    background: #2563eb;
}

.palette-summary {
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.palette-summary div {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.result-card {
    max-width: 500px;
    margin: 100px auto;
    padding: 45px 30px;
    background: white;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 5px 25px rgba(15, 23, 42, 0.08);
}

.result-icon {
    width: 65px;
    height: 65px;
    margin: 0 auto 20px;
    border-radius: 50%;
    background: #dcfce7;
    color: #16a34a;
    font-size: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.result-card p {
    color: #64748b;
    margin: 15px 0;
}

.result-card button {
    margin-top: 20px;
}

.submission-status {
    text-align: center;
    padding: 15px;
    color: #475569;
}

.mock-loading {
    padding: 60px;
    text-align: center;
    font-size: 18px;
}

@media (max-width: 850px) {

    .mock-layout {
        grid-template-columns: 1fr;
        padding: 0 15px;
    }

    .palette-panel {
        order: -1;
    }

    .question-grid {
        grid-template-columns: repeat(6, 1fr);
    }

}

@media (max-width: 550px) {

    .mock-header {
        flex-wrap: wrap;
        padding: 15px;
    }

    .header-right {
        width: 100%;
        justify-content: space-between;
    }

    .question-panel,
    .palette-panel {
        padding: 18px;
    }

    .question-text {
        font-size: 18px;
    }

    .question-grid {
        grid-template-columns: repeat(5, 1fr);
    }

    .primary-btn,
    .secondary-btn,
    .save-btn {
        padding: 11px 14px;
        font-size: 12px;
    }

}

`;

export default MockTestScreen;
