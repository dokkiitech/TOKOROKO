'use client';

import { login, signup, githubLogin } from './actions';
import './LoginPage.css';

export default function LoginPage() {
    const handleLogin = async (formData: FormData) => {
        try {
            await login(formData);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleSignup = async (formData: FormData) => {
        try {
            await signup(formData);
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    const handleGithubLogin = async () => {
        try {
            const result = await githubLogin();
            if (result?.url) {
                window.location.href = result.url; // クライアントサイドでリダイレクト
            }
        } catch (error) {
            console.error('GitHub login error:', error);
        }
    };

    return (
        <div className="container">
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

                <div className="form-group">
                    <button onClick={handleGithubLogin} className="button github-button">Log in with GitHub</button>
                </div>

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
