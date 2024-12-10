'use client';

import { login, signup, githubLogin } from './actions';


export default function LoginPage() {
    const handleLogin = async (formData: FormData) => {
        try {

            await login(formData);

        } catch (error) {

        }
    };

    const handleSignup = async (formData: FormData) => {
        try {

            await signup(formData);

        } catch (error) {

        }
    };

    const handleGithubLogin = async () => {
        try {

            const result = await githubLogin();
            if (result?.url) {

                window.location.href = result.url; // クライアントサイドでリダイレクト
            }
        } catch (error) {

        }
    };

    return (
        <div>
            <h1>ログイン</h1>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    await handleLogin(formData);
                }}
            >
                <label htmlFor="login-email">Email:</label>
                <input id="login-email" name="email" type="email" required />
                <label htmlFor="login-password">Password:</label>
                <input id="login-password" name="password" type="password" required />
                <button type="submit">Log in</button>
            </form>

            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    await handleSignup(formData);
                }}
            >
                <label htmlFor="signup-email">Email:</label>
                <input id="signup-email" name="email" type="email" required />
                <label htmlFor="signup-password">Password:</label>
                <input id="signup-password" name="password" type="password" required />
                <button type="submit">Sign up</button>
            </form>

            <button onClick={handleGithubLogin}>GitHubでログイン</button>
        </div>
    );
}
