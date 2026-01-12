"use client";

import { useState } from "react";
// import { AdminService } from "@/services/adminService"; // Replaced by hooks
import {
  useStores,
  useUpdateUser,
  useInviteMerchant,
} from "@/hooks/useAdminData";
import { Table, TableFilterBar, Pagination } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import {
  Loader2,
  Edit,
  ExternalLink,
  Store,
  Users,
  FileText,
  MessageSquare,
} from "lucide-react";
import { formatDisplayData } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function StoresPage() {
  const router = useRouter();
  // React Query Hooks
  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useStores({ limit: 100 });
  const updateUserMutation = useUpdateUser();
  const inviteMerchantMutation = useInviteMerchant();

  const users = usersData?.users || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "" });

  // Invite Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteFormData, setInviteFormData] = useState({ name: "", email: "" });

  // View Data Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // No need for useEffect -> fetchUsers anymore! React Query handles it.

  if (isError) {
    toast.error("Failed to load stores");
  }

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditFormData({ name: user.name || "", email: user.email || "" });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    updateUserMutation.mutate(
      { id: selectedUser._id, data: editFormData },
      {
        onSuccess: () => {
          toast.success("Store updated successfully");
          setIsEditModalOpen(false);
        },
        onError: () => {
          toast.error("Failed to update store");
        },
      }
    );
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    inviteMerchantMutation.mutate(inviteFormData, {
      onSuccess: (data) => {
        toast.success(data.message || "Invitation sent successfully");
        setIsInviteModalOpen(false);
        setInviteFormData({ name: "", email: "" });
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || "Failed to send invitation");
      },
    });
  };

  const handleViewDashboard = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleNavigateToData = (type) => {
    if (!selectedUser) return;
    router.push(`/admin/${type}?merchantId=${selectedUser._id}`);
    setIsViewModalOpen(false);
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
          {formatDisplayData(user.name)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
        {formatDisplayData(user.email)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex justify-center gap-2">
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
        {/* <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline">
            Refresh
          </Button>
          <Button onClick={() => setIsInviteModalOpen(true)}>
            Invite Merchant
          </Button>
        </div> */}
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
            <Button type="submit" isLoading={updateUserMutation.isPending}>
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
            <Button type="submit" isLoading={inviteMerchantMutation.isPending}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Data Selection Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`View Data for ${selectedUser?.name || "Merchant"}`}
        footer={null}
      >
        <div className="space-y-4">
          <p className="text-gray-600 mb-4">
            Select which data you would like to view for this merchant:
          </p>
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="justify-start gap-3 h-12 text-lg hover:bg-blue-50 hover:border-blue-200"
              onClick={() => handleNavigateToData("transactions")}
            >
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <FileText className="h-4 w-4" />
              </div>
              View Transactions
            </Button>

            <Button
              variant="outline"
              className="justify-start gap-3 h-12 text-lg hover:bg-green-50 hover:border-green-200"
              onClick={() => handleNavigateToData("customers")}
            >
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <Users className="h-4 w-4" />
              </div>
              View Customers
            </Button>

            <Button
              variant="outline"
              className="justify-start gap-3 h-12 text-lg hover:bg-purple-50 hover:border-purple-200"
              onClick={() => handleNavigateToData("conversations")}
            >
              <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                <MessageSquare className="h-4 w-4" />
              </div>
              View Conversations
            </Button>
          </div>
          <div className="flex justify-end mt-6">
            <Button variant="ghost" onClick={() => setIsViewModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
