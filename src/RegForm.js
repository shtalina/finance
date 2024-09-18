import { useState } from "react";

export default function RegForm() {
    // States for registration
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // States for checking the errors
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    // Handling the name change
    const handleName = (e) => {
        setName(e.target.value);
        setSubmitted(false);
    };
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
        if (name === "" || email === "" || password === "") {
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
                <h1>User {name} successfully registered!!</h1>
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
                <h1>Please enter all the fields</h1>
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
               <h2>Sign Up</h2>
               <p>create a new account to get started</p>
              </div>
              <br />
              <div class="field-set">
                {/* Labels and inputs for form data */}
                <label className="label">Name</label>
                <input
                    onChange={handleName}
                    className="form-input"
                    value={name}
                    id="txt-input"
                    type="text"
                />

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
                Sign Up
                </button>
              </div>
             </div>
            </form>
        </div>
    );
}