import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Adjust this path based on your setup
import { Button } from "@/components/ui/button"; // Adjust this path based on your setup
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';


const DeleteButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useClerk();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await user?.delete();
      toast.success("Your account has been successfully deleted.");
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("There was an error deleting your account. Please try again.");
    } finally {
        setIsDialogOpen(false);
        router.push("/"); 
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setIsDialogOpen(false)} // Close the dialog on Cancel
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
