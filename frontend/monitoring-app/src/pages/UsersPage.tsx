import { useEffect, useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { UsersTable } from "../components/user/UsersTable";
import { CreateUserModal } from "../components/user/CreateUserModal";
import { EditUserModal } from "../components/user/EditUserModal";
import * as adminApi from "../api/admin";
import type { User } from "../types/user";
import toast from "react-hot-toast";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  async function fetchUsers() {
    setLoading(true);
    try {
      const data = await adminApi.getUsers({
        searchKeyword: search || undefined,
      });
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDelete(user: User) {
    if (!confirm(`Delete ${user.name}?`)) return;
    try {
      await adminApi.deleteUser(user.id);
      toast.success(`${user.name} deleted`);
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  }

  return (
    <AdminLayout>
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Employees</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-md bg-orange-600 px-4 py-2 text-sm text-white hover:bg-orange-700"
          >
            + New Employee
          </button>
        </div>

        <UsersTable
          users={users}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          onSearch={fetchUsers}
          onEdit={setEditingUser}
          onDelete={handleDelete}
        />
      </div>

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            fetchUsers();
          }}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdated={() => {
            setEditingUser(null);
            fetchUsers();
          }}
        />
      )}
    </AdminLayout>
  );
}
