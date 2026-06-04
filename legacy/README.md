# Algomination - Algorithm Visualization Platform

A modern, interactive platform for learning algorithms and data structures through animated visualizations.

## 🚀 Features

### Core Functionality
- **Interactive Algorithm Visualizations**: Real-time animations for sorting, searching, and data structure operations
- **User Authentication**: Secure login/signup with JWT tokens
- **Project Submissions**: Users can submit their own algorithm implementations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Feedback**: Immediate visual feedback during algorithm execution

### Algorithms & Data Structures
- **Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort
- **Search Algorithms**: Linear Search, Binary Search
- **Data Structures**: Stack, Queue, Linked List, Binary Tree, Graph
- **Pathfinding**: Dijkstra's Algorithm, A* Search

### Technical Improvements
- **Modern Tech Stack**: React 18, Django 4.2, Django REST Framework
- **Real-time Animations**: Framer Motion for smooth, performant animations
- **Type Safety**: TypeScript for better development experience
- **API-First Design**: RESTful API for scalability
- **Security**: JWT authentication, password hashing, CORS protection
- **Performance**: Optimized animations, lazy loading, code splitting

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Query** for state management

### Backend
- **Django 4.2** with Python 3.11+
- **Django REST Framework** for API
- **Django CORS Headers** for cross-origin requests
- **Simple JWT** for authentication
- **PostgreSQL** for production database
- **SQLite** for development

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Backend Setup
```bash
# Clone the repository
git clone <repository-url>
cd algomination

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
algomination/
├── backend/                 # Django backend
│   ├── algomination/       # Main Django app
│   ├── api/               # REST API endpoints
│   ├── algorithms/        # Algorithm implementations
│   ├── users/            # User management
│   └── manage.py
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables
Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost/algomination
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
```

## 🚀 Deployment

### Backend Deployment
```bash
# Install production dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn algomination.wsgi:application
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve with nginx or similar
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original Algomination project by Omang Rawat and Rahul Soni
- Framer Motion for amazing animation capabilities
- React and Django communities for excellent documentation 