import React from "react";
import { useNavigate } from "react-router-dom"; 
import './front.css';

const Front = () => {
    const navigate = useNavigate();  

    return (
        <div>
            <div className="title">
                <p>WELCOME TO THE WEBSITE</p>
            </div>
            
            <div className="login_reg_box">
                <div className="btn_container">
                    <button className="frontpage_login_btn" onClick={() => navigate("/login")}> 
                        Login
                    </button>
                </div>
                <div className="btn_container">            
                    <button className ="frontpage_register_btn" onClick={() => navigate("/register")}> 
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Front;
