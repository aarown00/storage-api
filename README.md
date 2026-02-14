# Storage API

A simple full-stack application with Django REST Framework backend and React frontend. (Work in progress)

## Prerequisites

- Python 3.9+
- Node.js 12.0+
- pip and npm

## Setup & Run

### 1. Clone Repository
```bash
git clone https://github.com/aarown00/storage-api.git
cd storage-api
```

### 2. Backend Setup

**Create and Activate virtual environment:**
# On macOS/Linux
```bash
python -m venv env
source env/bin/activate
```
# On Windows
```bash
python -m venv env
env\Scripts\activate
```

**Install dependencies (if needed):**
```bash
pip install Django djangorestframework django-cors-headers Pillow
```

**Run migrations:**
```bash
python manage.py migrate
```

**Run server:**
```bash
python manage.py runserver
```

Server runs at `http://localhost:8000`

### 3. Frontend Setup

**Open new terminal and navigate to frontend:**
```bash
cd frontend
```

**Install dependencies:**
```bash
npm install
```

**Run development server:**
```bash
npm start
```

App opens at `http://localhost:3000`

