import React, { useEffect, useState } from 'react';
import '../../styles/Requests.css';

const API = 'http://localhost:3000/api';

function Requests() {
    const [tab, setTab] = useState('received');
    const [received, setReceived] = useState([]);
    const [sent, setSent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRequests();
    }, []);

    async function loadRequests() {
        setLoading(true);
        try {
            const [receivedResponse, sentResponse] = await Promise.all([
                fetch(`${API}/requests/received`, { credentials: 'include' }),
                fetch(`${API}/requests/sent`, { credentials: 'include' })
            ]);

            const receivedData = await receivedResponse.json();
            const sentData = await sentResponse.json();

            if (!receivedResponse.ok) throw new Error(receivedData.msg || 'Could not load received requests');
            if (!sentResponse.ok) throw new Error(sentData.msg || 'Could not load sent requests');

            setReceived(receivedData.requests || []);
            setSent(sentData.requests || []);
        } catch (e) {
            setError(e.message || 'Could not load requests');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="requests-page"><p>Loading requests...</p></div>;

    const empty = tab === 'received' ? (
        <div className="request-empty">📭<h3>No requests yet</h3><p>Requests from other users will appear here.</p></div>
    ) : (
        <div className="request-empty">📨<h3>No requests sent</h3><p>Your buy and exchange requests will appear here.</p></div>
    );

    return (
        <div className="requests-page">
            <div className="requests-header">
                <h1>Requests</h1>
                <p>View buying and exchange requests for your items.</p>
            </div>

            <div className="requests-tabs">
                <button className={tab === 'received' ? 'active' : ''} onClick={() => setTab('received')}>
                    Received ({received.length})
                </button>
                <button className={tab === 'sent' ? 'active' : ''} onClick={() => setTab('sent')}>
                    My Requests ({sent.length})
                </button>
            </div>

            {error && <p className="request-page-error">{error}</p>}

            {tab === 'received' ? (
                received.length === 0 ? empty : (
                    <div className="request-list">
                        {received.map(request => (
                            <div className="request-card" key={request._id}>
                                <div className="request-card-top">
                                    <span className={`request-type ${request.type.toLowerCase()}`}>{request.type}</span>
                                </div>
                                <h3>{request.listing?.title}</h3>
                                <p><strong>From:</strong> {request.requester?.name || request.requester?.username}</p>
                                <p><strong>Email:</strong> {request.requesterEmail}</p>
                                <p><strong>WhatsApp:</strong> {request.requesterWhatsapp}</p>
                                {request.offeredListing && <p><strong>Offered item:</strong> {request.offeredListing.title}</p>}
                                {request.message && <div className="request-message">“{request.message}”</div>}
                                <p className="request-date">{new Date(request.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                sent.length === 0 ? empty : (
                    <div className="request-list">
                        {sent.map(request => (
                            <div className="request-card" key={request._id}>
                                <div className="request-card-top">
                                    <span className={`request-type ${request.type.toLowerCase()}`}>{request.type}</span>
                                </div>
                                <h3>{request.listing?.title}</h3>
                                <p><strong>Seller:</strong> {request.seller?.name || request.seller?.username}</p>
                                <p><strong>Email:</strong> {request.seller?.email || 'Not available'}</p>
                                {request.offeredListing && <p><strong>You offered:</strong> {request.offeredListing.title}</p>}
                                {request.message && <div className="request-message">“{request.message}”</div>}
                                <p className="request-date">{new Date(request.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}

export default Requests;
