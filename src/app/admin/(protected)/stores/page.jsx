"use client";

import { useState, useEffect } from "react";
import { AdminService } from "@/services/adminService";
import { Table, TableFilterBar, Pagination } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Loader2, Edit, ExternalLink, Store } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function StoresPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Invite Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteFormData, setInviteFormData] = useState({ name: "", email: "" });
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await AdminService.getUsers({ limit: 100 }); // Fetch enough for client pagination for now
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      toast.error("Failed to load stores");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditFormData({ name: user.name || "", email: user.email || "" });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSaving(true);
    try {
      const response = await AdminService.updateUser(
        selectedUser._id,
        editFormData
      );
      if (response.success) {
        toast.success("Store updated successfully");
        setIsEditModalOpen(false);
        fetchUsers(); // Refresh list
      } else {
        toast.error("Failed to update store");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      const response = await AdminService.inviteUser(inviteFormData);
      if (response.success) {
        toast.success(response.message || "Invitation sent successfully");
        setIsInviteModalOpen(false);
        setInviteFormData({ name: "", email: "" });
      } else {
        toast.error(response.error || "Failed to send invitation");
      }
    } catch (error) {
      toast.error("An error occurred while sending invitation");
    } finally {
      setIsInviting(false);
    }
  };

  const handleViewDashboard = (user) => {
    // Navigate to God Mode Dashboard (Implementation TBD, possibly passing ID via query param)
    // For now, let's route to transactions as a start
    router.push(`/admin/transactions?merchantId=${user._id}`);
  };

  // Filter & Pagination
  const filteredUsers = users.filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const headers = ["Name", "Email", "Joined", "Actions"];

  const renderRow = (user, index) => (
    <tr key={index} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Store className="h-4 w-4" />
          </div>
          {user.name || "N/A"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewDashboard(user)}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Data
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Stores</h1>
          <p className="text-gray-500 mt-1">
            View and manage registered merchants
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline">
            Refresh
          </Button>
          <Button onClick={() => setIsInviteModalOpen(true)}>
            Invite Merchant
          </Button>
        </div>
      </div>

      <TableFilterBar
        placeholder="Search by Name or Email..."
        onSearch={setSearchTerm}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <Table headers={headers} data={currentItems} renderRow={renderRow} />
          <Pagination
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Store Details"
        footer={null} // We'll put buttons in the form
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <Label htmlFor="name">Store Name</Label>
            <Input
              id="name"
              value={editFormData.name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editFormData.email}
              onChange={(e) =>
                setEditFormData({ ...editFormData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite New Merchant"
        footer={null}
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Send an invitation email to a new merchant. They will receive a link
            to sign up.
          </p>
          <div>
            <Label htmlFor="invite-name">Merchant Name (Optional)</Label>
            <Input
              id="invite-name"
              value={inviteFormData.name}
              onChange={(e) =>
                setInviteFormData({ ...inviteFormData, name: e.target.value })
              }
              placeholder="Business Name"
            />
          </div>
          <div>
            <Label htmlFor="invite-email">Email Address</Label>
            <Input
              id="invite-email"
              type="email"
              value={inviteFormData.email}
              onChange={(e) =>
                setInviteFormData({ ...inviteFormData, email: e.target.value })
              }
              placeholder="merchant@example.com"
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isInviting}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
