# Installation & Running Guide

This guide details how to install, test, and run the **C-Code Optimizer and Analyzer** project locally or using Docker.

---

## Method 1: Local Development Setup (Manual)

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)

### Step 1: Install Backend & Run Tests
1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the compiler unit tests to verify optimization passes:
   ```bash
   npm test
   ```
4. Start the Express backend server:
   ```bash
   npm run start
   ```
   *The server will start on port 5000: `http://localhost:5000`*

### Step 2: Install Frontend & Start Dashboard
1. Open a new terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The dashboard will be available at `http://localhost:5173` (or the port specified in console)*

4. Open `http://localhost:5173` in your browser. Drag and drop any `.c` file from the `samples/` directory or copy-paste code to analyze!

---

## Method 2: Docker Compose Setup (Recommended for Deployment)

Ensure you have **Docker** and **Docker Compose** installed on your machine.

### Step 1: Build and Run Services
From the root directory containing `docker-compose.yml`, run:
```bash
docker compose up --build
```

This command will:
1. Compile and containerize the React frontend, serving it using Nginx on port 3000.
2. Compile and containerize the Node Express backend, running on port 5000.

### Step 2: Access the Application
Open your web browser and navigate to:
- **Frontend Dashboard**: `http://localhost:3000`
- **Backend Health Check**: `http://localhost:5000/api/analyze` (Sends a POST test)

To shut down the containers, press `Ctrl+C` or run:
```bash
docker compose down
```

---

## Verification & Testing
To ensure all optimization phases function correctly:
- Paste code containing `10 + 20 * 2` into Monaco Editor. The Optimized Code panel should show the assignment simplified to `50` (Constant Folding).
- Check the **Complexity** tab: theoretical Big-O values should dynamically adapt as you add loops (O(n), O(n²)) or recursive function boundaries.
- Click **PDF Report** to compile and download the structured compiler report.
