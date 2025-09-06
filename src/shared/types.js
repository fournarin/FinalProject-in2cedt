// This file defines shared types and interfaces used in both the frontend and backend.

export const UserType = {
    name: String,
    surname: String,
    email: String,
    profilePicture: String,
    studentId: String
};

export const ProblemType = {
    id: Number,
    title: String,
    description: String,
    pdfFile: String,
    category: String,
    grade: Number
};

export const SubmissionType = {
    id: Number,
    userId: String,
    problemId: Number,
    code: String,
    result: String,
    timestamp: Date
};

export const AdminType = {
    id: Number,
    name: String,
    email: String
};