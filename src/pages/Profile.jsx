
import { useEffect, useRef, useState } from "react";
const colleges = [
  "Techno India University",
  "University of Engineering and Management (UEM), Kolkata",
  "Maulana Abul Kalam Azad University of Technology (MAKAUT)",
  "Asansol Engineering College",
  "St. Xavier's College, Kolkata",
  "Institute of Engineering and Management (IEM), Kolkata",
  "Jadavpur University",
  "Heritage Institute of Technology, Kolkata",
  "NIT Durgapur",
  "IIT Kharagpur",
  "University of Delhi",
  "Jawaharlal Nehru University (JNU)",
  "Jamia Millia Islamia",
  "IIT Delhi",
  "University of Mumbai",
  "Savitribai Phule Pune University",
  "College of Engineering Pune (COEP)",
  "IIT Bombay",
  "VJTI Mumbai",
  "Bangalore University",
  "Bangalore Institute of Technology",
  "RV College of Engineering",
  "Christ University, Bengaluru",
  "IISc Bengaluru",
  "Anna University",
  "IIT Madras",
  "VIT Vellore",
  "SRM Institute of Science and Technology",
  "PSG College of Technology",
  "University of Hyderabad",
  "Osmania University",
  "IIIT Hyderabad",
  "JNTU Hyderabad",
  "Andhra University",
  "Banaras Hindu University (BHU)",
  "Aligarh Muslim University (AMU)",
  "Amity University, Noida",
  "IIT Kanpur",
  "IIT BHU Varanasi",
  "University of Rajasthan",
  "Manipal University Jaipur",
  "BITS Pilani",
  "IIT Jodhpur",
  "Panjab University, Chandigarh",
  "Thapar Institute of Engineering and Technology",
  "Chandigarh University",
  "Panjab Engineering College",
  "NIT Kurukshetra",
  "IIT Indore",
  "Devi Ahilya Vishwavidyalaya",
  "Nirma University, Ahmedabad",
  "Gujarat University",
  "IIT Gandhinagar",
  "University of Kerala",
  "Cochin University of Science and Technology",
  "NIT Calicut",
  "Utkal University",
  "KIIT University, Bhubaneswar",
  "NIT Rourkela",
  "Patna University",
  "IIT Patna",
];
const courses = [
  "BCA",
  "BBA",
  "B.Tech",
  "MCA",
  "MBA",
  "M.Tech",
  "Other",
];
const degreeOptions = [
  "BCA",
  "BBA",
  "B.Tech",
  "B.E.",
  "B.Sc",
  "B.Com",
  "BA",
  "Other",
];
const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
const labelClass =
  "mb-1 block text-sm font-medium text-slate-700";
const sectionClass =
  "mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";
const RESUME_DB_NAME = "CareerPilotResumeDB";
const RESUME_STORE_NAME = "resumes";
const openResumeDB = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(RESUME_DB_NAME, 1);
  request.onupgradeneeded = () => {
    if (!request.result.objectStoreNames.contains(RESUME_STORE_NAME)) request.result.createObjectStore(RESUME_STORE_NAME);
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const resumeTransaction = async (mode, action) => {
  const db = await openResumeDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(RESUME_STORE_NAME, mode);
    action(transaction.objectStore(RESUME_STORE_NAME), resolve, reject);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
    transaction.onabort = () => { db.close(); reject(transaction.error || new Error("Resume action was cancelled.")); };
  });
};

const saveResumeFile = (file) => resumeTransaction("readwrite", (store) => store.put({ file, name: file.name, type: file.type }, "currentResume"));
const getResumeFile = () => resumeTransaction("readonly", (store, resolve, reject) => {
  const request = store.get("currentResume");
  request.onsuccess = () => resolve(request.result || null);
  request.onerror = () => reject(request.error);
});
const deleteResumeFile = () => resumeTransaction("readwrite", (store) => store.delete("currentResume"));

