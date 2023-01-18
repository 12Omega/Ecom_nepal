import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

interface UserProfileData {
  _id: string;
  username: string;
  email: string;
  role: string;
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
    dateOfBirth: string;
    gender: string;
    bio: string;
    profilePicture: string;
    coverPhoto: string;
    phone: string;
    alternateEmail: string;
    website: string;
    addresses: Array<{
      type: string;
      street: string;
      street2: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      isDefault: boolean;
      isActive: boolean;
    }>;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;
    timezone: string;
    preferences: {
      language: string;
      currency: string;
      notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
        marketing: boolean;
      };
      privacy: {
        profileVisibility: string;
        showEmail: boolean;
        showPhone: boolean;
        allowMessages: boolean;
      };
      shopping: {
        favoriteCategories: string[];
        priceRange: {
          min: number;
          max: number;
        };
        brands: string[];
        size: string;
        color: string;
      };
    };
    socialMedia: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
      youtube: string;
    };
  };
  accountStatus: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  loyaltyPoints: number;
  membershipTier: string;
  totalSpent: number;
  totalOrders: number;
  profileCompleteness: number;
  lastLogin: string;
  lastActivity: string;
  loginCount: number;
  wishlist: Array<{
    productId: string;
    addedAt: string;
  }>;
  favoriteCategories: string[];
  recentlyViewed: Array<{
    productId: string;
    viewedAt: string;
  }>;
  paymentMethods: Array<{
    type: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
    isActive: boolean;
    addedAt: string;
  }>;
  subscriptions: Array<{
    type: string;
    subscribedAt: string;
  }>;
  referralCode: string;
  referredBy: string;
  referralCount: number;
  createdAt: string;
  updatedAt: string;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfileData>>({});
  const [statusMessage, setStatusMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
    
    // VULNERABILITY: DOM-based XSS from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const welcomeMessage = urlParams.get('welcome');
    const errorMessage = urlParams.get('error');
    
    if (welcomeMessage) {
      // VULNERABILITY: Unsafe rendering of URL parameter
      const welcomeDiv = document.getElementById('welcome-message');
      if (welcomeDiv) {
        welcomeDiv.innerHTML = `Welcome back, ${welcomeMessage}!`;
      }
    }
    
    if (errorMessage) {
      // VULNERABILITY: Unsafe rendering of URL parameter
      setStatusMessage(errorMessage);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('userToken');
      
      if (!userId) {
        setStatusMessage('No user ID found. Please log in.');
        return;
      }
      
      const response = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setProfile(response.data.user);
      setFormData(response.data.user);
      
      // VULNERABILITY: Log profile data
      console.log('Profile loaded:', response.data);
      console.log('User token:', token);
      
    } catch (error: any) {
      console.error('Error loading profile:', error);
      
      // VULNERABILITY: Expose detailed error information
      if (error.response) {
        console.error('Profile error:', error.response.data);
        setStatusMessage(`Error loading profile: ${error.response.data.message || 'Unknown error'}`);
      } else {
        setStatusMessage('Error loading profile: Network error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties
      const keys = name.split('.');
      setFormData(prev => {
        const updated = { ...prev };
        let current: any = updated;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        
        if (type === 'checkbox') {
          current[keys[keys.length - 1]] = (e.target as HTMLInputElement).checked;
        } else {
          current[keys[keys.length - 1]] = value;
        }
        
        return updated;
      });
    } else {
      if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'profile') {
        setProfilePicture(e.target.files[0]);
      } else {
        setCoverPhoto(e.target.files[0]);
      }
    }
  };

  const saveProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('userToken');
      
      if (!userId) {
        setStatusMessage('No user ID found. Please log in.');
        return;
      }
      
      // VULNERABILITY: Client-side role manipulation
      const updateData = {
        ...formData,
        // Allow role to be modified client-side
        role: formData.role || profile?.role
      };

      const response = await axios.put(`http://localhost:5000/api/users/profile/${userId}`, updateData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      setProfile(response.data.user);
      setIsEditing(false);
      setStatusMessage('Profile updated successfully!');
      
      // VULNERABILITY: Expose sensitive data in console
      console.log('Profile update response:', response.data);
      console.log('User token:', token);
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      // VULNERABILITY: Expose detailed error information
      if (error.response) {
        console.error('Update error:', error.response.data);
        setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        setStatusMessage(`Error: ${error.message}`);
      }
    }
  };

  const uploadFile = async (file: File, type: 'profile' | 'cover') => {
    if (!file) return;

    const formData = new FormData();
    formData.append(type === 'profile' ? 'profilePicture' : 'coverPhoto', file);
    
    // VULNERABILITY: Expose user ID in client-side
    const userId = localStorage.getItem('userId') || profile?._id || '';
    formData.append('userId', userId);

    try {
      const token = localStorage.getItem('userToken');
      const endpoint = type === 'profile' ? 'upload-picture' : 'upload-cover';
      const response = await axios.post(`http://localhost:5000/api/users/profile/${userId}/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      setStatusMessage(`${type === 'profile' ? 'Profile picture' : 'Cover photo'} uploaded successfully!`);
      loadUserProfile(); // Refresh profile data
      
      // VULNERABILITY: Expose file upload details
      console.log('Upload response:', response.data);
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      
      // VULNERABILITY: Expose error details
      if (error.response) {
        console.error('Upload error:', error.response.data);
        setStatusMessage(`Upload error: ${error.response.data.message || error.message}`);
      } else {
        setStatusMessage(`Upload error: ${error.message}`);
      }
    }
  };

  const deleteAccount = async () => {
    // VULNERABILITY: Client-side confirmation only
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmation !== 'DELETE') return;

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('userToken');
      
      if (!userId) {
        setStatusMessage('No user ID found. Please log in.');
        return;
      }
      
      await axios.delete(`http://localhost:5000/api/users/profile/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      localStorage.clear();
      setStatusMessage('Account deleted successfully');
      
      // VULNERABILITY: Log deletion
      console.log('Account deleted for user:', userId);
      
    } catch (error: any) {
      console.error('Error deleting account:', error);
      
      // VULNERABILITY: Expose error details
      if (error.response) {
        console.error('Deletion error:', error.response.data);
        setStatusMessage(`Deletion error: ${error.response.data.message || error.message}`);
      } else {
        setStatusMessage(`Deletion error: ${error.message}`);
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getMembershipTierColor = (tier: string) => {
    const colors: { [key: string]: string } = {
      bronze: '#cd7f32',
      silver: '#c0c0c0',
      gold: '#ffd700',
      platinum: '#e5e4e2',
      diamond: '#b9f2ff'
    };
    return colors[tier] || '#666';
  };

  if (loading) {
    return (
      <div className="user-profile">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="user-profile">
        <div className="error">
          <h2>Profile not found</h2>
          <p>Unable to load your profile. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="container">
        {/* VULNERABILITY: DOM-based XSS container */}
        <div id="welcome-message" className="welcome-message"></div>
        
        {/* Status message with potential XSS */}
        {statusMessage && (
          <div 
            className="status-message"
            dangerouslySetInnerHTML={{ __html: statusMessage }}
          />
        )}

        {/* Profile Header */}
        <div className="profile-header">
          <div className="cover-photo-container">
            <img 
              src={profile.profile.coverPhoto || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop'}
              alt="Cover"
              className="cover-photo"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop';
              }}
            />
            <div className="cover-photo-overlay">
              <input
                type="file"
                id="cover-upload"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'cover')}
                style={{ display: 'none' }}
              />
              <button 
                onClick={() => document.getElementById('cover-upload')?.click()}
                className="change-cover-btn"
              >
                📷 Change Cover
              </button>
            </div>
          </div>

          <div className="profile-info-header">
            <div className="profile-picture-container">
              <img 
                src={profile.profile.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                alt="Profile"
                className="profile-picture"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
                }}
              />
              <div className="profile-picture-overlay">
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'profile')}
                  style={{ display: 'none' }}
                />
                <button 
                  onClick={() => document.getElementById('profile-upload')?.click()}
                  className="change-picture-btn"
                >
                  📷
                </button>
              </div>
            </div>

            <div className="profile-details">
              <h1>
                {profile.profile.displayName || `${profile.profile.firstName} ${profile.profile.lastName}` || profile.username}
              </h1>
              <p className="username">@{profile.username}</p>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{profile.totalOrders}</span>
                  <span className="stat-label">Orders</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{formatCurrency(profile.totalSpent)}</span>
                  <span className="stat-label">Total Spent</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{profile.loyaltyPoints}</span>
                  <span className="stat-label">Points</span>
                </div>
                <div className="stat-item">
                  <span 
                    className="stat-value membership-tier"
                    style={{ color: getMembershipTierColor(profile.membershipTier) }}
                  >
                    {profile.membershipTier.toUpperCase()}
                  </span>
                  <span className="stat-label">Tier</span>
                </div>
              </div>

              <div className="profile-badges">
                {profile.emailVerified && (
                  <span className="badge verified">✓ Email Verified</span>
                )}
                {profile.phoneVerified && (
                  <span className="badge verified">✓ Phone Verified</span>
                )}
                {profile.twoFactorEnabled && (
                  <span className="badge security">🔒 2FA Enabled</span>
                )}
                <span className={`badge status-${profile.accountStatus}`}>
                  {profile.accountStatus.toUpperCase()}
                </span>
              </div>

              <div className="profile-completion">
                <div className="completion-bar">
                  <div 
                    className="completion-fill" 
                    style={{ width: `${profile.profileCompleteness}%` }}
                  ></div>
                </div>
                <span className="completion-text">
                  Profile {profile.profileCompleteness}% complete
                </span>
              </div>
            </div>
          </div>
        </div>
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* VULNERABILITY: Client-side role modification */}
              <div className="form-group">
                <label>Role:</label>
                <select
                  name="role"
                  value={formData.role || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>

              <div className="form-actions">
                <button onClick={saveProfile} className="save-btn">
                  Save Changes
                </button>
                <button onClick={() => setIsEditing(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-picture-section">
          <h3>Profile Picture</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <button onClick={uploadProfilePicture} className="upload-btn">
            Upload Picture
          </button>
        </div>

        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <button onClick={deleteAccount} className="delete-btn">
            Delete Account
          </button>
        </div>
      </div>

      {/* VULNERABILITY: Expose sensitive data in hidden elements */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.userData = ${JSON.stringify(profile)};
            window.userToken = "${localStorage.getItem('userToken')}";
            console.log('User data exposed globally:', window.userData);
          `
        }}
      />
    </div>
  );
};

export default UserProfile;
        {/* Navigation Tabs */}
        <div className="profile-nav">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            👤 Overview
          </button>
          <button 
            className={activeTab === 'personal' ? 'active' : ''}
            onClick={() => setActiveTab('personal')}
          >
            📝 Personal Info
          </button>
          <button 
            className={activeTab === 'preferences' ? 'active' : ''}
            onClick={() => setActiveTab('preferences')}
          >
            ⚙️ Preferences
          </button>
          <button 
            className={activeTab === 'security' ? 'active' : ''}
            onClick={() => setActiveTab('security')}
          >
            🔒 Security
          </button>
          <button 
            className={activeTab === 'activity' ? 'active' : ''}
            onClick={() => setActiveTab('activity')}
          >
            📊 Activity
          </button>
          <button 
            className={activeTab === 'loyalty' ? 'active' : ''}
            onClick={() => setActiveTab('loyalty')}
          >
            🏆 Loyalty & Rewards
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-grid">
                {/* Basic Information */}
                <div className="info-card">
                  <h3>Basic Information</h3>
                  <div className="info-content">
                    <div className="info-item">
                      <strong>Full Name:</strong>
                      <span>{profile.profile.firstName} {profile.profile.lastName}</span>
                    </div>
                    <div className="info-item">
                      <strong>Email:</strong>
                      <span>{profile.email}</span>
                    </div>
                    <div className="info-item">
                      <strong>Phone:</strong>
                      <span>{profile.profile.phone || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <strong>Date of Birth:</strong>
                      <span>{profile.profile.dateOfBirth ? formatDate(profile.profile.dateOfBirth) : 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <strong>Gender:</strong>
                      <span>{profile.profile.gender || 'Not specified'}</span>
                    </div>
                    <div className="info-item">
                      <strong>Member Since:</strong>
                      <span>{formatDate(profile.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="info-card">
                  <h3>Account Status</h3>
                  <div className="info-content">
                    <div className="info-item">
                      <strong>Status:</strong>
                      <span className={`status-badge status-${profile.accountStatus}`}>
                        {profile.accountStatus.toUpperCase()}
                      </span>
                    </div>
                    <div className="info-item">
                      <strong>Email Verified:</strong>
                      <span className={profile.emailVerified ? 'verified' : 'unverified'}>
                        {profile.emailVerified ? '✓ Verified' : '✗ Not Verified'}
                      </span>
                    </div>
                    <div className="info-item">
                      <strong>Phone Verified:</strong>
                      <span className={profile.phoneVerified ? 'verified' : 'unverified'}>
                        {profile.phoneVerified ? '✓ Verified' : '✗ Not Verified'}
                      </span>
                    </div>
                    <div className="info-item">
                      <strong>2FA Enabled:</strong>
                      <span className={profile.twoFactorEnabled ? 'enabled' : 'disabled'}>
                        {profile.twoFactorEnabled ? '🔒 Enabled' : '🔓 Disabled'}
                      </span>
                    </div>
                    <div className="info-item">
                      <strong>Last Login:</strong>
                      <span>{formatDate(profile.lastLogin)}</span>
                    </div>
                    <div className="info-item">
                      <strong>Login Count:</strong>
                      <span>{profile.loginCount} times</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="info-card">
                  <h3>Quick Stats</h3>
                  <div className="stats-grid">
                    <div className="stat-box">
                      <div className="stat-number">{profile.wishlist.length}</div>
                      <div className="stat-label">Wishlist Items</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-number">{profile.recentlyViewed.length}</div>
                      <div className="stat-label">Recently Viewed</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-number">{profile.paymentMethods.length}</div>
                      <div className="stat-label">Payment Methods</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-number">{profile.referralCount}</div>
                      <div className="stat-label">Referrals</div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {profile.profile.bio && (
                  <div className="info-card bio-card">
                    <h3>About Me</h3>
                    <p>{profile.profile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="personal-tab">
              <div className="form-section">
                <h3>Personal Information</h3>
                {!isEditing ? (
                  <div className="info-display">
                    <div className="info-grid">
                      <div className="info-item">
                        <strong>First Name:</strong>
                        <span>{profile.profile.firstName || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Last Name:</strong>
                        <span>{profile.profile.lastName || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Display Name:</strong>
                        <span>{profile.profile.displayName || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Date of Birth:</strong>
                        <span>{profile.profile.dateOfBirth ? formatDate(profile.profile.dateOfBirth) : 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Gender:</strong>
                        <span>{profile.profile.gender || 'Not specified'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Phone:</strong>
                        <span>{profile.profile.phone || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Alternate Email:</strong>
                        <span>{profile.profile.alternateEmail || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Website:</strong>
                        <span>{profile.profile.website || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Timezone:</strong>
                        <span>{profile.profile.timezone}</span>
                      </div>
                    </div>
                    
                    {profile.profile.bio && (
                      <div className="bio-section">
                        <strong>Bio:</strong>
                        <p>{profile.profile.bio}</p>
                      </div>
                    )}

                    <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                      Edit Personal Information
                    </button>
                  </div>
                ) : (
                  <div className="edit-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>First Name:</label>
                        <input
                          type="text"
                          name="profile.firstName"
                          value={formData.profile?.firstName || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name:</label>
                        <input
                          type="text"
                          name="profile.lastName"
                          value={formData.profile?.lastName || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Display Name:</label>
                        <input
                          type="text"
                          name="profile.displayName"
                          value={formData.profile?.displayName || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Date of Birth:</label>
                        <input
                          type="date"
                          name="profile.dateOfBirth"
                          value={formData.profile?.dateOfBirth ? new Date(formData.profile.dateOfBirth).toISOString().split('T')[0] : ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Gender:</label>
                        <select
                          name="profile.gender"
                          value={formData.profile?.gender || ''}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Phone:</label>
                        <input
                          type="tel"
                          name="profile.phone"
                          value={formData.profile?.phone || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Alternate Email:</label>
                        <input
                          type="email"
                          name="profile.alternateEmail"
                          value={formData.profile?.alternateEmail || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Website:</label>
                        <input
                          type="url"
                          name="profile.website"
                          value={formData.profile?.website || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Timezone:</label>
                        <select
                          name="profile.timezone"
                          value={formData.profile?.timezone || ''}
                          onChange={handleInputChange}
                        >
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Chicago">Central Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                          <option value="Europe/London">London</option>
                          <option value="Europe/Paris">Paris</option>
                          <option value="Asia/Tokyo">Tokyo</option>
                          <option value="Asia/Shanghai">Shanghai</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Bio:</label>
                      <textarea
                        name="profile.bio"
                        value={formData.profile?.bio || ''}
                        onChange={handleInputChange}
                        rows={4}
                        maxLength={500}
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="form-actions">
                      <button onClick={saveProfile} className="btn btn-primary">
                        Save Changes
                      </button>
                      <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Addresses */}
              <div className="form-section">
                <h3>Addresses</h3>
                <div className="addresses-list">
                  {profile.profile.addresses && profile.profile.addresses.length > 0 ? (
                    profile.profile.addresses.map((address, index) => (
                      <div key={index} className="address-card">
                        <div className="address-header">
                          <span className="address-type">{address.type.toUpperCase()}</span>
                          {address.isDefault && <span className="default-badge">Default</span>}
                        </div>
                        <div className="address-content">
                          <p>{address.street}</p>
                          {address.street2 && <p>{address.street2}</p>}
                          <p>{address.city}, {address.state} {address.zipCode}</p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No addresses added yet.</p>
                  )}
                  <button className="btn btn-outline">Add New Address</button>
                </div>
              </div>

              {/* Social Media */}
              <div className="form-section">
                <h3>Social Media</h3>
                <div className="social-media-grid">
                  <div className="social-item">
                    <strong>Facebook:</strong>
                    <span>{profile.profile.socialMedia.facebook || 'Not connected'}</span>
                  </div>
                  <div className="social-item">
                    <strong>Twitter:</strong>
                    <span>{profile.profile.socialMedia.twitter || 'Not connected'}</span>
                  </div>
                  <div className="social-item">
                    <strong>Instagram:</strong>
                    <span>{profile.profile.socialMedia.instagram || 'Not connected'}</span>
                  </div>
                  <div className="social-item">
                    <strong>LinkedIn:</strong>
                    <span>{profile.profile.socialMedia.linkedin || 'Not connected'}</span>
                  </div>
                  <div className="social-item">
                    <strong>YouTube:</strong>
                    <span>{profile.profile.socialMedia.youtube || 'Not connected'}</span>
                  </div>
                </div>
                <button className="btn btn-outline">Update Social Media</button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="preferences-tab">
              <div className="preferences-grid">
                {/* General Preferences */}
                <div className="preference-section">
                  <h3>General Preferences</h3>
                  <div className="preference-item">
                    <label>Language:</label>
                    <select
                      name="profile.preferences.language"
                      value={formData.profile?.preferences?.language || profile.profile.preferences.language}
                      onChange={handleInputChange}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                  <div className="preference-item">
                    <label>Currency:</label>
                    <select
                      name="profile.preferences.currency"
                      value={formData.profile?.preferences?.currency || profile.profile.preferences.currency}
                      onChange={handleInputChange}
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="preference-section">
                  <h3>Notification Preferences</h3>
                  <div className="checkbox-group">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="profile.preferences.notifications.email"
                        checked={formData.profile?.preferences?.notifications?.email ?? profile.profile.preferences.notifications.email}
                        onChange={handleInputChange}
                      />
                      <span>Email Notifications</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="profile.preferences.notifications.sms"
                        checked={formData.profile?.preferences?.notifications?.sms ?? profile.profile.preferences.notifications.sms}
                        onChange={handleInputChange}
                      />
                      <span>SMS Notifications</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="profile.preferences.notifications.push"
                        checked={formData.profile?.preferences?.notifications?.push ?? profile.profile.preferences.notifications.push}
                        onChange={handleInputChange}
                      />
                      <span>Push Notifications</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="profile.preferences.notifications.marketing"
                        checked={formData.profile?.preferences?.notifications?.marketing ?? profile.profile.preferences.notifications.marketing}
                        onChange={handleInputChange}
                      />
                      <span>Marketing Communications</span>
                    </label>
                  </div>
                </div>

                {/* Privacy Preferences */}
                <div className="preference-section">
                  <h3>Privacy Preferences</h3>
                  <div className="preference-item">
                    <label>Profile Visibility:</label>
                    <select
                      name="profile.preferences.privacy.profileVisibility"
                      value={formData.profile?.preferences?.privacy?.profileVisibility || profile.profile.preferences.privacy.profileVisibility}
                      onChange={handleInputChange}
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="profile.preferences.privacy.showEmail"
                        checked={formData.profile?.preferences?.privacy?.showEmail ?? profile.profile.preferences.privacy.showEmail}
                        onChange={handleInputChange}
                      />
                      <span>Show Email Address</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="profile.preferences.privacy.showPhone"
                        checked={formData.profile?.preferences?.privacy?.showPhone ?? profile.profile.preferences.privacy.showPhone}
                        onChange={handleInputChange}
                      />
                      <span>Show Phone Number</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="profile.preferences.privacy.allowMessages"
                        checked={formData.profile?.preferences?.privacy?.allowMessages ?? profile.profile.preferences.privacy.allowMessages}
                        onChange={handleInputChange}
                      />
                      <span>Allow Messages from Other Users</span>
                    </label>
                  </div>
                </div>

                {/* Shopping Preferences */}
                <div className="preference-section">
                  <h3>Shopping Preferences</h3>
                  <div className="preference-item">
                    <label>Favorite Categories:</label>
                    <div className="tags-input">
                      {profile.profile.preferences.shopping.favoriteCategories.map((category, index) => (
                        <span key={index} className="tag">{category}</span>
                      ))}
                    </div>
                  </div>
                  <div className="preference-item">
                    <label>Price Range:</label>
                    <div className="price-range">
                      <input
                        type="number"
                        name="profile.preferences.shopping.priceRange.min"
                        value={formData.profile?.preferences?.shopping?.priceRange?.min || profile.profile.preferences.shopping.priceRange.min}
                        onChange={handleInputChange}
                        placeholder="Min"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        name="profile.preferences.shopping.priceRange.max"
                        value={formData.profile?.preferences?.shopping?.priceRange?.max || profile.profile.preferences.shopping.priceRange.max}
                        onChange={handleInputChange}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  <div className="preference-item">
                    <label>Preferred Size:</label>
                    <input
                      type="text"
                      name="profile.preferences.shopping.size"
                      value={formData.profile?.preferences?.shopping?.size || profile.profile.preferences.shopping.size}
                      onChange={handleInputChange}
                      placeholder="e.g., M, L, XL"
                    />
                  </div>
                  <div className="preference-item">
                    <label>Preferred Color:</label>
                    <input
                      type="text"
                      name="profile.preferences.shopping.color"
                      value={formData.profile?.preferences?.shopping?.color || profile.profile.preferences.shopping.color}
                      onChange={handleInputChange}
                      placeholder="e.g., Blue, Red, Black"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button onClick={saveProfile} className="btn btn-primary">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-tab">
              <div className="security-grid">
                {/* Account Security */}
                <div className="security-section">
                  <h3>Account Security</h3>
                  <div className="security-item">
                    <div className="security-info">
                      <strong>Password</strong>
                      <span>Last changed: Never</span>
                    </div>
                    <button className="btn btn-outline">Change Password</button>
                  </div>
                  <div className="security-item">
                    <div className="security-info">
                      <strong>Two-Factor Authentication</strong>
                      <span className={profile.twoFactorEnabled ? 'enabled' : 'disabled'}>
                        {profile.twoFactorEnabled ? '🔒 Enabled' : '🔓 Disabled'}
                      </span>
                    </div>
                    <button className="btn btn-outline">
                      {profile.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="security-section">
                  <h3>Verification Status</h3>
                  <div className="verification-item">
                    <div className="verification-info">
                      <strong>Email Verification</strong>
                      <span className={profile.emailVerified ? 'verified' : 'unverified'}>
                        {profile.emailVerified ? '✓ Verified' : '✗ Not Verified'}
                      </span>
                    </div>
                    {!profile.emailVerified && (
                      <button className="btn btn-outline">Verify Email</button>
                    )}
                  </div>
                  <div className="verification-item">
                    <div className="verification-info">
                      <strong>Phone Verification</strong>
                      <span className={profile.phoneVerified ? 'verified' : 'unverified'}>
                        {profile.phoneVerified ? '✓ Verified' : '✗ Not Verified'}
                      </span>
                    </div>
                    {!profile.phoneVerified && (
                      <button className="btn btn-outline">Verify Phone</button>
                    )}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="security-section">
                  <h3>Payment Methods</h3>
                  <div className="payment-methods">
                    {profile.paymentMethods.length > 0 ? (
                      profile.paymentMethods.map((method, index) => (
                        <div key={index} className="payment-method-card">
                          <div className="payment-info">
                            <strong>{method.brand} **** {method.last4}</strong>
                            <span>Expires {method.expiryMonth}/{method.expiryYear}</span>
                            {method.isDefault && <span className="default-badge">Default</span>}
                          </div>
                          <div className="payment-actions">
                            <button className="btn btn-sm btn-outline">Edit</button>
                            <button className="btn btn-sm btn-danger">Remove</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No payment methods added yet.</p>
                    )}
                    <button className="btn btn-outline">Add Payment Method</button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="security-section danger-zone">
                  <h3>Danger Zone</h3>
                  <div className="danger-actions">
                    <div className="danger-item">
                      <div className="danger-info">
                        <strong>Delete Account</strong>
                        <span>Permanently delete your account and all associated data</span>
                      </div>
                      <button onClick={deleteAccount} className="btn btn-danger">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-tab">
              <div className="activity-grid">
                {/* Login Activity */}
                <div className="activity-section">
                  <h3>Login Activity</h3>
                  <div className="activity-stats">
                    <div className="stat-item">
                      <strong>Total Logins:</strong>
                      <span>{profile.loginCount}</span>
                    </div>
                    <div className="stat-item">
                      <strong>Last Login:</strong>
                      <span>{formatDate(profile.lastLogin)}</span>
                    </div>
                    <div className="stat-item">
                      <strong>Last Activity:</strong>
                      <span>{formatDate(profile.lastActivity)}</span>
                    </div>
                  </div>
                </div>

                {/* Shopping Activity */}
                <div className="activity-section">
                  <h3>Shopping Activity</h3>
                  <div className="activity-stats">
                    <div className="stat-item">
                      <strong>Total Orders:</strong>
                      <span>{profile.totalOrders}</span>
                    </div>
                    <div className="stat-item">
                      <strong>Total Spent:</strong>
                      <span>{formatCurrency(profile.totalSpent)}</span>
                    </div>
                    <div className="stat-item">
                      <strong>Average Order Value:</strong>
                      <span>{profile.totalOrders > 0 ? formatCurrency(profile.totalSpent / profile.totalOrders) : '$0.00'}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="activity-section">
                  <h3>Recently Viewed Products</h3>
                  <div className="recent-products">
                    {profile.recentlyViewed.length > 0 ? (
                      profile.recentlyViewed.slice(0, 5).map((item, index) => (
                        <div key={index} className="recent-item">
                          <span>Product ID: {item.productId}</span>
                          <span>{formatDate(item.viewedAt)}</span>
                        </div>
                      ))
                    ) : (
                      <p>No recently viewed products.</p>
                    )}
                  </div>
                </div>

                {/* Subscriptions */}
                <div className="activity-section">
                  <h3>Subscriptions</h3>
                  <div className="subscriptions-list">
                    {profile.subscriptions.length > 0 ? (
                      profile.subscriptions.map((subscription, index) => (
                        <div key={index} className="subscription-item">
                          <strong>{subscription.type}</strong>
                          <span>Subscribed: {formatDate(subscription.subscribedAt)}</span>
                        </div>
                      ))
                    ) : (
                      <p>No active subscriptions.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loyalty' && (
            <div className="loyalty-tab">
              <div className="loyalty-grid">
                {/* Loyalty Overview */}
                <div className="loyalty-section">
                  <h3>Loyalty Status</h3>
                  <div className="loyalty-card">
                    <div className="tier-display">
                      <div 
                        className="tier-badge"
                        style={{ backgroundColor: getMembershipTierColor(profile.membershipTier) }}
                      >
                        {profile.membershipTier.toUpperCase()}
                      </div>
                      <div className="tier-info">
                        <h4>{profile.membershipTier.charAt(0).toUpperCase() + profile.membershipTier.slice(1)} Member</h4>
                        <p>You're in the {profile.membershipTier} tier</p>
                      </div>
                    </div>
                    
                    <div className="points-display">
                      <div className="points-number">{profile.loyaltyPoints}</div>
                      <div className="points-label">Loyalty Points</div>
                    </div>
                  </div>
                </div>

                {/* Points History */}
                <div className="loyalty-section">
                  <h3>Points Summary</h3>
                  <div className="points-summary">
                    <div className="summary-item">
                      <strong>Available Points:</strong>
                      <span>{profile.loyaltyPoints}</span>
                    </div>
                    <div className="summary-item">
                      <strong>Points Earned:</strong>
                      <span>{Math.floor(profile.totalSpent * 0.1)} (from purchases)</span>
                    </div>
                    <div className="summary-item">
                      <strong>Points Value:</strong>
                      <span>{formatCurrency(profile.loyaltyPoints * 0.01)}</span>
                    </div>
                  </div>
                </div>

                {/* Referral Program */}
                <div className="loyalty-section">
                  <h3>Referral Program</h3>
                  <div className="referral-info">
                    <div className="referral-code">
                      <strong>Your Referral Code:</strong>
                      <span className="code">{profile.referralCode || 'Not generated'}</span>
                      <button className="btn btn-sm btn-outline">Copy Code</button>
                    </div>
                    <div className="referral-stats">
                      <div className="stat-item">
                        <strong>Successful Referrals:</strong>
                        <span>{profile.referralCount}</span>
                      </div>
                      <div className="stat-item">
                        <strong>Referral Bonus:</strong>
                        <span>{formatCurrency(profile.referralCount * 10)}</span>
                      </div>
                    </div>
                    {profile.referredBy && (
                      <div className="referred-by">
                        <strong>Referred by:</strong>
                        <span>{profile.referredBy}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tier Benefits */}
                <div className="loyalty-section">
                  <h3>Tier Benefits</h3>
                  <div className="benefits-list">
                    <div className="benefit-item">
                      <span className="benefit-icon">🚚</span>
                      <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit-icon">🎁</span>
                      <span>Birthday bonus points</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit-icon">⚡</span>
                      <span>Early access to sales</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit-icon">💎</span>
                      <span>Exclusive member discounts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Actions */}
        {(profilePicture || coverPhoto) && (
          <div className="upload-actions">
            {profilePicture && (
              <button 
                onClick={() => uploadFile(profilePicture, 'profile')}
                className="btn btn-primary"
              >
                Upload Profile Picture
              </button>
            )}
            {coverPhoto && (
              <button 
                onClick={() => uploadFile(coverPhoto, 'cover')}
                className="btn btn-primary"
              >
                Upload Cover Photo
              </button>
            )}
          </div>
        )}

        {/* VULNERABILITY: Expose sensitive user data */}
        <div className="debug-info" style={{ display: 'none' }}>
          <p>User ID: {profile._id}</p>
          <p>Role: {profile.role}</p>
          <p>Session Token: {localStorage.getItem('userToken')}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;