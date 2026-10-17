
import questions from "../data/questions.json";

const Technical = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-3xl font-bold text-gray-800">
                Technical
            </h1>

            {questions.map((question) => (
                <div key={question.id}>
                    <h2>{question.question}</h2>

                    {question.options.map((option) => (
                        <div key={option.id}>
                            {option.text}
                        </div>
                    ))}
                </div>
            ))}

        </div>
    );
};

export default Technical;

