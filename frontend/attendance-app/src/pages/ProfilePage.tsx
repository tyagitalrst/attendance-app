import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { ProfileInfo } from "../components/profile/ProfileInfo";
import { ProfileForm } from "../components/profile/ProfileForm";

export function ProfilePage() {
  const { user, getUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  async function handleUpdated() {
    await getUser();
    setIsEditing(false);
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-orange-600 px-4 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50"
          >
            Edit Profile
          </button>
        )}
      </div>

      <ProfileInfo user={user} />

      {isEditing && (
        <ProfileForm
          user={user}
          onUpdated={handleUpdated}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
