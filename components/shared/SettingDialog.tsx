import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"; // Replace with your dialog component
import { Input } from "@/components/ui/input"; // Replace with your input component
import { Button } from "@/components/ui/button"; // Replace with your button component
import { useUser } from "@clerk/nextjs";
import { FiSettings } from "react-icons/fi";

export default function SettingsDialog() {
    const user = useUser()
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState(user?.user?.username || "");
    const [email, setEmail] = useState(user?.user?.emailAddresses[0].emailAddress || "");
    const [imageUrl, setImageUrl] = useState(user?.user?.imageUrl || "");

    const handleSave = async () => {
        try {
            // Update logic here (e.g., calling Clerk or Convex mutation)
            console.log("Updated:", { username, email, imageUrl });
            setIsOpen(false); // Close the dialog after saving
        } catch (error) {
            console.error("Failed to save settings:", error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            // Delete account logic here
            console.log("Account deleted");
        } catch (error) {
            console.error("Failed to delete account:", error);
        }
    };

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
            <FiSettings className='w-5 h-5'/>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Username
                            </label>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                            />
                        </div>

                        {/* Profile Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Profile Image URL
                            </label>
                            <Input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="Paste the image URL"
                            />
                            {imageUrl && (
                                <img src={imageUrl} alt="Profile Preview" className="mt-2 w-16 h-16 rounded-full" />
                            )}
                        </div>

                        {/* Delete Account */}
                        <div className="flex justify-end">
                            <Button variant="destructive" onClick={handleDeleteAccount}>
                                Delete Account
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
