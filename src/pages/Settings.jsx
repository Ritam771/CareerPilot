
import { useEffect, useState } from "react";

const defaultSettings = {
  theme: "light",
  dailyReminder: false,
  newRecommendations: false,
  mockTestEmail: false,
  dailyGoal: "10 questions",
  difficulty: "Adaptive",
  reminderTime: "19:00",
  showReasons: false,
  anonymousResearch: false,
};

const sections = [
  "Appearance",
  "Notifications",
  "Practice preferences",
  "Privacy & data",
  "Account security",
];

function Settings() {
  const [activeSection, setActiveSection] = useState("Appearance");
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem("careerPilotSettings");

    if (savedSettings) {
      try {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(savedSettings),
        });
      } catch {
        localStorage.removeItem("careerPilotSettings");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "careerPilotSettings",
      JSON.stringify(settings)
    );
  }, [settings]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Settings
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Manage your CareerPilot preferences.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <aside className="space-y-2">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`block w-full rounded-lg p-3 text-left ${
                activeSection === section
                  ? "bg-blue-100 font-semibold text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {section}
            </button>
          ))}
        </aside>

        <main className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {activeSection}
          </h2>

          {activeSection === "Appearance" && (
            <div className="mt-4">
              <label className="mb-2 block text-sm text-gray-600">
                Choose your theme
              </label>

              <select
                value={settings.theme}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    theme: e.target.value,
                  })
                }
                className="rounded-lg border border-gray-300 p-2"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">Match system</option>
              </select>
            </div>
          )}

          {activeSection === "Notifications" && (
            <div className="mt-4 space-y-4">
              {[
                ["dailyReminder", "Daily practice reminders"],
                ["newRecommendations", "New recommendations"],
                ["mockTestEmail", "Mock test emails"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={settings[key]}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        [key]: e.target.checked,
                      })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          )}

          {activeSection === "Practice preferences" && (
            <div className="mt-4 space-y-4">
              <label className="block text-sm text-gray-600">
                Daily practice goal
                <select
                  value={settings.dailyGoal}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      dailyGoal: e.target.value,
                    })
                  }
                  className="mt-2 block rounded-lg border border-gray-300 p-2"
                >
                  <option>5 questions</option>
                  <option>10 questions</option>
                  <option>15 questions</option>
                  <option>20 questions</option>
                </select>
              </label>

              <label className="block text-sm text-gray-600">
                Difficulty
                <select
                  value={settings.difficulty}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      difficulty: e.target.value,
                    })
                  }
                  className="mt-2 block rounded-lg border border-gray-300 p-2"
                >
                  <option>Beginner</option>
                  <option>Adaptive</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </label>

              <label className="block text-sm text-gray-600">
                Reminder time
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      reminderTime: e.target.value,
                    })
                  }
                  className="mt-2 block rounded-lg border border-gray-300 p-2"
                />
              </label>
            </div>
          )}

          {activeSection === "Privacy & data" && (
            <div className="mt-4 space-y-4">
              <label className="flex items-center gap-3 text-gray-700">
                <input
                  type="checkbox"
                  checked={settings.showReasons}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      showReasons: e.target.checked,
                    })
                  }
                />
                Show explanations for answers
              </label>

              <label className="flex items-center gap-3 text-gray-700">
                <input
                  type="checkbox"
                  checked={settings.anonymousResearch}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      anonymousResearch: e.target.checked,
                    })
                  }
                />
                Allow anonymous research data
              </label>

              <button
                onClick={() => {
                  const file = new Blob(
                    [JSON.stringify(settings, null, 2)],
                    { type: "application/json" }
                  );
                  const url = URL.createObjectURL(file);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "careerpilot-settings.json";
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Export settings
              </button>
            </div>
          )}

          {activeSection === "Account security" && (
            <p className="mt-4 text-sm text-gray-500">
              Account security options will be added when backend
              authentication is implemented.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default Settings;
