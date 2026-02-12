import React from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

const SuccessMessage = () => {
    return (
        <div className="portal-container" id="successMessage">
            <div className="success-overlay">
                <h2 className="success-title">REGISTRATION COMPLETE</h2>

                <div className="lottie-wrap">
                    <DotLottiePlayer
                        src="https://lottie.host/695a2df3-8f64-4b82-b5d8-6e9312ae815e/AzFfG9uxDX.lottie"
                        autoplay
                        loop
                        style={{ width: '200px', height: '160px' }}
                    />
                </div>

                <div className="session-info">
                    <div className="session-id">SEE YOU AT COLLOQUIUM</div>
                    <button
                        className="btn-redirect"
                        onClick={() => window.location.href = 'https://colloquium.netlify.app/'}
                    >
                        REDIRECT TO COLLOQUIUM WEBSITE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessMessage;
