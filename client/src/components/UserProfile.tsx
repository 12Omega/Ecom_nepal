import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfile.css';

interface UserProfileData {
  id: string;
  username: string;
  email?: string;
  profile: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    bio?: string;
    website?: string;
    profilePicture?: string;
  };
  membershipTier?: string;
  createdAt?: string;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/profile/${userId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data.user);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (error) {
    return <div className="profile-container error">{error}</div>;
  }

  if (!profile) {
    return <div className="profile-container">Profile not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        {profile.profile.profilePicture && (
          <img 
            src={profile.profile.profilePicture} 
            alt="Profile" 
            className="profile-picture"
          />
        )}
        <h1>{profile.profile.displayName || profile.username}</h1>
        <p className="username">@{profile.username}</p>
      </div>

      <div className="profile-details">
        {profile.profile.bio && (
          <div className="profile-section">
            <h3>Bio</h3>
            {/* SECURE: Rendering user bio as plain text */}
            <p>{profile.profile.bio}</p>
          </div>
        )}

        {profile.profile.website && (
          <div className="profile-section">
            <h3>Website</h3>
            {/* SECURE: Rendering website URL as plain text with link */}
            <a 
              href={profile.profile.website} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ wordBreak: 'break-all' }}
            >
              {profile.profile.website}
            </a>
          </div>
        )}

        {profile.email && (
          <div className="profile-section">
            <h3>Email</h3>
            <p>{profile.email}</p>
          </div>
        )}

        {profile.membershipTier && (
          <div className="profile-section">
            <h3>Membership</h3>
            <p className="membership-badge">{profile.membershipTier}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;