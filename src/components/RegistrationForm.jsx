import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { User, Users, CheckCircle } from 'lucide-react';

const RegistrationForm = ({ onSuccess }) => {
    const [teamSize, setTeamSize] = useState(1);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [leader, setLeader] = useState({ name: '', email: '', mobile: '', roll: '' });
    const [members, setMembers] = useState([]);

    const events = ['Cryptix', 'WebWarp', 'Kaggle Royale'];

    const handleEventToggle = (event) => {
        setSelectedEvents(prev =>
            prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]
        );
    };

    const handleTeamSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setTeamSize(newSize);

        // Adjust members array size
        const newMembers = [...members];
        if (newSize > 1) {
            // We need newSize - 1 members (leader is separate)
            // But strictly speaking, the original code had leader + (size-1) members if size > 1?
            // Original code: for (let i = 2; i <= size; i++) members...
            // So yes, size 1 = 0 members. Size 2 = 1 member (Member 2).

            const requiredMembers = newSize - 1;
            if (newMembers.length < requiredMembers) {
                for (let i = newMembers.length; i < requiredMembers; i++) {
                    newMembers.push({ name: '', email: '', roll: '' });
                }
            } else if (newMembers.length > requiredMembers) {
                newMembers.splice(requiredMembers);
            }
            setMembers(newMembers);
        } else {
            setMembers([]);
        }
    };

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedEvents.length === 0) {
            alert("Please select at least one event.");
            return;
        }

        try {
            setIsSubmitting(true);
            await addDoc(collection(db, "registrations"), {
                event: "ISTE X Colloquium",
                selectedEvents,
                teamSize,
                leader,
                members,
                timestamp: serverTimestamp()
            });
            onSuccess();
        } catch (error) {
            console.error("Error submitting registration:", error);
            alert("Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="portal-container" id="formContent">
            <h1>ISTE X Colloquium</h1>

            <span className="section-label">Select Events</span>
            <div className="event-grid">
                {events.map((event, index) => (
                    <div
                        key={event}
                        className={`event-card ${selectedEvents.includes(event) ? 'active' : ''}`}
                        onClick={() => handleEventToggle(event)}
                        style={event === 'Kaggle Royale' ? { gridColumn: 'span 2' } : {}}
                    >
                        {event}
                    </div>
                ))}
            </div>

            <span className="section-label">Select Team Size</span>
            <div className="select-wrapper">
                <Users className="input-icon" />
                <select id="teamSize" value={teamSize} onChange={handleTeamSizeChange}>
                    <option value="1">1 (Individual)</option>
                    <option value="2">2 Members</option>
                    <option value="3">3 Members</option>
                    <option value="4">4 Members</option>
                </select>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="details-box">
                    <div className="details-header">
                        <div className="badge">
                            <User className="user-icon-small" />
                            <span className="section-label" style={{ margin: 0, fontSize: '0.65rem' }}>Team Details</span>
                        </div>
                        <div className="badge">
                            <span className="size-text">{teamSize}</span>
                        </div>
                    </div>

                    <div className="leader-form">
                        <input
                            type="text"
                            placeholder="Leader Full Name"
                            required
                            value={leader.name}
                            onChange={(e) => setLeader({ ...leader, name: e.target.value })}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                value={leader.email}
                                onChange={(e) => setLeader({ ...leader, email: e.target.value })}
                            />
                            <input
                                type="tel"
                                placeholder="Mobile (10 digits)"
                                pattern="[0-9]{10}"
                                required
                                value={leader.mobile}
                                onChange={(e) => setLeader({ ...leader, mobile: e.target.value })}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Roll Number (10 digits)"
                            pattern="[0-9]{10}"
                            required
                            value={leader.roll}
                            onChange={(e) => setLeader({ ...leader, roll: e.target.value })}
                        />
                    </div>

                    {members.map((member, index) => (
                        <div key={index} className="member-card">
                            <span className="section-label" style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                                Team Member {index + 2}
                            </span>
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                value={member.name}
                                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={member.email}
                                    onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Roll Number"
                                    required
                                    pattern="[0-9]{10}"
                                    value={member.roll}
                                    onChange={(e) => handleMemberChange(index, 'roll', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button className="btn-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "EXECUTING..." : "Execute Registration"}
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm;
