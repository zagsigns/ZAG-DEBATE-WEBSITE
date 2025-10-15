import React from 'react';

/**
 * ProfileInfo Component
 * Displays the user's credit balance and subscription status.
 * (Assumes user data is passed as props or fetched from a global state/hook)
 */
const ProfileInfo = ({ userProfile }) => {
  // Mock data if no userProfile is passed (for demonstration)
  const profile = userProfile || {
    username: 'ZagDebater',
    creditBalance: 550, // Total credits the user has
    subscriptionStatus: 'Monthly Member', // e.g., 'Free Trial', 'Annual Member', 'None'
    // This could also include avatar, etc.
  };

  const isSubscribed = profile.subscriptionStatus !== 'None' && profile.subscriptionStatus !== 'Free Trial';
  
  return (
    <div className="profile-info-card">
      <h3 className="profile-username">{profile.username}'s Profile</h3>
      
      <div className="info-section credit-balance">
        <span className="label">Credit Balance:</span>
        <span className="value">{profile.creditBalance} ZAG Credits</span>
      </div>
      
      <div className="info-section subscription-status">
        <span className="label">Membership:</span>
        <span className={`status-tag ${isSubscribed ? 'active' : 'inactive'}`}>
          {profile.subscriptionStatus}
        </span>
      </div>
      
      {/* Action button based on status for high engagement */}
      {profile.subscriptionStatus === 'Free Trial' && (
        <button className="upgrade-btn">Upgrade to Full Membership</button>
      )}
      {profile.subscriptionStatus === 'None' && (
        <button className="subscribe-btn">Start Free Trial</button>
      )}
      {isSubscribed && (
        <button className="manage-btn">Manage Subscription</button>
      )}
    </div>
  );
};

export default ProfileInfo;