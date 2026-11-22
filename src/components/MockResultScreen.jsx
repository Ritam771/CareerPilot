
import React, { useEffect, useMemo, useState } from "react";
import { getAttemptResult } from "../services/attemptService";

// ==========================================
// HELPERS
// ==========================================

const getStatusClass = (status) => {
    switch (status) {
        case "CORRECT":
            return "correct";

        case "WRONG":
            return "wrong";

        default:
            return "unattempted";
    }
};

const MockResultScreen = ({ attemptId, onBack }) => {

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeFilter, setActiveFilter] = useState("ALL");

    // ==========================================
    // FETCH RESULT
    // ==========================================

    useEffect(() => {

        let active = true;

        const fetchResult = async () => {

            setLoading(true);
            setError("");

            try {

                const response = await getAttemptResult(attemptId);

                if (active) {
                    setResult(response);
                }

            } catch (err) {

                console.error("Error fetching attempt result:", err);

                if (active) {

                    const data = err?.response?.data;

                    setError(
                        typeof data === "string"
                            ? data
                            : data?.message ||
                                "Unable to load your result. Please try again."
                    );

                }

            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        };

        fetchResult();

        return () => {
            active = false;
        };

    }, [attemptId]);

    // ==========================================
    // RESULT STATISTICS
    // ==========================================

    const statistics = useMemo(() => {

        if (!result) return null;

        const questions = result.questionResults || [];

        const total = Number(
            result.totalQuestions ?? questions.length
        );

        const correct = Number(
            result.correctAnswers ??
            questions.filter(q => q.answerStatus === "CORRECT").length
        );

        const wrong = Number(
            result.wrongAnswers ??
            questions.filter(q => q.answerStatus === "WRONG").length
        );

        const unattempted = Number(
            result.unattemptedQuestions ??
            questions.filter(q => q.answerStatus === "UNATTEMPTED").length
        );

        const attempted = Number(
            result.totalQuestionsAttempted ?? correct + wrong
        );

        const accuracy = attempted > 0
            ? (correct / attempted) * 100
            : 0;

        const score = Number(result.scorePercentage ?? 0);

        return {
            total,
            correct,
            wrong,
            unattempted,
            attempted,
            accuracy,
            score: Math.max(0, Math.min(100, score))
        };

    }, [result]);

    // ==========================================
    // FILTER QUESTIONS
    // ==========================================

    const filteredQuestions = useMemo(() => {

        if (!result?.questionResults) return [];

        if (activeFilter === "ALL") {
            return result.questionResults;
        }

        return result.questionResults.filter(
            question => question.answerStatus === activeFilter
        );

    }, [result, activeFilter]);

    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading) {

        return (
            <div className="result-loading">
                <div className="loading-spinner"></div>

                <h2>Preparing your performance report...</h2>

                <p>Analysing your answers.</p>

                <style>{styles}</style>
            </div>
        );

    }

    // ==========================================
    // ERROR STATE
    // ==========================================

    if (error || !result || !statistics) {

        return (
            <div className="result-loading">

                <style>{styles}</style>

                <div className="error-card">

                    <div className="error-icon">!</div>

                    <h2>Unable to load results</h2>

                    <p>{error || "Result data is unavailable."}</p>

                    <button
                        className="result-primary-btn"
                        onClick={onBack}
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>
        );

    }

    const {
        total,
        correct,
        wrong,
        unattempted,
        attempted,
        accuracy,
        score
    } = statistics;

    // ==========================================
    // MAIN RESULT DASHBOARD
    // ==========================================

    return (

        <div className="result-page">

            <style>{styles}</style>

            {/* ==================================
                HEADER
            ================================== */}

            <header className="result-header">

                <div className="result-brand">

                    <div className="result-brand-icon">
                        CP
                    </div>

                    <div>
                        <h2>CareerPilot</h2>
                        <span>Performance Report</span>
                    </div>

                </div>

                <button
                    className="dashboard-back-btn"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>

            </header>


            <main className="result-container">

                {/* ==================================
                    SUCCESS BANNER
                ================================== */}

                <section className="result-welcome">

                    <div>

                        <span className="result-eyebrow">
                            MOCK ASSESSMENT COMPLETED
                        </span>

                        <h1>Your Performance Report</h1>

                        <p>
                            Here's a detailed breakdown of your performance.
                        </p>

                    </div>

                    <div className="completed-badge">
                        <span>✓</span>
                        Test Submitted
                    </div>

                </section>


                {/* ==================================
                    SCORE OVERVIEW
                ================================== */}

                <section className="score-overview">

                    <div className="score-main">

                        <div className="score-label">
                            YOUR SCORE
                        </div>

                        <div className="score-value">
                            {score.toFixed(1)}
                            <span>%</span>
                        </div>

                        <p>
                            {result.feedbackMessage ||
                                "Keep practising to improve your performance."}
                        </p>

                        <div className="score-progress-track">

                            <div
                                className="score-progress-fill"
                                style={{
                                    width: `${score}%`
                                }}
                            />

                        </div>

                        <div className="score-progress-labels">
                            <span>0%</span>
                            <span>100%</span>
                        </div>

                    </div>

                    <div className="score-side">

                        <div className="score-side-icon">
                            ★
                        </div>

                        <h3>
                            {score >= 80
                                ? "Excellent Work!"
                                : score >= 60
                                    ? "Good Performance!"
                                    : score >= 40
                                        ? "Keep Improving!"
                                        : "More Practice Needed"}
                        </h3>

                        <p>
                            Every attempt brings you closer to your placement goals.
                        </p>

                    </div>

                </section>


                {/* ==================================
                    STATISTIC CARDS
                ================================== */}

                <section className="statistics-grid">

                    <div className="stat-card">

                        <div className="stat-icon blue-icon">
                            Q
                        </div>

                        <span>Total Questions</span>

                        <strong>{total}</strong>

                        <small>Questions in this mock</small>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon cyan-icon">
                            ✓
                        </div>

                        <span>Attempted</span>

                        <strong>{attempted}</strong>

                        <small>Questions answered</small>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon green-icon">
                            ✓
                        </div>

                        <span>Correct Answers</span>

                        <strong>{correct}</strong>

                        <small>Correct responses</small>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon red-icon">
                            ✕
                        </div>

                        <span>Wrong Answers</span>

                        <strong>{wrong}</strong>

                        <small>Incorrect responses</small>

                    </div>

                </section>


                {/* ==================================
                    PERFORMANCE ANALYTICS
                ================================== */}

                <section className="analytics-grid">

                    {/* DONUT CHART */}

                    <div className="analytics-card">

                        <div className="section-heading">

                            <div>
                                <h2>Answer Analysis</h2>

                                <p>
                                    Distribution of your responses
                                </p>
                            </div>

                        </div>

                        <div className="donut-layout">

                            <div
                                className="donut-chart"
                                style={{
                                    background: `conic-gradient(
                                        #16a34a 0% ${total ? correct / total * 100 : 0}%,
                                        #ef4444 ${total ? correct / total * 100 : 0}% ${total ? (correct + wrong) / total * 100 : 0}%,
                                        #cbd5e1 ${total ? (correct + wrong) / total * 100 : 0}% 100%
                                    )`
                                }}
                            >

                                <div className="donut-inner">

                                    <strong>{attempted}</strong>

                                    <span>Attempted</span>

                                </div>

                            </div>

                            <div className="chart-legend">

                                <div>
                                    <span className="legend-color green-color"></span>

                                    <span>Correct</span>

                                    <strong>{correct}</strong>
                                </div>

                                <div>
                                    <span className="legend-color red-color"></span>

                                    <span>Wrong</span>

                                    <strong>{wrong}</strong>
                                </div>

                                <div>
                                    <span className="legend-color gray-color"></span>

                                    <span>Unanswered</span>

                                    <strong>{unattempted}</strong>
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ACCURACY ANALYSIS */}

                    <div className="analytics-card">

                        <div className="section-heading">

                            <div>
                                <h2>Accuracy Analysis</h2>

                                <p>
                                    Correct answers among attempted questions
                                </p>
                            </div>

                        </div>

                        <div className="accuracy-value">
                            {accuracy.toFixed(1)}%
                        </div>

                        <div className="accuracy-track">

                            <div
                                className="accuracy-fill"
                                style={{
                                    width: `${accuracy}%`
                                }}
                            />

                        </div>

                        <div className="accuracy-details">

                            <div>
                                <span>Correct</span>
                                <strong>{correct}</strong>
                            </div>

                            <div>
                                <span>Incorrect</span>
                                <strong>{wrong}</strong>
                            </div>

                            <div>
                                <span>Attempted</span>
                                <strong>{attempted}</strong>
                            </div>

                        </div>

                        <div className="accuracy-note">
                            Accuracy = Correct Answers ÷ Attempted Questions × 100
                        </div>

                    </div>

                </section>


                {/* ==================================
                    QUESTION-WISE REVIEW
                ================================== */}

                <section className="review-section">

                    <div className="review-heading">

                        <div>
                            <h2>Question-wise Analysis</h2>

                            <p>
                                Review your answers and learn from your mistakes.
                            </p>
                        </div>

                        <span className="review-total">
                            {total} Questions
                        </span>

                    </div>


                    {/* FILTER BUTTONS */}

                    <div className="review-filters">

                        {[
                            { label: "All Questions", value: "ALL", count: total },
                            { label: "Correct", value: "CORRECT", count: correct },
                            { label: "Wrong", value: "WRONG", count: wrong },
                            { label: "Unanswered", value: "UNATTEMPTED", count: unattempted }
                        ].map((filter) => (

                            <button
                                key={filter.value}
                                onClick={() => setActiveFilter(filter.value)}
                                className={`review-filter ${
                                    activeFilter === filter.value
                                        ? "active-review-filter"
                                        : ""
                                }`}
                            >

                                {filter.label}

                                <span>{filter.count}</span>

                            </button>

                        ))}

                    </div>


                    {/* QUESTIONS */}

                    <div className="question-review-list">

                        {filteredQuestions.map((question, index) => {

                            const status = question.answerStatus;

                            const statusClass = getStatusClass(status);

                            return (

                                <article
                                    key={question.questionId}
                                    className="review-question-card"
                                >

                                    {/* QUESTION HEADER */}

                                    <div className="review-question-header">

                                        <div className="review-question-number">
                                            Question {question.questionNumber ?? index + 1}
                                        </div>

                                        <span className={`answer-status ${statusClass}`}>
                                            {status === "CORRECT"
                                                ? "✓ Correct"
                                                : status === "WRONG"
                                                    ? "✕ Incorrect"
                                                    : "Not Attempted"}
                                        </span>

                                    </div>


                                    {/* QUESTION TEXT */}

                                    <h3 className="review-question-text">
                                        {question.questionText}
                                    </h3>


                                    {/* OPTIONS */}

                                    <div className="review-options">

                                        {(question.options || []).map((option, optionIndex) => {

                                            const isSelected =
                                                String(option.optionId) ===
                                                String(question.selectedOptionId);

                                            const isCorrect = option.correct;

                                            let optionClass = "";

                                            if (isCorrect) {
                                                optionClass = "review-option-correct";
                                            } else if (isSelected) {
                                                optionClass = "review-option-wrong";
                                            }

                                            return (

                                                <div
                                                    key={option.optionId}
                                                    className={`review-option ${optionClass}`}
                                                >

                                                    <span className="review-option-letter">
                                                        {String.fromCharCode(65 + optionIndex)}
                                                    </span>

                                                    <span className="review-option-text">
                                                        {option.optionText}
                                                    </span>

                                                    <div className="review-option-labels">

                                                        {isCorrect && (
                                                            <span className="correct-option-label">
                                                                Correct Answer
                                                            </span>
                                                        )}

                                                        {isSelected && !isCorrect && (
                                                            <span className="wrong-option-label">
                                                                Your Answer
                                                            </span>
                                                        )}

                                                        {isSelected && isCorrect && (
                                                            <span className="correct-option-label">
                                                                Your Answer
                                                            </span>
                                                        )}

                                                    </div>

                                                </div>

                                            );

                                        })}

                                    </div>


                                    {/* ANSWER SUMMARY */}

                                    <div className="answer-summary">

                                        <div>
                                            <span>Your Answer</span>

                                            <strong>
                                                {question.selectedOptionId != null
                                                    ? (
                                                        question.options?.find(
                                                            option =>
                                                                String(option.optionId) ===
                                                                String(question.selectedOptionId)
                                                        )?.optionText || "Selected"
                                                    )
                                                    : "Not Attempted"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Correct Answer</span>

                                            <strong className="correct-answer-text">

                                                {question.options?.find(
                                                    option => option.correct
                                                )?.optionText || "Not available"}

                                            </strong>
                                        </div>

                                    </div>


                                    {/* EXPLANATION */}

                                    {question.explanation && (

                                        <div className="explanation-box">

                                            <strong>
                                                Explanation
                                            </strong>

                                            <p>
                                                {question.explanation}
                                            </p>

                                        </div>

                                    )}

                                </article>

                            );

                        })}

                        {filteredQuestions.length === 0 && (

                            <div className="empty-review">
                                No questions found in this category.
                            </div>

                        )}

                    </div>

                </section>


                {/* ==================================
                    BOTTOM ACTION
                ================================== */}

                <section className="result-footer">

                    <div>

                        <h2>Ready for your next challenge?</h2>

                        <p>
                            Keep practising and track your progress with CareerPilot.
                        </p>

                    </div>

                    <button
                        className="result-primary-btn"
                        onClick={onBack}
                    >
                        Back to Mock Dashboard →
                    </button>

                </section>

            </main>

        </div>

    );

};


