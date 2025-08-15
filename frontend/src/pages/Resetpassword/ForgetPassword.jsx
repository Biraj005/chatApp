import React, { useContext, useState } from 'react';
import './ForgetPassword.css';
import { AuthContext } from '../../store/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {

    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { getOtp, verifyOtp, otpVerified, Resetpassword, setOtpverified } = useContext(AuthContext);

    const handleNext = async (e) => {
        e.preventDefault();

        if (step === 1) {
            const res = await getOtp(email);
            if (res) {
                toast.success("OTP is sent to your email");
                setStep(2);
            }
        }
        else if (step === 2) {
            const response = await verifyOtp(email, otp);
            if (response) {
                toast.success("Otp is verified");
                setStep(step + 1);
            }
        }
        else if (step === 3 && otpVerified) {
            if (newPassword !== confirmPassword) {
                toast.error("Confirm password should be same");
                return;
            }
            if (newPassword.length < 8) {
                toast.error("Password length should be minimum 8 ");
                return;
            }

            const response = await Resetpassword(newPassword, email);

            if (response) {
                toast.success("Password is updated");
                navigate("/login");
            } else {
                toast.error("Password is not updated");
            }
            setOtpverified(false);
        }
    };

    return (
        <div className="forget-bg">
            <div className="forget-wrapper">
                <form className="forget-box" onSubmit={handleNext}>
                    {step === 1 && (
                        <>
                            <h2 className="forget-title">Forgot Password</h2>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit">Send OTP</button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="forget-title">Enter OTP</h2>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <button type="submit">Verify OTP</button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2 className="forget-title">Set New Password</h2>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="submit">Reset Password</button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ForgetPassword;
