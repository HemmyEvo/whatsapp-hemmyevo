import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiSettings } from "react-icons/fi";
import DeleteButton from "./DeleteDialog";
import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsDialog() {
  const { user: clerkUser } = useClerk(); // Clerk user methods
  const { user } = useUser(); // Current authenticated user

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState("");

  // Update state when `user` changes
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
      setFullName(user.fullName || "");
      setProfileImage(user.imageUrl || "");
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) setProfileImage(reader.result as string); // Temporary preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (clerkUser) {
        await clerkUser.update({
          username,
          firstName: fullName.split(" ")[0] || fullName,
          lastName: fullName.split(" ")[1] || "",
        });

        if (profileImage && profileImage !== user?.imageUrl) {
          const file = await fetch(profileImage)
            .then((res) => res.blob())
            .then(
              (blob) =>
                new File([blob], "profile-image.png", { type: "image/png" })
            );

          await clerkUser.setProfileImage({ file });
        }
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    }finally{
        setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setUsername(user?.username || "");
    setEmail(user?.primaryEmailAddress?.emailAddress || "");
    setFullName(user?.fullName || "");
    setProfileImage(user?.imageUrl || "");
    setIsEditing(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        <FiSettings className="w-5 h-5" />
      </div>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) setIsEditing(false);
          setIsOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={profileImage} className="object-cover w-12 h-12" />
                <AvatarFallback className="text-sm text-black dark:text-white">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              {isEditing ? (
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {fullName || "Not provided"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              {isEditing ? (
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {username || "Not provided"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {email || "Not provided"}
              </p>
            </div>
            <div className="flex justify-between space-x-4">
              {isEditing ? (
                <>
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  <DeleteButton />
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
