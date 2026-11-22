
import React, { useCallback, useEffect, useState } from "react";

import {
    startAttempt,
    getActiveAttempt,
    getMockTestStatuses
} from "../services/attemptService";

import MockTestScreen from "../components/MockTestScreen";
import MockResultScreen from "../components/MockResultScreen";

const USER_ID = 1;
const TEST_TYPE = "GENERAL";

const QUESTIONS_PER_TEST = 20;
const TEST_DURATION = "20 min";

// ==========================================
// GENERATE MOCK TESTS
// ==========================================

const createMockTests = (category, categoryKey, categories) => {
    return Array.from({ length: 10 }, (_, index) => {
        const mockNumber = index + 1;

        return {
            id: `${categoryKey}-${mockNumber}`,
            title: `${category} Mock ${mockNumber}`,
            category,
            sourceName: `${categoryKey}_MOCK_${mockNumber}`,
            categories,
            questions: QUESTIONS_PER_TEST,
            duration: TEST_DURATION,
            difficulty: "Mixed"
        };
    });
};

const mockTests = [
    ...createMockTests("Aptitude", "APTITUDE", ["APTITUDE"]),
    ...createMockTests("Reasoning", "REASONING", ["REASONING"]),
    ...createMockTests("Technical", "TECHNICAL", [
        "OS", "DBMS", "JAVA", "PYTHON", "CN", "C", "DSA"
    ]),
    ...createMockTests("English", "ENGLISH", ["ENGLISH"])
];

// ==========================================
// FILTERS
// ==========================================

const filters = [
    "All Tests",
    "Aptitude",
    "Reasoning",
    "Technical",
    "DSA",
    "English"
];

