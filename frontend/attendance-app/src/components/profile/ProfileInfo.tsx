import type { User } from "../../types/user";

interface Props {
  user: User | null;
}

export function ProfileInfo({ user }: Props) {
  return (
    <div className="mb-6">
      <div className="mb-5 flex items-center gap-4">
        {user?.photoUrl ? (
          <img
            src={user.photoUrl}
            alt={user.name}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-200"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 ring-2 ring-gray-200">
            <span className="text-2xl font-semibold text-orange-600">
              {user?.name?.charAt(0).toUpperCase() ?? "?"}
            </span>
          </div>
        )}
        <div>
          <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.position ?? "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>

        <div>
          <p className="text-gray-500">Phone Number</p>
          <p className="font-medium">{user?.phoneNumber ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}
