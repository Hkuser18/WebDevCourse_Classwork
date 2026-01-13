// services/authService.js - Authentication service for user registration and login
const bcrypt = require("bcrypt");
const userRepo = require("../repositories/userRepository");

class AuthService {
    // Register a new user
    async register({ email, fullName, password }) {
        const existing = await userRepo.findByEmail(email);
        if (existing) {
            throw new Error("Email already registered.");
        }
        // Hash the password before storing
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await userRepo.create({ email, fullName, passwordHash });
        return user;
    }
    // Login an existing user
    async login({ email, password }) {
        const user = await userRepo.findByEmail(email);
        if (!user) throw new Error("Invalid email or password.");
        // Verify the password against the stored hash
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) throw new Error("Invalid email or password.");

        return user;
    }
}

module.exports = new AuthService();
