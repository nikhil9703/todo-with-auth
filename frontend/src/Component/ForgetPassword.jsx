import React,{useState} from "react";
import axios from "axios";

const ForgotPassword = () =>{
    const[email,setEmail]=useState("");
    const[message,setmessage]=useState("");
    const handleSubmit = async(e)=>{
        e.preventDefault();
        setmessage("");
        try{
            await axios.post("http://127.0.0.1:8000/password-reset/",{email});
            setmessage("Password reset link sent");
        }catch (error){
            setmessage("Error sending mail.try again");
        }
    };
    return(
        <div className="form-container">
            <h2>Forget Password?</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                <button type="submit">Sent Reset Link</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default ForgotPassword;