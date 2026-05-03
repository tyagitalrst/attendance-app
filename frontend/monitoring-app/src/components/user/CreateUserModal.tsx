import { useState } from "react";
import * as adminApi from "../../api/admin";
import type { Role } from "../../types/user";
import { PasswordInput } from "../common/PasswordInput";
import toast from "react-hot-toast";
import axios from "axios";

export function CreateUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState<Role>("EMPLOYEE");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isEmailInvalid = submitted && !email;
  const isPasswordInvalid = submitted && !password;
  const isNameInvalid = submitted && !name;
  const passwordTooShort = password.length > 0 && password.length < 6;
  const passwordsMatch = password !== "" && confirmPassword !== "" && password === confirmPassword;
  const passwordsMismatch = password !== "" && confirmPassword !== "" && password !== confirmPassword;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    if (!email || !password || password.length < 6 || !name) return;
    if (passwordsMismatch) return;
    if (!confirmPassword) return;

    setSubmitting(true);
    try {
      await adminApi.createUser({
        email,
        password,
        name,
        position: position || undefined,
        role,
      });
      toast.success("User created");
      onCreated();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Failed to create user");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold">Create New Employee</h3>

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
            {isNameInvalid && <p className="mt-1 text-xs text-red-600">Full name is required.</p>}
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
            {isEmailInvalid && <p className="mt-1 text-xs text-red-600">Email is required.</p>}
          </div>

          <input
            type="text"
            placeholder="Position (optional)"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
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
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={passwordTooShort || isPasswordInvalid ? "border-red-300 bg-red-50" : ""}
            />
            {isPasswordInvalid && <p className="mt-1 text-xs text-red-600">Password is required.</p>}
            {!isPasswordInvalid && passwordTooShort && (
              <p className="mt-1 text-xs text-red-600">Password must be at least 6 characters.</p>
            )}
          </div>

          <div>
            <PasswordInput
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={!password}
            />
            {submitted && !confirmPassword && password && (
              <p className="mt-1 text-xs text-red-600">Please confirm your password.</p>
            )}
            {passwordsMatch && <p className="mt-1 text-xs text-green-600">Passwords match.</p>}
            {passwordsMismatch && <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting || passwordsMismatch}
              className="flex-1 rounded-md bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create"}
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
