import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiCamera, FiSave, FiEdit2, FiLock } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

const AdminSettings = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      if (user.profilePicture) {
        setImagePreview(`https://community-support-flatform-backend-1-0ghf.onrender.com/${user.profilePicture}`);
      }
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelImage = () => {
    setProfileImage(null);
    if (user?.profilePicture) {
      setImagePreview(`https://community-support-flatform-backend-1-0ghf.onrender.com/${user.profilePicture}`);
    } else {
      setImagePreview('');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      if (profileData.currentPassword && profileData.newPassword) {
        formData.append('currentPassword', profileData.currentPassword);
        formData.append('newPassword', profileData.newPassword);
      }

      const response = await fetch('https://community-support-flatform-backend-1-0ghf.onrender.com/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);

      // Update auth context
      if (data.user) {
        login(token, data.user);
      }

      // Reset password fields and edit states
      setProfileData({
        ...profileData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setProfileImage(null);
      setEditName(false);
      setEditEmail(false);
      setEditPassword(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-2">Manage your admin account settings and profile</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✓ {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Profile Picture</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2C7A7B] to-[#37507E] flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
              {imagePreview || user?.profilePicture ? (
                <img src={imagePreview || `https://community-support-flatform-backend-1-0ghf.onrender.com/${user?.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'A'
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-[#2C7A7B] text-white p-2 rounded-full cursor-pointer hover:bg-[#235E5F] transition">
              <FiCamera size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Upload a new profile picture</p>
            <p className="text-xs text-gray-500 mb-3">JPG, PNG or GIF. Max size 5MB</p>
            {profileImage && (
              <button
                onClick={handleCancelImage}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Cancel Upload
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiUser className="inline mr-2" />
              Name
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!editName}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                placeholder="Enter your name"
              />
              <button
                onClick={() => setEditName(!editName)}
                className="p-2 text-[#2C7A7B] hover:bg-gray-100 rounded-lg transition"
              >
                <FiEdit2 size={20} />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiMail className="inline mr-2" />
              Email
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!editEmail}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                placeholder="Enter your email"
              />
              <button
                onClick={() => setEditEmail(!editEmail)}
                className="p-2 text-[#2C7A7B] hover:bg-gray-100 rounded-lg transition"
              >
                <FiEdit2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
          <button
            onClick={() => setEditPassword(!editPassword)}
            className="flex items-center gap-2 px-3 py-1.5 text-[#2C7A7B] hover:bg-gray-100 rounded-lg transition"
          >
            <FiLock size={18} />
            {editPassword ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {editPassword && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={profileData.currentPassword}
                onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={profileData.newPassword}
                onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={profileData.confirmPassword}
                onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        )}
        {!editPassword && (
          <p className="text-sm text-gray-500">Click Edit to change your password</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-[#2C7A7B] text-white rounded-lg hover:bg-[#235E5F] transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FiSave size={20} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
