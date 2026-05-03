import type { User } from "../../types/user";

interface Props {
  user: User | null;
}

export function DashboardHeader({ user }: Props) {
  return (
    <div className="mb-2">
      <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name}!</h1>
      <p className="text-sm text-gray-500">{user?.position ?? "-"}</p>
    </div>
  );
}