// ==========================================
// ERROR HANDLING
// ==========================================

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data?.message) {
        return data.message;
    }

    return fallback;
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const MockTest = () => {

    const [activeFilter, setActiveFilter] = useState("All Tests");

    // Stores backend status for each predefined mock.
    const [mockStatuses, setMockStatuses] = useState({});

    const [currentAttempt, setCurrentAttempt] = useState(null);
    const [resultAttemptId, setResultAttemptId] = useState(null);

    const [checkingAttempts, setCheckingAttempts] = useState(true);
    const [startingTestId, setStartingTestId] = useState(null);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH MOCK STATUSES
    // ==========================================

    const refreshMockStatuses = useCallback(async () => {

        setCheckingAttempts(true);

        try {
            const statuses = await getMockTestStatuses(USER_ID);

            const statusMap = {};

            statuses.forEach((item) => {
                statusMap[item.mockTestId] = {
                    status: item.status,
                    attemptId: item.attemptId
                };
            });

            setMockStatuses(statusMap);
            setError("");

        } catch (requestError) {

            console.error("Error fetching mock statuses:", requestError);

            setError(
                getErrorMessage(
                    requestError,
                    "Unable to fetch mock test statuses. Please refresh."
                )
            );

        } finally {
            setCheckingAttempts(false);
        }

    }, []);

    useEffect(() => {
        refreshMockStatuses();
    }, [refreshMockStatuses]);

    // ==========================================
    // START OR RESUME A TEST
    // ==========================================

    const handleStartOrResume = async (test) => {

        if (startingTestId !== null || checkingAttempts) {
            return;
        }

        setStartingTestId(test.id);
        setError("");

        try {

            const mockStatus = mockStatuses[test.id];

            let attempt;

            // Resume an existing attempt.
            if (mockStatus?.status === "IN_PROGRESS") {

                attempt = await getActiveAttempt(
                    USER_ID,
                    TEST_TYPE,
                    test.sourceName
                );

                if (!attempt) {
                    throw new Error(
                        "Active attempt not found. Please refresh your mock statuses."
                    );
                }

            } else {

                // Start a new attempt.
                const attemptData = {
                    userId: USER_ID,
                    mockTestId: test.id,
                    testType: TEST_TYPE,
                    sourceName: test.sourceName,
                    numberOfQuestions: test.questions,
                    companyId: null,
                    categories: test.categories
                };

                console.log("Starting new attempt:", attemptData);

                try {
                    attempt = await startAttempt(attemptData);

                } catch (startError) {

                    // Handle an already-existing active attempt.
                    if (startError?.response?.status === 409) {

                        const existingAttempt = await getActiveAttempt(
                            USER_ID,
                            TEST_TYPE,
                            test.sourceName
                        );

                        if (existingAttempt) {
                            attempt = existingAttempt;
                        } else {
                            throw startError;
                        }

                    } else {
                        throw startError;
                    }
                }

                await refreshMockStatuses();
            }

            setCurrentAttempt(attempt);

        } catch (requestError) {

            console.error("Error opening mock test:", requestError);

            setError(
                getErrorMessage(
                    requestError,
                    "Unable to open the mock test. Please try again."
                )
            );

            await refreshMockStatuses();

        } finally {
            setStartingTestId(null);
        }
    };

    // ==========================================
    // VIEW RESULT
    // ==========================================

    const handleViewResult = (test) => {

        const mockStatus = mockStatuses[test.id];

        if (mockStatus?.attemptId) {
            setResultAttemptId(mockStatus.attemptId);
        }
    };

    // ==========================================
    // HANDLE TEST SUBMISSION
    // ==========================================

    const handleTestSubmitted = (attemptId) => {

        setCurrentAttempt(null);
        setResultAttemptId(attemptId);
    };

    // ==========================================
    // RETURN TO DASHBOARD
    // ==========================================

    const handleBackToDashboard = async () => {

        setCurrentAttempt(null);
        setResultAttemptId(null);

        await refreshMockStatuses();
    };

    // ==========================================
    // SHOW RESULT SCREEN
    // ==========================================

    if (resultAttemptId) {
        return (
            <MockResultScreen
                attemptId={resultAttemptId}
                onBack={handleBackToDashboard}
            />
        );
    }

    // ==========================================
    // SHOW TEST SCREEN
    // ==========================================

    if (currentAttempt) {
        return (
            <MockTestScreen
                key={currentAttempt.attemptId}
                attempt={currentAttempt}
                onBack={handleBackToDashboard}
                onSubmitted={handleTestSubmitted}
            />
        );
    }

    // ==========================================
    // FILTER TESTS
    // ==========================================

    const filteredTests = mockTests.filter((test) => {

        if (activeFilter === "All Tests") {
            return true;
        }

        if (activeFilter === "DSA") {
            return test.categories.includes("DSA");
        }

        return test.category === activeFilter;
    });

    // ==========================================
    // DASHBOARD STATISTICS
    // ==========================================

    const activeCount = Object.values(mockStatuses).filter(
        (item) => item.status === "IN_PROGRESS"
    ).length;

    const completedCount = Object.values(mockStatuses).filter(
        (item) => item.status === "COMPLETED"
    ).length;

    const categoryCounts = {
        Aptitude: 10,
        Reasoning: 10,
        Technical: 10,
        English: 10
    };

    // ==========================================
    // INITIAL LOADING
    // ==========================================

    if (checkingAttempts && Object.keys(mockStatuses).length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="text-xl font-semibold">
                        Checking your mock tests...
                    </div>
                    <p className="mt-2 text-gray-400">
                        Please wait.
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================
    // DASHBOARD
    // ==========================================

    return (

        <div className="min-h-screen bg-slate-950 p-6 text-white">

            {/* HEADER */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    Mock Tests
                </h1>

                <p className="mt-2 text-gray-400">
                    Test your preparation before the real assessment.
                </p>

            </div>

            {/* ERROR MESSAGE */}

            {error && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-500/10 p-3 text-red-400">
                    <p>{error}</p>

                    <button
                        onClick={refreshMockStatuses}
                        disabled={checkingAttempts}
                        className="rounded-md border border-red-400/40 px-3 py-1 text-sm hover:bg-red-500/10 disabled:opacity-50"
                    >
                        {checkingAttempts ? "Checking..." : "Retry"}
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* LEFT SECTION */}

                <div className="xl:col-span-2">

                    {/* FILTERS */}

                    <div className="mb-6 flex flex-wrap gap-3">

                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    activeFilter === filter
                                        ? "bg-cyan-500 text-slate-950"
                                        : "border border-slate-700 bg-slate-900 text-gray-300 hover:bg-slate-800"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}

                    </div>

                    {/* TEST CARDS */}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {filteredTests.map((test) => {

                            const mockStatus = mockStatuses[test.id];

                            const status = mockStatus?.status;

                            const isActive = status === "IN_PROGRESS";

                            const isCompleted = status === "COMPLETED";

                            const isExpired = status === "EXPIRED";

                            const hasResult = isCompleted || isExpired;

                            const isStarting = startingTestId === test.id;

                            return (

                                <div
                                    key={test.id}
                                    className="rounded-xl border border-slate-700 bg-slate-900 p-5 transition hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/5"
                                >

                                    {/* CATEGORY AND DIFFICULTY */}

                                    <div className="mb-4 flex items-center justify-between">

                                        <span className="rounded-md bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
                                            {test.category}
                                        </span>

                                        <span className="text-sm text-gray-400">
                                            {test.difficulty}
                                        </span>

                                    </div>

                                    {/* TITLE */}

                                    <h2 className="mb-4 text-xl font-semibold">
                                        {test.title}
                                    </h2>

                                    {/* TEST INFORMATION */}

                                    <div className="mb-5 grid grid-cols-2 gap-3 text-sm text-gray-400">
                                        <p>📝 {test.questions} Questions</p>
                                        <p>⏱️ {test.duration}</p>
                                    </div>

                                    {/* STATUS */}

                                    {isActive ? (

                                        <div className="mb-4 rounded-lg bg-green-500/10 p-3">
                                            <p className="text-sm font-medium text-green-400">
                                                ● Test in progress
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                You have an unfinished attempt. Resume to continue.
                                            </p>
                                        </div>

                                    ) : hasResult ? (

                                        <div className="mb-4 rounded-lg bg-cyan-500/10 p-3">
                                            <p className="text-sm font-medium text-cyan-400">
                                                ● {isExpired ? "Test expired" : "Test completed"}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                Your test result is available.
                                            </p>
                                        </div>

                                    ) : (

                                        <div className="mb-4 rounded-lg bg-slate-800 p-3">
                                            <p className="text-sm text-gray-300">
                                                Ready to practice?
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                20 questions • 20 minutes
                                            </p>
                                        </div>

                                    )}

                                    {/* ACTION BUTTON */}

                                    {hasResult ? (

                                        <button
                                            onClick={() => handleViewResult(test)}
                                            disabled={!mockStatus?.attemptId}
                                            className="w-full rounded-lg bg-cyan-500 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
                                        >
                                            View Result
                                        </button>

                                    ) : (

                                        <button
                                            onClick={() => handleStartOrResume(test)}
                                            disabled={
                                                checkingAttempts ||
                                                startingTestId !== null
                                            }
                                            className={`w-full rounded-lg py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                isActive
                                                    ? "bg-green-500 text-slate-950 hover:bg-green-400"
                                                    : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                                            }`}
                                        >
                                            {isStarting
                                                ? "Opening..."
                                                : isActive
                                                    ? "Resume Test"
                                                    : "Start Test"}
                                        </button>

                                    )}

                                </div>

                            );

                        })}

                    </div>

                    {filteredTests.length === 0 && (
                        <p className="mt-8 text-center text-gray-400">
                            No tests found in this category.
                        </p>
                    )}

                </div>

                {/* RIGHT SECTION */}

                <div className="space-y-6">

                    {/* PRACTICE OVERVIEW */}

                    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">

                        <h2 className="mb-5 text-xl font-semibold">
                            Practice Overview
                        </h2>

                        <div className="grid grid-cols-2 gap-4">

                            <div className="rounded-lg bg-slate-800 p-4">
                                <p className="text-sm text-gray-400">
                                    Total Mocks
                                </p>
                                <p className="mt-2 text-3xl font-bold text-cyan-400">
                                    {mockTests.length}
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-800 p-4">
                                <p className="text-sm text-gray-400">
                                    Active Mocks
                                </p>
                                <p className="mt-2 text-3xl font-bold text-green-400">
                                    {activeCount}
                                </p>
                            </div>

                            <div className="col-span-2 rounded-lg bg-slate-800 p-4">
                                <p className="text-sm text-gray-400">
                                    Completed Mocks
                                </p>
                                <p className="mt-2 text-3xl font-bold text-purple-400">
                                    {completedCount}
                                </p>
                            </div>

                        </div>

                        <div className="mt-5 space-y-4">

                            {Object.entries(categoryCounts).map(([category, count]) => (
                                <div
                                    key={category}
                                    className="flex items-center justify-between"
                                >
                                    <span className="text-sm text-gray-300">
                                        {category}
                                    </span>
                                    <span className="text-sm font-semibold text-cyan-400">
                                        {count} Mocks
                                    </span>
                                </div>
                            ))}

                        </div>

                    </div>

                    {/* TEST GUIDELINES */}

                    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">

                        <h2 className="mb-4 text-xl font-semibold">
                            Mock Test Guidelines
                        </h2>

                        <div className="space-y-4 text-sm text-gray-400">
                            <p>📝 Each mock contains 20 questions.</p>
                            <p>⏱️ You get 20 minutes to complete each mock.</p>
                            <p>💾 Your answers are saved while attempting the test.</p>
                            <p>🔄 You can resume an unfinished test.</p>
                            <p>📊 Detailed results are available after submission.</p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default MockTest;