const Profile = () => {
  const [photo, setPhoto] = useState("");
  const [currentCourse, setCurrentCourse] = useState("");
  const [skills, setSkills] = useState([
    "Java",
    "Python",
    "SQL",
    "AWS",
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [internships, setInternships] = useState([]);
  const [resumeName, setResumeName] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef(null);
  const resumeInputRef = useRef(null);
  useEffect(() => {
    const savedProfile = localStorage.getItem(
      "careerPilotProfile"
    );
    if (!savedProfile) return;
    try {
      const data = JSON.parse(savedProfile);
      if (data.fields && formRef.current) {
        Object.entries(data.fields).forEach(([name, value]) => {
          const field = formRef.current.elements.namedItem(name);
          if (field && typeof value === "string") {
            field.value = value;
          }
        });
      }
      setPhoto(data.photo || "");
      setCurrentCourse(data.currentCourse || "");
      setSkills(data.skills || []);
      setInternships(data.internships || []);
    } catch {
      console.error("Could not load the saved profile.");
    }
  }, []);
  useEffect(() => {
    let cancelled = false;
    const loadResume = async () => {
      try {
        const savedResume = await getResumeFile();
        if (!cancelled && savedResume?.file) {
          setResumeName(savedResume.name);
          setResumeUrl(URL.createObjectURL(savedResume.file));
        }
      } catch (error) {
        console.error("Could not load the saved resume:", error);
      }
    };
    loadResume();
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    return () => {
      if (resumeUrl) {
        URL.revokeObjectURL(resumeUrl);
      }
    };
  }, [resumeUrl]);
  const addSkill = () => {
    const newSkill = skillInput.trim();
    if (
      newSkill &&
      !skills.some(
        (skill) => skill.toLowerCase() === newSkill.toLowerCase()
      )
    ) {
      setSkills([...skills, newSkill]);
      setSkillInput("");
    }
  };
  const removeSkill = (skillToRemove) => {
    setSkills(
      skills.filter((skill) => skill !== skillToRemove)
    );
  };
  const addInternship = () => {
    setInternships([
      ...internships,
      {
        id: Date.now() + Math.random(),
        company: "",
        role: "",
        duration: "",
        description: "",
      },
    ]);
  };
  const updateInternship = (id, field, value) => {
    setInternships(
      internships.map((internship) =>
        internship.id === id
          ? { ...internship, [field]: value }
          : internship
      )
    );
  };
  const removeInternship = (id) => {
    setInternships(
      internships.filter((internship) => internship.id !== id)
    );
  };
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image smaller than 2 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleSave = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const fields = Object.fromEntries(formData.entries());
    const profileData = {
      fields,
      photo,
      currentCourse,
      skills,
      internships,
    };
    try {
      localStorage.setItem(
        "careerPilotProfile",
        JSON.stringify(profileData)
      );
      setMessage("Profile saved successfully!");
    } catch {
      setMessage(
        "Unable to save. Your profile data may be too large."
      );
    }
  };
  const handleResumeChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPDF) {
      alert("Please select a PDF resume.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose a PDF smaller than 5 MB.");
      event.target.value = "";
      return;
    }
    try {
      await saveResumeFile(file);
      setResumeName(file.name);
      setResumeUrl(URL.createObjectURL(file));
      setMessage("Resume uploaded and saved successfully!");
    } catch (error) {
      console.error("Resume upload failed:", error);
      setMessage("Could not save your resume. Please try again.");
    }
    event.target.value = "";
  };
  const handleRemoveResume = async () => {
    try {
      await deleteResumeFile();
      setResumeName("");
      setResumeUrl("");
      setMessage("Resume removed successfully!");
    } catch (error) {
      console.error("Could not remove resume:", error);
      setMessage("Could not remove your resume. Please try again.");
    }
  };
  const isPostgraduate = ["MCA", "MBA", "M.Tech"].includes(
    currentCourse
  );
  const isUndergraduate = ["BCA", "BBA", "B.Tech"].includes(
    currentCourse
  );
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-slate-900">
        My Profile
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Manage your personal, academic and career details.
      </p>
      <form ref={formRef} onSubmit={handleSave}>
        <div className={sectionClass}>
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-500">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-slate-800">
              Your Name
            </h2>
            <p className="text-sm text-slate-500">
              Add a short introduction below.
            </p>
            <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
            <button
              type="button"
              onClick={() => setPhoto("")}
              className="text-sm font-medium text-red-500 hover:text-red-700"
            >
              Remove Photo
            </button>
          </div>
        </div>
        
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-slate-800">
            Personal Details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter your basic information.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                name="location"
                type="text"
                placeholder="Enter your city and state"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Short Introduction</label>
              <textarea
                name="introduction"
                rows="3"
                placeholder="Tell us a little about yourself"
                className={inputClass}
              />
            </div>
          </div>
        </div>
        
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-slate-800">
            Academic Details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add your current course and previous education.
          </p>
          
          <div className="mt-6">
            <h3 className="mb-4 text-base font-semibold text-slate-800">
              Current / Most Recent Course
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Program / Degree
                </label>
                <select
                  name="currentCourse"
                  value={currentCourse}
                  onChange={(event) =>
                    setCurrentCourse(event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select your course</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Institution / College / University
                </label>
                <select
                  name="currentInstitution"
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select your institution
                  </option>
                  {colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Department</label>
                <input
                  name="department"
                  type="text"
                  placeholder="e.g. Department of Computer Applications"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Branch / Specialization
                </label>
                <input
                  name="specialization"
                  type="text"
                  placeholder="e.g. Computer Application"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Education Type</label>
                <select
                  name="educationType"
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select education type
                  </option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Distance">Distance</option>
                  <option value="Online">Online</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Current Semester
                </label>
                <select
                  name="semester"
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select semester
                  </option>
                  {Array.from(
                    { length: 8 },
                    (_, index) => index + 1
                  ).map((semester) => (
                    <option key={semester} value={semester}>
                      {semester === 1
                        ? "1st Semester"
                        : semester === 2
                        ? "2nd Semester"
                        : semester === 3
                        ? "3rd Semester"
                        : `${semester}th Semester`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Institutional Roll No.
                </label>
                <input
                  name="rollNumber"
                  type="text"
                  placeholder="Enter your roll number"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Passout Batch</label>
                <select
                  name="passoutBatch"
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select passout year
                  </option>
                  {Array.from(
                    { length: 16 },
                    (_, index) => 2020 + index
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="mb-4 text-base font-semibold text-slate-800">
              Class 10 Details
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Board</label>
                <select
                  name="class10Board"
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>Select board</option>
                  <option value="WBBSE">WBBSE</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Percentage (%)</label>
                <input
                  name="class10Percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="e.g. 85.5"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="mb-4 text-base font-semibold text-slate-800">
              Class 12 Details
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Board</label>
                <select
                  name="class12Board"
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>Select board</option>
                  <option value="WBCHSE">WBCHSE</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ISC">ISC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Percentage (%)</label>
                <input
                  name="class12Percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="e.g. 82.5"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
          
          {isPostgraduate && (
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="mb-2 text-base font-semibold text-slate-800">
                Previous Education (UG Details)
              </h3>
              <p className="mb-4 text-sm text-slate-500">
                Enter your bachelor's degree details.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Program / Degree
                  </label>
                  <select
                    name="ugDegree"
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select bachelor's degree
                    </option>
                    {degreeOptions.map((degree) => (
                      <option key={degree} value={degree}>
                        {degree}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Institution / College
                  </label>
                  <select
                    name="ugInstitution"
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select institution
                    </option>
                    {colleges.map((college) => (
                      <option key={college} value={college}>
                        {college}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Board / University
                  </label>
                  <input
                    name="ugUniversity"
                    type="text"
                    placeholder="e.g. MAKAUT"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Branch / Specialization
                  </label>
                  <input
                    name="ugSpecialization"
                    type="text"
                    placeholder="e.g. Computer Application"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Education Type
                  </label>
                  <select
                    name="ugEducationType"
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select education type
                    </option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Distance">Distance</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    UG Passout Year
                  </label>
                  <select
                    name="ugPassoutYear"
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>Select year</option>
                    {Array.from(
                      { length: 16 },
                      (_, index) => 2015 + index
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>UG Score Type</label>
                  <select
                    name="ugScoreType"
                    defaultValue="CGPA"
                    className={inputClass}
                  >
                    <option value="CGPA">CGPA</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>UG Score</label>
                  <input
                    name="ugScore"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter your UG score"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}
          
          {isUndergraduate && (
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="mb-4 text-base font-semibold text-slate-800">
                Current Academic Performance
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Score Type</label>
                  <select
                    name="currentScoreType"
                    defaultValue="CGPA"
                    className={inputClass}
                  >
                    <option value="CGPA">CGPA</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Current Score</label>
                  <input
                    name="currentScore"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter your current score"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}
          
          {isPostgraduate && (
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="mb-4 text-base font-semibold text-slate-800">
                Current PG Academic Performance
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Postgraduate Course
                  </label>
                  <input
                    type="text"
                    value={currentCourse}
                    readOnly
                    className={`${inputClass} bg-slate-100`}
                  />
                </div>
                <div>
                  <label className={labelClass}>PG Score Type</label>
                  <select
                    name="pgScoreType"
                    defaultValue="CGPA"
                    className={inputClass}
                  >
                    <option value="CGPA">CGPA</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Current PG Score
                  </label>
                  <input
                    name="pgScore"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter your current score"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-slate-800">
            Skills
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add your technical and professional skills.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
                  className="font-bold hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <input
              type="text"
              value={skillInput}
              onChange={(event) =>
                setSkillInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Enter a skill"
              className={`min-w-0 flex-1 ${inputClass}`}
            />
            <button
              type="button"
              onClick={addSkill}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
        
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-slate-800">
            Internship Experience
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add internships you have completed or are currently doing.
          </p>
          {internships.map((internship, index) => (
            <div
              key={internship.id}
              className="mt-5 rounded-xl border border-slate-200 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">
                  Internship {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeInternship(internship.id)}
                  className="text-sm font-medium text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Company Name</label>
                  <input
                    type="text"
                    value={internship.company}
                    onChange={(event) =>
                      updateInternship(
                        internship.id,
                        "company",
                        event.target.value
                      )
                    }
                    placeholder="Enter company name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Role / Position</label>
                  <input
                    type="text"
                    value={internship.role}
                    onChange={(event) =>
                      updateInternship(
                        internship.id,
                        "role",
                        event.target.value
                      )
                    }
                    placeholder="e.g. AWS Cloud Intern"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Duration</label>
                  <input
                    type="text"
                    value={internship.duration}
                    onChange={(event) =>
                      updateInternship(
                        internship.id,
                        "duration",
                        event.target.value
                      )
                    }
                    placeholder="e.g. 2 months"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Internship Description
                  </label>
                  <textarea
                    rows="2"
                    value={internship.description}
                    onChange={(event) =>
                      updateInternship(
                        internship.id,
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Describe your work and learning"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addInternship}
            className="mt-5 rounded-lg border border-blue-600 px-5 py-3 font-semibold text-blue-600 hover:bg-blue-50"
          >
            + Add Internship
          </button>
        </div>
        
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-slate-800">
            My Resume
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Upload your latest resume in PDF format (maximum 5 MB).
          </p>
          <div className="mt-5 rounded-xl border-2 border-dashed border-slate-300 p-6 text-center">
            <div className="text-4xl">📄</div>
            {resumeName ? (
              <div className="mt-3">
                <p className="break-all font-medium text-slate-800">
                  {resumeName}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {resumeUrl && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      View Resume
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove Resume
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-3 font-medium text-slate-700">
                  Choose your resume PDF
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Select a PDF file from your computer.
                </p>
              </>
            )}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeChange}
              className="mt-5 block w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-700"
            />
          </div>
        </div>
        
        <div className="mt-8 flex flex-col items-end gap-3">
          {message && (
            <p
              role="status"
              className="text-sm font-medium text-blue-700"
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 sm:w-auto"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};
export default Profile;
