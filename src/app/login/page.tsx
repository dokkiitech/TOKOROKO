'use client';

import { useState } from 'react';
import { login, signup } from './actions';
import './LoginPage.css';

export default function LoginPage() {
    const [alertMessage, setAlertMessage] = useState('');

    const handleLogin = async (formData: FormData) => {
        try {
            await login(formData);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleSignup = async (formData: FormData) => {
        try {
            const message = await signup(formData);
            setAlertMessage(message);
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    return (
        <div className="container">
            {alertMessage && <div className="alert">{alertMessage}</div>}
            <div className="logo-container">
                <h2 className="title">Sign in to your account</h2>
            </div>

            <div className="form-container">
                <form className="form" onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    await handleLogin(formData);
                }}>
                    <div className="form-group">
                        <label htmlFor="email" className="label">Email address</label>
                        <input id="email" name="email" type="email" autoComplete="email" required className="input" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="label">Password</label>
                        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="button">Log in</button>
                    </div>
                </form>

                <p className="text">
                    Not a member?{' '}
                    <a href="#" className="link">Sign up</a>
                </p>
            </div>

            <div className="form-container">
                <form className="form" onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    await handleSignup(formData);
                }}>
                    <div className="form-group">
                        <label htmlFor="email" className="label">Email address</label>
                        <input id="email" name="email" type="email" autoComplete="email" required className="input" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="label">Password</label>
                        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="button">Sign up</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
