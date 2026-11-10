
const USERS_KEY = "careerPilotUsers";
const SESSION_KEY = "careerPilotSession";

// ==========================================
// 1. Read Registered Users
// ==========================================
function readUsers() {
  try {
    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error("Error reading users:", error);
    return [];
  }
}

// ==========================================
// 2. Save Registered Users
// ==========================================
function saveUsers(users) {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
}

// ==========================================
// 3. Create User Session
// ==========================================
function createSession(user) {
  const session = {
    id: user.id,
    name: user.name,
    // Older accounts stored the email/phone in "identifier"
    email: user.email || user.identifier || "",
    phone: user.phone || "",
  };

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );

  return session;
}

// ==========================================
// 4. Register New User
// ==========================================
export async function registerUser(form) {
  const users = readUsers();

  const name = form.name?.trim();
  const email = form.email?.trim().toLowerCase();
  const phone = form.phone?.trim() || "";
  const password = form.password;

  // Validate required fields
  if (!name || !email || !password) {
    throw new Error("Please fill in all required fields.");
  }

  // Check duplicate email
  const existingUser = users.find(
    (user) => user.email?.toLowerCase() === email
  );

  if (existingUser) {
    throw new Error(
      "This email is already registered. Please login."
    );
  }

  // Check duplicate phone
  if (phone) {
    const existingPhone = users.find(
      (user) => user.phone === phone
    );

    if (existingPhone) {
      throw new Error(
        "This phone number is already registered."
      );
    }
  }

  // Create new user
  const newUser = {
    id:
      globalThis.crypto?.randomUUID?.() ||
      `user-${Date.now()}`,

    name,
    email,
    phone,
    password,

    createdAt: new Date().toISOString(),
  };

  try {
    // Save registered user
    saveUsers([...users, newUser]);

    // Automatically create session after registration
    const session = createSession(newUser);

    return session;

  } catch (error) {
    console.error("Registration error:", error);

    throw new Error(
      "Unable to create account. Check browser storage."
    );
  }
}

// ==========================================
// 5. Login User Using Email or Phone
// ==========================================
export async function loginUser(identifier, password) {
  const users = readUsers();

  const cleanIdentifier = identifier?.trim().toLowerCase();

  if (!cleanIdentifier || !password) {
    throw new Error(
      "Please enter your email/phone and password."
    );
  }

  // Find registered user
  const user = users.find((item) => {
    const emailMatch =
      item.email?.toLowerCase() === cleanIdentifier ||
      item.identifier?.toLowerCase() === cleanIdentifier;

    const phoneMatch =
      !!item.phone && item.phone === identifier.trim();

    return (
      (emailMatch || phoneMatch) &&
      item.password === password
    );
  });

  if (!user) {
    throw new Error(
      "Invalid email/phone or password."
    );
  }

  try {
    // Create session for the logged-in user
    return createSession(user);

  } catch (error) {
    console.error("Login error:", error);

    throw new Error(
      "Unable to save login session."
    );
  }
}

// ==========================================
// 6. Get Currently Logged-in User
// ==========================================
export function getCurrentUser() {
  try {
    const session = JSON.parse(
      localStorage.getItem(SESSION_KEY) || "null"
    );

    // Validate session
    if (!session || !session.id || !session.name) {
      return null;
    }

    return session;

  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

// ==========================================
// 7. Check Authentication Status
// ==========================================
export function isAuthenticated() {
  return getCurrentUser() !== null;
}

// ==========================================
// 8. Logout User
// ==========================================
export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}
