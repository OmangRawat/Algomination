# Algomination Project Structure

## Overview
This is a modern rewrite of the original Algomination project using React.js and Django. The project provides an interactive platform for learning algorithms and data structures through animated visualizations.

## Project Structure

```
algomination/
├── README.md                 # Project documentation
├── PROJECT_STRUCTURE.md      # This file
├── setup.sh                  # Unix/Linux setup script
├── setup.bat                 # Windows setup script
│
├── backend/                  # Django Backend
│   ├── requirements.txt      # Python dependencies
│   ├── manage.py            # Django management script
│   ├── .env                 # Environment variables (created by setup)
│   │
│   ├── algomination/        # Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py      # Django settings
│   │   ├── urls.py          # Main URL configuration
│   │   ├── wsgi.py          # WSGI configuration
│   │   └── asgi.py          # ASGI configuration
│   │
│   ├── users/               # User management app
│   │   ├── __init__.py
│   │   ├── models.py        # Custom user model
│   │   ├── serializers.py   # User serializers
│   │   ├── views.py         # User views
│   │   └── urls.py          # User URLs
│   │
│   ├── algorithms/          # Algorithms app
│   │   ├── __init__.py
│   │   ├── models.py        # Algorithm models
│   │   ├── serializers.py   # Algorithm serializers
│   │   ├── views.py         # Algorithm views
│   │   └── urls.py          # Algorithm URLs
│   │
│   └── api/                 # API app
│       ├── __init__.py
│       ├── urls.py          # API URL patterns
│       └── views.py         # API views
│
└── frontend/                # React Frontend
    ├── package.json         # Node.js dependencies
    ├── vite.config.ts       # Vite configuration
    ├── tsconfig.json        # TypeScript configuration
    ├── tailwind.config.js   # Tailwind CSS configuration
    ├── postcss.config.js    # PostCSS configuration
    ├── index.html           # Main HTML file
    ├── .env                 # Environment variables (created by setup)
    │
    └── src/                 # Source code
        ├── main.tsx         # React entry point
        ├── App.tsx          # Main App component
        ├── index.css        # Global styles
        │
        ├── components/      # Reusable components
        │   ├── Layout.tsx   # Main layout component
        │   ├── LoadingSpinner.tsx
        │   ├── Button.tsx
        │   ├── Card.tsx
        │   ├── Input.tsx
        │   └── Navigation.tsx
        │
        ├── pages/           # Page components
        │   ├── Home.tsx     # Home page
        │   ├── Algorithms.tsx
        │   ├── AlgorithmDetail.tsx
        │   ├── Login.tsx
        │   ├── Register.tsx
        │   ├── Profile.tsx
        │   ├── About.tsx
        │   ├── Contact.tsx
        │   └── Projects.tsx
        │
        ├── hooks/           # Custom React hooks
        │   ├── useAuth.ts
        │   ├── useApi.ts
        │   └── useLocalStorage.ts
        │
        ├── services/        # API services
        │   ├── api.ts       # Base API configuration
        │   ├── auth.ts      # Authentication service
        │   ├── algorithms.ts
        │   └── projects.ts
        │
        ├── utils/           # Utility functions
        │   ├── constants.ts
        │   ├── helpers.ts
        │   └── types.ts
        │
        └── styles/          # Additional styles
            └── animations.css
```

## Key Improvements Over Original

### 1. **Modern Tech Stack**
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Django 4.2 + Django REST Framework
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: React Query + Context API

### 2. **Security Enhancements**
- JWT authentication instead of session-based
- Password hashing with Django's built-in security
- CORS protection for API endpoints
- Input validation and sanitization

### 3. **Better User Experience**
- Responsive design for all devices
- Smooth animations with Framer Motion
- Real-time feedback and loading states
- Progressive Web App capabilities

### 4. **Scalability**
- API-first architecture
- Modular component structure
- Lazy loading for better performance
- Code splitting and optimization

### 5. **Developer Experience**
- TypeScript for type safety
- ESLint and Prettier for code quality
- Hot reloading for development
- Comprehensive documentation

## Database Models

### User Management
- **User**: Custom user model with email authentication
- **UserProfile**: Extended user information

### Algorithms
- **Algorithm**: Core algorithm information and metadata
- **UserSubmission**: User algorithm execution records
- **Feedback**: User ratings and comments

### Community
- **Project**: User-submitted algorithm implementations
- **Contact**: Contact form submissions

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/me/` - Get current user

### Algorithms
- `GET /api/algorithms/` - List all algorithms
- `GET /api/algorithms/{slug}/` - Get algorithm details
- `POST /api/algorithms/{slug}/execute/` - Execute algorithm
- `POST /api/algorithms/{slug}/visualize/` - Get visualization data

### Projects
- `GET /api/projects/` - List user projects
- `POST /api/projects/` - Submit new project
- `PUT /api/projects/{id}/` - Update project

## Frontend Features

### Core Components
- **Layout**: Responsive navigation and footer
- **Algorithm Visualizer**: Interactive algorithm animations
- **Code Editor**: Syntax-highlighted code display
- **Performance Metrics**: Real-time execution statistics

### Pages
- **Home**: Landing page with features and CTA
- **Algorithms**: Browse and search algorithms
- **Algorithm Detail**: Interactive learning experience
- **User Dashboard**: Profile and progress tracking

## Development Workflow

1. **Setup**: Run `setup.sh` (Unix) or `setup.bat` (Windows)
2. **Backend**: `cd backend && python manage.py runserver`
3. **Frontend**: `cd frontend && npm run dev`
4. **Testing**: `npm test` (frontend) / `python manage.py test` (backend)

## Deployment

### Backend (Django)
- Use Gunicorn for production
- Configure PostgreSQL database
- Set up environment variables
- Enable HTTPS

### Frontend (React)
- Build with `npm run build`
- Serve with Nginx or similar
- Configure CDN for static assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 