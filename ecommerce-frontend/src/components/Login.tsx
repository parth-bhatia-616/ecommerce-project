import React, { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useApp } from '../contexts/AppContext';
import '../styles/globals.css';

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useApp(); // Get setUser from AppContext
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if already logged in
    React.useEffect(() => {
        const token = localStorage.getItem('vertexToken');
        if (token) {
            navigate('/main');
        }
    }, [navigate]);

    // Validation functions
    const validateEmail = (email: string): string | undefined => {
        if (!email.trim()) {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return undefined;
    };

    const validatePassword = (password: string): string | undefined => {
        if (!password) {
            return 'Password is required';
        }
        if (password.length < 1) {
            return 'Password cannot be empty';
        }
        return undefined;
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    // Validate entire form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Call real API
            const response = await authAPI.login(formData);
            
            // Store token and user data
            localStorage.setItem('vertexToken', response.token);
            localStorage.setItem('vertexUser', JSON.stringify(response.user));
            
            // Update AppContext user state
            setUser(response.user);
            
            // Navigate to main page or intended destination
            const from = location.state?.from?.pathname || '/main';
            navigate(from, { replace: true });
            
        } catch (error: any) {
            console.error('Login error:', error);
            setErrors({ 
                email: error.message || 'Login failed. Please check your credentials and try again.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="form-container">
                <div className="logo">Vertex</div>
                <h1 className="form-title">Welcome Back</h1>
                <p className="form-subtitle">Sign in to your account to continue</p>
                
                <form onSubmit={handleSubmit} noValidate>
                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="Enter your email"
                            disabled={isSubmitting}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <div className="error-message">{errors.email}</div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`form-input ${errors.password ? 'error' : ''}`}
                            placeholder="Enter your password"
                            disabled={isSubmitting}
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <div className="error-message">{errors.password}</div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing In...' : 'Login'}
                    </button>
                </form>

                {/* Navigation Link */}
                <div className="nav-link">
                    Don't have an account?{' '}
                    <Link to="/register" className="link">
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
