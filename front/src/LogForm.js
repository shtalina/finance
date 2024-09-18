import { useState } from "react";

export default function LogForm() {
    // States for registration
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // States for checking the errors
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    
    // Handling the email change
    const handleEmail = (e) => {
        setEmail(e.target.value);
        setSubmitted(false);
    };
    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setSubmitted(false);
    };
    // Handling the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === "" || password === "") {
            setError(true);
        } else {
            setSubmitted(true);
            setError(false);
        }
    };
    // Showing success message
    const successMessage = () => {
        return (
            <div
                className="success"
                style={{
                    display: submitted ? "" : "none",
                }}
            >
                <h1>Now you are loged in!!</h1>
            </div>
        );
    };
    // Showing error message if error is true
    const errorMessage = () => {
        return (
            <div
                className="error"
                style={{
                    display: error ? "" : "none",
                }}
            >
                <h1>Oops! Please enter all the fields correctly</h1>
            </div>
        );
    };

    return (
        <div className="form">
            {/* Calling to the methods */}
            <div className="messages">
                {errorMessage()}
                {successMessage()}
            </div>

            <form>
             <div class="con">
              <div class="header">
               <h2>Log In</h2>
               <p>login here using your email and password</p>
              </div>
              <br />
              <div class="field-set">
                {/* Labels and inputs for form data */}
                
                <label className="label">Email</label>
                <input
                    onChange={handleEmail}
                    className="form-input"
                    value={email}
                    type="email"
                />

                <label className="label">Password</label>
                <input
                    onChange={handlePassword}
                    className="form-input"
                    value={password}
                    type="password"
                />

                <button onClick={handleSubmit} className="btn" type="submit">
                Log In
                </button>
              </div>
             </div>
            </form>
        </div>
    );
}