// ==========================================
// STYLES
// ==========================================

const styles = `

* {
    box-sizing: border-box;
}

.result-page {
    min-height: 100vh;
    background: #f4f7fb;
    color: #172033;
    font-family: Inter, Arial, sans-serif;
    padding-bottom: 40px;
}

.result-header {
    min-height: 82px;
    background: #ffffff;
    padding: 15px 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5eaf1;
    gap: 20px;
}

.result-brand {
    display: flex;
    align-items: center;
    gap: 13px;
}

.result-brand-icon {
    width: 43px;
    height: 43px;
    border-radius: 12px;
    background: #2563eb;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 800;
}

.result-brand h2 {
    font-size: 19px;
    margin: 0;
    color: #1e40af;
}

.result-brand span {
    display: block;
    font-size: 11px;
    margin-top: 3px;
    color: #64748b;
}

.dashboard-back-btn {
    padding: 11px 17px;
    background: white;
    border: 1px solid #dbe2ea;
    color: #334155;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
}

.dashboard-back-btn:hover {
    background: #f1f5f9;
}

.result-container {
    max-width: 1250px;
    margin: 35px auto;
    padding: 0 25px;
}

.result-welcome {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 27px;
}

.result-eyebrow {
    color: #2563eb;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.5px;
}

.result-welcome h1 {
    font-size: 30px;
    margin: 9px 0;
    color: #172033;
}

.result-welcome p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
}

.completed-badge {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 11px 16px;
    background: #dcfce7;
    color: #15803d;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
}

.completed-badge span {
    font-size: 17px;
}

.score-overview {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 25px;
    background: #ffffff;
    border: 1px solid #e5eaf1;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 5px 20px rgba(15, 23, 42, 0.035);
}

.score-main {
    padding-right: 30px;
    border-right: 1px solid #e5eaf1;
}

.score-label {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: #64748b;
}

.score-value {
    margin: 12px 0;
    font-size: 58px;
    font-weight: 800;
    letter-spacing: -2px;
    color: #2563eb;
}

.score-value span {
    font-size: 28px;
    margin-left: 4px;
}

.score-main p {
    color: #64748b;
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 25px;
}

.score-progress-track,
.accuracy-track {
    width: 100%;
    height: 10px;
    border-radius: 20px;
    background: #e2e8f0;
    overflow: hidden;
}

.score-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2563eb, #06b6d4);
    border-radius: 20px;
    transition: width 0.5s ease;
}

.score-progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #94a3b8;
    margin-top: 9px;
}

.score-side {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 15px;
}

.score-side-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: #eff6ff;
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
}

.score-side h3 {
    font-size: 19px;
    margin: 15px 0 8px;
}

.score-side p {
    max-width: 270px;
    font-size: 13px;
    line-height: 1.6;
    color: #64748b;
}

.statistics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 17px;
    margin: 25px 0;
}

.stat-card {
    background: white;
    border: 1px solid #e5eaf1;
    border-radius: 13px;
    padding: 21px;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.025);
}

.stat-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-weight: 800;
    margin-bottom: 16px;
}

.blue-icon {
    background: #dbeafe;
    color: #2563eb;
}

.cyan-icon {
    background: #cffafe;
    color: #0891b2;
}

.green-icon {
    background: #dcfce7;
    color: #15803d;
}

.red-icon {
    background: #fee2e2;
    color: #dc2626;
}

.stat-card > span {
    display: block;
    font-size: 12px;
    color: #64748b;
}

.stat-card > strong {
    display: block;
    font-size: 30px;
    margin: 8px 0;
    color: #172033;
}

.stat-card small {
    color: #94a3b8;
    font-size: 11px;
}

.analytics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 35px;
}

.analytics-card {
    background: white;
    border: 1px solid #e5eaf1;
    border-radius: 14px;
    padding: 25px;
}

.section-heading h2 {
    margin: 0;
    font-size: 17px;
}

.section-heading p {
    margin: 7px 0 0;
    font-size: 12px;
    color: #94a3b8;
}

.donut-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 35px;
    padding: 30px 0 10px;
    flex-wrap: wrap;
}

.donut-chart {
    width: 175px;
    height: 175px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.donut-inner {
    width: 115px;
    height: 115px;
    background: white;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.donut-inner strong {
    font-size: 29px;
    color: #172033;
}

.donut-inner span {
    color: #94a3b8;
    font-size: 11px;
}

.chart-legend {
    display: flex;
    flex-direction: column;
    gap: 17px;
    min-width: 145px;
}

.chart-legend > div {
    display: grid;
    grid-template-columns: 12px 1fr auto;
    gap: 9px;
    align-items: center;
    font-size: 12px;
    color: #64748b;
}

.chart-legend strong {
    color: #172033;
}

.legend-color {
    width: 11px;
    height: 11px;
    border-radius: 3px;
}

.green-color {
    background: #16a34a;
}

.red-color {
    background: #ef4444;
}

.gray-color {
    background: #cbd5e1;
}

.accuracy-value {
    font-size: 43px;
    font-weight: 800;
    color: #16a34a;
    margin: 28px 0 18px;
}

.accuracy-fill {
    height: 100%;
    background: linear-gradient(90deg, #16a34a, #4ade80);
    border-radius: 20px;
    transition: width 0.5s ease;
}

.accuracy-details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 24px;
}

.accuracy-details div {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.accuracy-details span {
    color: #94a3b8;
    font-size: 11px;
}

.accuracy-details strong {
    font-size: 18px;
}

.accuracy-note {
    margin-top: 23px;
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
    font-size: 11px;
    color: #64748b;
}

.review-section {
    margin-top: 40px;
}

.review-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.review-heading h2 {
    font-size: 21px;
    margin: 0;
}

.review-heading p {
    color: #64748b;
    font-size: 13px;
    margin: 7px 0 0;
}

.review-total {
    padding: 8px 13px;
    background: #e0edff;
    color: #1d4ed8;
    font-size: 12px;
    font-weight: 700;
    border-radius: 8px;
}

.review-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

.review-filter {
    border: 1px solid #dbe2ea;
    border-radius: 8px;
    padding: 10px 13px;
    background: white;
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    gap: 9px;
    align-items: center;
}

.review-filter span {
    background: #f1f5f9;
    padding: 3px 7px;
    border-radius: 5px;
}

.active-review-filter {
    background: #2563eb;
    border-color: #2563eb;
    color: white;
}

.active-review-filter span {
    background: rgba(255,255,255,0.2);
    color: white;
}

.question-review-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.review-question-card {
    background: white;
    border: 1px solid #e5eaf1;
    border-radius: 13px;
    padding: 25px;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.025);
}

.review-question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 19px;
}

.review-question-number {
    font-size: 12px;
    color: #2563eb;
    font-weight: 800;
    letter-spacing: 0.5px;
}

.answer-status {
    padding: 7px 11px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
}

.answer-status.correct {
    background: #dcfce7;
    color: #15803d;
}

.answer-status.wrong {
    background: #fee2e2;
    color: #dc2626;
}

.answer-status.unattempted {
    background: #f1f5f9;
    color: #64748b;
}

.review-question-text {
    font-size: 16px;
    line-height: 1.7;
    margin: 0 0 20px;
    color: #1e293b;
}

.review-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.review-option {
    min-height: 52px;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    padding: 11px 14px;
    display: flex;
    align-items: center;
    gap: 13px;
    background: white;
}

.review-option-letter {
    width: 29px;
    height: 29px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f1f5f9;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
}

.review-option-text {
    flex: 1;
    font-size: 13px;
    line-height: 1.5;
}

.review-option-correct {
    background: #f0fdf4;
    border-color: #86efac;
}

.review-option-correct .review-option-letter {
    background: #16a34a;
    color: white;
}

.review-option-wrong {
    background: #fef2f2;
    border-color: #fca5a5;
}

.review-option-wrong .review-option-letter {
    background: #dc2626;
    color: white;
}

.review-option-labels {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 5px;
}

.correct-option-label,
.wrong-option-label {
    font-size: 10px;
    font-weight: 700;
    white-space: nowrap;
}

.correct-option-label {
    color: #15803d;
}

.wrong-option-label {
    color: #dc2626;
}

.answer-summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 20px;
    padding-top: 18px;
    border-top: 1px solid #e5eaf1;
}

.answer-summary div {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.answer-summary span {
    font-size: 11px;
    color: #94a3b8;
}

.answer-summary strong {
    font-size: 12px;
    line-height: 1.5;
    color: #475569;
}

.answer-summary .correct-answer-text {
    color: #15803d;
}

.explanation-box {
    background: #eff6ff;
    border-left: 3px solid #2563eb;
    padding: 15px;
    margin-top: 19px;
    border-radius: 5px 9px 9px 5px;
}

.explanation-box strong {
    font-size: 12px;
    color: #1d4ed8;
}

.explanation-box p {
    margin: 8px 0 0;
    font-size: 13px;
    line-height: 1.7;
    color: #475569;
}

.empty-review {
    text-align: center;
    padding: 45px;
    background: white;
    border: 1px solid #e5eaf1;
    border-radius: 12px;
    color: #64748b;
}

.result-footer {
    margin-top: 40px;
    background: #172554;
    border-radius: 15px;
    padding: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    color: white;
}

.result-footer h2 {
    margin: 0;
    font-size: 19px;
}

.result-footer p {
    margin: 9px 0 0;
    font-size: 12px;
    color: #bfdbfe;
}

.result-primary-btn {
    background: #2563eb;
    border: none;
    border-radius: 9px;
    padding: 13px 20px;
    color: white;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
}

.result-primary-btn:hover {
    background: #1d4ed8;
}

.result-loading {
    min-height: 100vh;
    background: #f4f7fb;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 25px;
    font-family: Inter, Arial, sans-serif;
}

.loading-spinner {
    width: 45px;
    height: 45px;
    border: 4px solid #dbeafe;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: resultSpin 0.8s linear infinite;
}

@keyframes resultSpin {
    to {
        transform: rotate(360deg);
    }
}

.result-loading h2 {
    margin: 22px 0 7px;
    font-size: 20px;
}

.result-loading p {
    color: #64748b;
    font-size: 13px;
}

.error-card {
    max-width: 430px;
    background: white;
    border-radius: 15px;
    padding: 35px;
    box-shadow: 0 5px 25px rgba(15, 23, 42, 0.07);
}

.error-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #fee2e2;
    color: #dc2626;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    font-weight: 800;
    margin: 0 auto;
}

.error-card button {
    margin-top: 15px;
}

@media (max-width: 900px) {

    .statistics-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .analytics-grid {
        grid-template-columns: 1fr;
    }

}

@media (max-width: 650px) {

    .result-header {
        padding: 15px;
        flex-wrap: wrap;
    }

    .result-container {
        padding: 0 14px;
        margin-top: 22px;
    }

    .result-welcome {
        align-items: flex-start;
        flex-direction: column;
    }

    .result-welcome h1 {
        font-size: 24px;
    }

    .score-overview {
        grid-template-columns: 1fr;
        padding: 22px;
    }

    .score-main {
        padding-right: 0;
        border-right: none;
        border-bottom: 1px solid #e5eaf1;
        padding-bottom: 25px;
    }

    .score-value {
        font-size: 48px;
    }

    .statistics-grid {
        gap: 10px;
    }

    .stat-card {
        padding: 15px;
    }

    .stat-card > strong {
        font-size: 25px;
    }

    .donut-layout {
        gap: 20px;
    }

    .review-heading {
        align-items: flex-start;
        flex-direction: column;
    }

    .review-question-card {
        padding: 17px;
    }

    .review-option {
        flex-wrap: wrap;
    }

    .review-option-labels {
        width: 100%;
        padding-left: 42px;
        justify-content: flex-start;
    }

    .answer-summary {
        grid-template-columns: 1fr;
    }

    .result-footer {
        align-items: flex-start;
        flex-direction: column;
        padding: 23px;
    }

    .result-footer button {
        width: 100%;
    }

}

`;

export default MockResultScreen;
