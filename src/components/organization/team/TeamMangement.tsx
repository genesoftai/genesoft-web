"use client";
import { Loader2, Pencil, Plus, Trash, User } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { GenesoftOrganization, OrganizationUser } from "@/types/organization";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import { getFirstCharacterUppercase } from "@/utils/common/text";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
    addOrganizationUser,
    removeOrganizationUser,
    updateOrganizationUserRole,
} from "@/actions/organization";

interface TeamMemberProps {
    organization: GenesoftOrganization;
    organizationUsers: OrganizationUser[];
    onUpdate: (action: "add" | "remove" | "update") => void;
}

const TeamMangement = ({
    organization,
    organizationUsers,
    onUpdate,
}: TeamMemberProps) => {
    const { id: currentUserId } = useGenesoftUserStore();
    const { toast } = useToast();

    // Dialog states
    const [addMemberOpen, setAddMemberOpen] = useState(false);
    const [updateRoleOpen, setUpdateRoleOpen] = useState(false);
    const [removeMemberOpen, setRemoveMemberOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<OrganizationUser | null>(
        null,
    );

    // Form states
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [newMemberRole, setNewMemberRole] = useState("member");
    const [updatedRole, setUpdatedRole] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Check if current user is the owner
    const isOwner =
        organizationUsers.find(
            (user) => user.id === currentUserId && user.role === "owner",
        ) !== undefined;

    // Handle adding a new member
    const handleAddMember = async () => {
        // Here you would implement the actual API call to add a member
        setIsLoading(true);
        console.log("Adding member:", {
            email: newMemberEmail,
            role: newMemberRole,
        });
        await addOrganizationUser(
            organization.id,
            newMemberEmail,
            newMemberRole,
        );
        toast({
            title: "Member invited",
            description: `Invitation sent to ${newMemberEmail}`,
        });

        // Reset form and close dialog
        setNewMemberEmail("");
        setNewMemberRole("member");
        setAddMemberOpen(false);
        setIsLoading(false);
        onUpdate("add");
    };

    // Handle updating a member's role
    const handleUpdateRole = async () => {
        if (!selectedUser) return;
        setIsLoading(true);
        // Here you would implement the actual API call to update the role
        console.log(
            "Updating role for:",
            selectedUser.email,
            "to",
            updatedRole,
        );
        await updateOrganizationUserRole(
            organization.id,
            selectedUser.email,
            updatedRole,
        );
        toast({
            title: "Role updated",
            description: `${selectedUser.email}'s role updated to ${getFirstCharacterUppercase(updatedRole)}`,
        });

        // Reset form and close dialog
        setSelectedUser(null);
        setUpdatedRole("");
        setUpdateRoleOpen(false);
        setIsLoading(false);
        onUpdate("update");
    };

    // Handle removing a member
    const handleRemoveMember = async () => {
        if (!selectedUser) return;

        setIsLoading(true);

        // Here you would implement the actual API call to remove the member
        console.log("Removing member:", selectedUser.email);
        await removeOrganizationUser(organization.id, selectedUser.id);
        toast({
            title: "Member removed",
            description: `${selectedUser.email} has been removed from the organization`,
        });

        // Reset form and close dialog
        setSelectedUser(null);
        setRemoveMemberOpen(false);
        setIsLoading(false);
        onUpdate("remove");
    };

    return (
        <div className="flex flex-col gap-6 p-6 md:p-10 w-full rounded-xl bg-secondary-dark">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
                Team Management
            </h2>
            <p className="text-md md:text-lg text-subtext-in-dark-bg">
                Manage your team members for{" "}
                <strong className="text-genesoft">{organization.name}</strong>.
                Here you can view roles and take actions as needed.
            </p>

            {/* Add Member Dialog */}
            <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                <DialogTrigger asChild>
                    {isOwner && (
                        <Button className="bg-genesoft text-white rounded hover:bg-genesoft/80 transition duration-200 w-fit self-end font-bold">
                            <Plus className="w-4 h-4 mr-2" />
                            <span>Add Member</span>
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent className="w-11/12 sm:max-w-[500px] rounded-lg ">
                    <DialogHeader>
                        <DialogTitle className="text-base md:text-xl">
                            Add Team Member
                        </DialogTitle>
                        <DialogDescription>
                            Invite a new member to join your organization.
                            <br />
                            User need to already have an account with same email
                            address you provided to join the organization.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                value={newMemberEmail}
                                onChange={(e) =>
                                    setNewMemberEmail(e.target.value)
                                }
                                className="text-sm md:text-base"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={newMemberRole}
                                onValueChange={setNewMemberRole}
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="member">
                                        Member
                                    </SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    {isOwner && (
                                        <SelectItem value="owner">
                                            Owner
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setAddMemberOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddMember}
                            disabled={!newMemberEmail}
                            className="bg-genesoft text-white hover:bg-genesoft/80"
                        >
                            Add Member
                            {isLoading && (
                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col gap-4 md:gap-6 w-full">
                {organizationUsers?.map((user) => (
                    <div
                        key={user.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-line-in-dark-bg rounded-lg bg-primary-dark hover:bg-tertiary-dark/80 transition duration-200"
                    >
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {user.image ? (
                                <Image
                                    src={user.image || ""}
                                    alt={user.name || user.email}
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-genesoft/20 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-genesoft" />
                                </div>
                            )}
                            <div>
                                <p className="flex items-center gap-2">
                                    <span
                                        className={`text-sm md:text-xl font-bold ${user.role === "owner" ? "text-white" : "text-subtext-in-dark-bg"}`}
                                    >
                                        {getFirstCharacterUppercase(user.role)}
                                    </span>
                                </p>
                                <p className="text-xs sm:text-sm md:text-base text-white break-all">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        {isOwner && (
                            <div className="flex flex-wrap gap-2 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
                                {/* Update Role Dialog */}
                                <Dialog
                                    open={
                                        updateRoleOpen &&
                                        selectedUser?.id === user.id
                                    }
                                    onOpenChange={(open) => {
                                        if (open) {
                                            setSelectedUser(user);
                                            setUpdatedRole(user.role);
                                        }
                                        setUpdateRoleOpen(open);
                                    }}
                                >
                                    {isOwner && (
                                        <DialogTrigger asChild>
                                            <Button className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-white text-black border border-line-in-dark-bg rounded hover:bg-tertiary-dark/80 hover:text-white transition duration-200 flex-grow sm:flex-grow-0">
                                                <Pencil className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                <span>Update Role</span>
                                            </Button>
                                        </DialogTrigger>
                                    )}

                                    <DialogContent className="w-11/12 sm:max-w-[500px] rounded-lg">
                                        <DialogHeader>
                                            <DialogTitle className="text-base md:text-xl">
                                                Update Member Role
                                            </DialogTitle>
                                            <DialogDescription>
                                                Change the role for {user.email}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-6 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="updated-role">
                                                    Role
                                                </Label>
                                                <Select
                                                    value={updatedRole}
                                                    onValueChange={
                                                        setUpdatedRole
                                                    }
                                                >
                                                    <SelectTrigger id="updated-role">
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="member">
                                                            Member
                                                        </SelectItem>
                                                        <SelectItem value="admin">
                                                            Admin
                                                        </SelectItem>
                                                        <SelectItem value="owner">
                                                            Owner
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setUpdateRoleOpen(false)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleUpdateRole}
                                                disabled={
                                                    !updatedRole ||
                                                    updatedRole === user.role
                                                }
                                                className="bg-genesoft text-white hover:bg-genesoft/80"
                                            >
                                                Update Role
                                                {isLoading && (
                                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                {user.id !== currentUserId && (
                                    /* Remove Member Dialog */
                                    <Dialog
                                        open={
                                            removeMemberOpen &&
                                            selectedUser?.id === user.id
                                        }
                                        onOpenChange={(open) => {
                                            if (open) {
                                                setSelectedUser(user);
                                            }
                                            setRemoveMemberOpen(open);
                                        }}
                                    >
                                        {isOwner && (
                                            <DialogTrigger asChild>
                                                <Button className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition duration-200 flex-grow sm:flex-grow-0">
                                                    <Trash className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                    <span>Remove Member</span>
                                                </Button>
                                            </DialogTrigger>
                                        )}

                                        <DialogContent className="w-11/12 sm:max-w-[500px] rounded-lg">
                                            <DialogHeader>
                                                <DialogTitle className="text-base md:text-xl">
                                                    Remove Team Member
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to
                                                    remove {user.email} from the
                                                    organization? This action
                                                    cannot be undone.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="mt-6">
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        setRemoveMemberOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleRemoveMember}
                                                    className="bg-red-600 text-white hover:bg-red-700"
                                                >
                                                    Remove Member
                                                    {isLoading && (
                                                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamMangement;
