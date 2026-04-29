# Ecommerce Website Frontend

A responsive ecommerce website frontend built with React and TypeScript, featuring a modern glassmorphism design with comprehensive form validation.

## Features

- **Modern Glassmorphism Design**: Dark blue gradient background with glass effect
- **Responsive Layout**: Fully responsive for mobile and desktop devices
- **Form Validation**: Comprehensive client-side validation with error messages
- **User Authentication**: Login and registration pages with proper validation
- **Main Dashboard**: Placeholder main page after successful login

## Pages

### 1. Login Page (`/login`)
- Email and password fields
- Client-side validation
- Navigation to registration page
- Redirects to main page after successful login

### 2. Registration Page (`/register`)
- **Name**: Alphabets only (a-z, A-Z), no numbers or special characters
- **Email**: Proper email format validation
- **Phone**: 10-digit numbers only
- **Password**: Minimum 6 characters
- **Confirm Password**: Must match password
- Real-time validation with error messages

### 3. Main Page (`/main`)
- Welcome dashboard after login
- Navigation bar with logout functionality
- Feature cards, stats section, and recent activity
- **Note**: This is a placeholder page - edit `/src/components/Main.tsx` to customize content

## Design Requirements Met

 Dark blue glassmorphism background  
 Gradient dark blue background with blur effect  
 White form containers with rounded corners  
 Soft shadows and hover effects  
 Centered forms (vertical and horizontal)  
 Modern and minimal UI design  
 Fully responsive for mobile and desktop  
 Comprehensive form validation  
 Clean folder structure and professional code  

## Project Structure

```
src/
├── components/
│   ├── Login.tsx          # Login page component
│   ├── Register.tsx       # Registration page component
│   └── Main.tsx           # Main dashboard page
├── styles/
│   ├── globals.css        # Global glassmorphism styles
│   └── main.css          # Main page specific styles
├── App.tsx               # Main app with routing
└── index.tsx            # Entry point
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd ecommerce-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

### `npm start`
Runs the app in development mode. Opens at http://localhost:3000

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner

## Customization

### Editing Main Page Content
To customize the main dashboard content, edit:
- **File**: `/src/components/Main.tsx`
- **Styles**: `/src/styles/main.css`

### Modifying Styles
- **Global styles**: `/src/styles/globals.css`
- **Main page styles**: `/src/styles/main.css`

### Adding New Pages
1. Create new component in `/src/components/`
2. Add route in `/src/App.tsx`
3. Import and use existing styles or create new ones

## Validation Rules

### Registration Form
- **Name**: Only alphabets and spaces, minimum 2 characters
- **Email**: Valid email format required
- **Phone**: Exactly 10 digits, numbers only
- **Password**: 6-20 characters
- **Confirm Password**: Must match password

### Login Form
- **Email**: Valid email format required
- **Password**: Required field

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- **React 18** with TypeScript
- **React Router** for navigation
- **CSS3** with modern features (backdrop-filter, gradients)
- **No external UI libraries** - pure CSS implementation

## Deployment

For production deployment:

1. Build the app:
```bash
npm run build
```

2. Deploy the `build` folder to your hosting service

---

**Note**: This frontend is designed to work with a backend API. Currently, it uses simulated API calls with delays for demonstration purposes.
