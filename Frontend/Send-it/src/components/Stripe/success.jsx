import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const Success = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/parcel/verify-payment?session_id=${sessionId}`);
                if (response.data.success) {
                    setTimeout(() => navigate("/dashboard"), 3000);
                }
            } catch (error) {
                console.error("Payment verification failed:", error);
                navigate("/fail");
            }
        };

        if (sessionId) verifyPayment();
    }, [sessionId, navigate]);

    return (
        <div>
            <h2>Payment Successful 🎉</h2>
            <p>Your parcel has been created successfully.</p>
        </div>
    );
};

export default Success;
