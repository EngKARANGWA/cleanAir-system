"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { api } from "../../../../lib/api";

export default function DeleteUserButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setIsDeleting(true);
    try {
      await api.users.remove(id);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the user.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all disabled:opacity-50"
      title="Delete User"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
