import { useState } from "react";
import * as adminApi from "../../api/admin";
import type { User, Role } from "../../types/user";
import { PasswordInput } from "../common/PasswordInput";
import toast from "react-hot-toast";
import axios from "axios";

export function EditUserModal({
  user,
  onClose,
  onUpdated,
}: {
  user: User;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [position, setPosition] = useState(user.position ?? "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl ?? "");
  const [role, setRole] = useState<Role>(user.role);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isNameInvalid = submitted && !name;
  const isEmailInvalid = submitted && !email;
  const passwordsMatch =
    password !== "" && confirmPassword !== "" && password === confirmPassword;
  const passwordsMismatch =
    password !== "" && confirmPassword !== "" && password !== confirmPassword;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    if (!name || !email) return;
    if (passwordsMismatch) return;

    setSubmitting(true);
    try {
      await adminApi.updateUser(user.id, {
        name,
        email,
        position: position || undefined,
        photoUrl: photoUrl || undefined,
        role,
        password: password || undefined,
      });
      toast.success("User updated");
      onUpdated();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Failed to update user");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold">Edit Employee</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              className={`block w-full rounded-md border px-3 py-2 ${isNameInvalid ? "border-red-300 bg-red-50" : "border-gray-300"}`}
            />
            {isNameInvalid && (
              <p className="mt-1 text-xs text-red-600">
                Full name is required.
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              className={`block w-full rounded-md border px-3 py-2 ${isEmailInvalid ? "border-red-300 bg-red-50" : "border-gray-300"}`}
            />
            {isEmailInvalid && (
              <p className="mt-1 text-xs text-red-600">Email is required.</p>
            )}
          </div>

          <input
            type="text"
            placeholder="Position (optional)"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2"
          />

          <input
            type="url"
            placeholder="Photo URL (optional)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="ADMIN">Admin</option>
          </select>

          <div>
            <PasswordInput
              placeholder="New password (leave blank to keep)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div>
            <PasswordInput
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={!password}
            />
            {passwordsMatch && (
              <p className="mt-1 text-xs text-green-600">Passwords match.</p>
            )}
            {passwordsMismatch && (
              <p className="mt-1 text-xs text-red-600">
                Passwords do not match.
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting || passwordsMismatch}
              className="flex-1 rounded-md bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
