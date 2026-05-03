import React, { useRef, useState } from "react";
import type { User } from "../../types/user";
import * as authApi from "../../api/auth";
import { PasswordInput } from "../common/PasswordInput";
import axios from "axios";

interface Props {
  user: User | null;
  onUpdated: () => Promise<void>;
  onCancel: () => void;
}

export function ProfileForm({ user, onUpdated, onCancel }: Props) {
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.photoUrl ?? null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const passwordsMatch = password !== "" && confirmPassword !== "" && password === confirmPassword;
  const passwordsMismatch = password !== "" && confirmPassword !== "" && password !== confirmPassword;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, string> = {};

      if (avatarFile) {
        const url = await authApi.uploadAvatar(avatarFile);
        payload.photoUrl = url;
      }

      if (phoneNumber !== (user?.phoneNumber ?? "")) payload.phoneNumber = phoneNumber;
      if (password) payload.password = password;

      if (Object.keys(payload).length === 0) {
        setError("No changes to save");
        setIsSubmitting(false);
        return;
      }

      await authApi.updateProfile(payload);
      await onUpdated();
      setPassword("");
      setConfirmPassword("");
      setAvatarFile(null);
      setSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Update failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
      {/* Avatar picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
        <div className="mt-2 flex items-center gap-4">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-200"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 ring-2 ring-gray-200">
              <span className="text-xl font-semibold text-orange-600">
                {user?.name?.charAt(0).toUpperCase() ?? "?"}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              {avatarFile ? "Change photo" : "Choose photo"}
            </button>
            {avatarFile && (
              <span className="text-xs text-gray-500 truncate max-w-[180px]">{avatarFile.name}</span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="+62-812-1234-5678"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">New Password</label>
        <p className="mb-1 text-xs text-gray-400">Leave blank to keep current password</p>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Input new password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
        <PasswordInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-input new password"
          disabled={!password}
        />
        {passwordsMatch && <p className="mt-1 text-xs text-green-600">Passwords match.</p>}
        {passwordsMismatch && <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Profile updated!</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || passwordsMismatch}
          className="rounded-md bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
