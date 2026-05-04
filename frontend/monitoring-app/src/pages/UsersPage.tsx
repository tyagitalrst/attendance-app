import { useEffect, useRef, useState } from "react";
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
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const searchRef = useRef("");

  async function fetchUsers(keyword: string, page: number, size: number) {
    setLoading(true);
    try {
      const result = await adminApi.getUsers({
        searchKeyword: keyword || undefined,
        pageNo: page,
        pageSize: size,
      });
      setUsers(result.data);
      setTotalRecords(result.totalRecords);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchUsers("", 1, pageSize);
  }, []);

  function handleSearch() {
    searchRef.current = search;
    setPageNo(1);
    void fetchUsers(search, 1, pageSize);
  }

  function handlePageChange(page: number) {
    setPageNo(page);
    void fetchUsers(searchRef.current, page, pageSize);
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPageNo(1);
    void fetchUsers(searchRef.current, 1, size);
  }

  async function handleDelete(user: User) {
    if (!confirm(`Delete ${user.name}?`)) return;
    try {
      await adminApi.deleteUser(user.id);
      toast.success(`${user.name} deleted`);
      setPageNo(1);
      void fetchUsers(searchRef.current, 1, pageSize);
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
          totalRecords={totalRecords}
          pageNo={pageNo}
          pageSize={pageSize}
          search={search}
          onSearchChange={setSearch}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onEdit={setEditingUser}
          onDelete={handleDelete}
        />
      </div>

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            void fetchUsers(searchRef.current, pageNo, pageSize);
          }}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdated={() => {
            setEditingUser(null);
            void fetchUsers(searchRef.current, pageNo, pageSize);
          }}
        />
      )}
    </AdminLayout>
  );
}
