# Competitive Programming Platform

This project is a web application designed for students in Computer Engineering & Digital Technology, focusing on competitive programming using C++. It provides a platform for users to practice programming problems, submit their solutions, and receive feedback.

## Project Structure

- **src/**: Contains the source code for the application.
  - **frontend/**: The client-side code, including HTML, CSS, and JavaScript.
  - **backend/**: The server-side code, including routes, controllers, and services.
  - **shared/**: Contains shared types and interfaces used in both frontend and backend.
  
- **db/**: Contains the database schema and migration scripts.
  
- **scripts/**: Scripts for deployment and database setup.
  
- **docker/**: Dockerfiles for containerizing the application.
  
- **tests/**: Contains tests for both frontend and backend components.

## Features

1. **User Authentication**: Users must log in to access the platform. Information stored includes:
   - First Name
   - Last Name
   - Gmail
   - Profile Picture (optional)
   - Student ID (10 digits)

2. **Problem Archive**: Users can access a collection of past problems categorized by topic. Each problem includes:
   - Downloadable PDF files
   - A grading system for submitted C++ code with feedback on test cases.

3. **Code Sharing**: Users can choose to share their solutions with others.

4. **Ranking System**: Admins can assign scores to problems, and the top 10 users are displayed based on their scores.

5. **Learning Resources**: Integration with external APIs for:
   - Problem guides
   - Algorithm and data structure analysis
   - Code explanation by AI
   - Syntax queries for STL usage

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/cp-platform.git
   cd cp-platform
   ```

2. **Install Dependencies**:
   - For the frontend:
     ```bash
     cd src/frontend
     npm install
     ```
   - For the backend:
     ```bash
     cd ../backend
     npm install
     ```

3. **Set Up the Database**:
   - Run the database setup script:
     ```bash
     cd ../scripts
     ./setup-db.sh
     ```

4. **Run the Application**:
   - Start the backend server:
     ```bash
     cd ../backend
     node server.js
     ```
   - Open the frontend in your browser:
     ```bash
     open ../frontend/index.html
     ```

## Deployment

To deploy the application on an EC2 instance, use the provided deployment script:
```bash
cd scripts
./deploy-ec2.sh
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.