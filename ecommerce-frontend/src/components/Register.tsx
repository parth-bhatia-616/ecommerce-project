import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/globals.css';

interface FormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation functions
    const validateName = (name: string): string | undefined => {
        if (!name.trim()) {
            return 'Name is required';
        }
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return 'Name can only contain alphabets and spaces';
        }
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters long';
        }
        return undefined;
    };

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

    const validatePhone = (phone: string): string | undefined => {
        if (!phone.trim()) {
            return 'Phone number is required';
        }
        if (!/^\d+$/.test(phone)) {
            return 'Phone number can only contain numbers';
        }
        if (phone.length !== 10) {
            return 'Phone number must be exactly 10 digits';
        }
        return undefined;
    };

    const validatePassword = (password: string): string | undefined => {
        if (!password.trim()) {
            return 'Password is required';
        }
        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        return undefined;
    };

    const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
        if (!confirmPassword) {
            return 'Please confirm your password';
        }
        if (confirmPassword !== password) {
            return 'Passwords do not match';
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

        const nameError = validateName(formData.name);
        if (nameError) newErrors.name = nameError;

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const phoneError = validatePhone(formData.phone);
        if (phoneError) newErrors.phone = phoneError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
        if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

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
            const response = await authAPI.register(formData);
            
            // Store token and user data
            localStorage.setItem('vertexToken', response.token);
            localStorage.setItem('vertexUser', JSON.stringify(response.user));
            
            // Navigate to main page
            navigate('/main', { replace: true });
            
        } catch (error: any) {
            console.error('Registration error:', error);
            
            // Handle specific validation errors
            if (error.errors && Array.isArray(error.errors)) {
                const newErrors: FormErrors = {};
                error.errors.forEach((err: any) => {
                    if (err.path === 'name') newErrors.name = err.msg;
                    if (err.path === 'email') newErrors.email = err.msg;
                    if (err.path === 'phone') newErrors.phone = err.msg;
                    if (err.path === 'password') newErrors.password = err.msg;
                    if (err.path === 'confirmPassword') newErrors.confirmPassword = err.msg;
                });
                setErrors(newErrors);
            } else {
                setErrors({ 
                    email: error.message || 'Registration failed. Please try again.' 
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="form-container">
                <div className="logo">Vertex</div>
                <h1 className="form-title">Create Account</h1>
                <p className="form-subtitle">Join us today and start shopping</p>
                
                <form onSubmit={handleSubmit} noValidate>
                    {/* Name Field */}
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            placeholder="Enter your full name"
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <div className="error-message">{errors.name}</div>
                        )}
                    </div>

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
                        />
                        {errors.email && (
                            <div className="error-message">{errors.email}</div>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div className="form-group">
                        <label htmlFor="phone" className="form-label">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`form-input ${errors.phone ? 'error' : ''}`}
                            placeholder="Enter 10-digit phone number"
                            maxLength={10}
                            disabled={isSubmitting}
                        />
                        {errors.phone && (
                            <div className="error-message">{errors.phone}</div>
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
                        />
                        {errors.password && (
                            <div className="error-message">{errors.password}</div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                            placeholder="Confirm your password"
                            disabled={isSubmitting}
                        />
                        {errors.confirmPassword && (
                            <div className="error-message">{errors.confirmPassword}</div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                {/* Navigation Link */}
                <div className="nav-link">
                    Already have an account?{' '}
                    <Link to="/login" className="link">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
