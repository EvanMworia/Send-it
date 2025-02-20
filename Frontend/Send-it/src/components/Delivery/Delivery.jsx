import { useState, useEffect } from "react";
import './Delivery.css';

export default function Delivery() {
    const [formData, setFormData] = useState({
        senderEmail: "",
        senderPhone: "",
        receiverEmail: "",
        receiverPhone: "",
        SendingLocation: "",
        PickupLocation: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            console.log('formdata is', formData);
            const response = await fetch("http://localhost:4000/parcel/parcels", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            console.log('response is', response);
            const data = await response.json();
            if (data.success) {
                window.location.href = data.stripeUrl; // Redirect to Stripe checkout
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Error creating parcel: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const verifySession = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get("session_id");

            if (!sessionId) return;

            try {
                const response = await fetch(`http://localhost:4000/parcel/verify-payment?session_id=${sessionId}`);
                console.log("response ", response);
                const data = await response.json();
is
                if (data.success) {
                    alert("Parcel created successfully!");
                    window.location.href = "/dashboard";
                } else {
                    alert("Payment verification failed!");
                }
            } catch (err) {
                console.error("Error verifying payment:", err);
            }
        };

        verifySession();
    }, []);

    return (
        <div className="delivery-container">
            <h2>Create a Parcel</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Sender Email</label>
                <input type="email" name="senderEmail" placeholder="Sender Email" value={formData.senderEmail} onChange={handleChange} required />

                <label>Sender Phone</label>
                <input type="text" name="senderPhone" placeholder="Sender Phone" value={formData.senderPhone} onChange={handleChange} required />

                <label>Receiver Email</label>
                <input type="email" name="receiverEmail" placeholder="Receiver Email" value={formData.receiverEmail} onChange={handleChange} required />

                <label>Receiver Phone</label>
                <input type="text" name="receiverPhone" placeholder="Receiver Phone" value={formData.receiverPhone} onChange={handleChange} required />

                <label>Sending Location</label>
                <input type="text" name="SendingLocation" placeholder="Sending Location" value={formData.SendingLocation} onChange={handleChange} required />

                <label>Pickup Location</label>
                <input type="text" name="PickupLocation" placeholder="Pickup Location" value={formData.PickupLocation} onChange={handleChange} required />

                <button type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Create Parcel"}
                </button>
            </form>
        </div>
    );
}
