import { useNavigate } from "react-router-dom";

const Fail = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Payment Failed ❌</h2>
            <p>Oops! Something went wrong. Please try again.</p>
            <button onClick={() => navigate("/delivery")}>Try Again</button>
        </div>
    );
};

export default Fail;
