"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/hooks/use-project";
import { toast } from "@/hooks/use-toast";
import { ProjectItem } from "@/types";
import {
    Copy,
    Edit2,
    Eye,
    MoreVertical,
    Trash2,
} from "lucide-react-native";
import { useState } from "react";

interface ProjectActionsProps {
  project: ProjectItem;
}

export function ProjectActions({ project }: ProjectActionsProps) {
  const { updateProject, deleteProject, createProject } = useProjects();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [editForm, setEditForm] = useState({
    name: project.name,
    description: project.description || "",
  });

  // --- Handlers ---
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    setEditForm({
      name: project.name,
      description: project.description || "",
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Board name is required",
        variant: "destructive",
      });
      return;
    }

    updateProject.mutate({
      id: project.id,
      data: {
        name: editForm.name.trim(),
        description: editForm.description.trim() || undefined,
      },
    }, {
      onSuccess: () => setShowEditDialog(false)
    });
  };

  const handleDelete = () => {
    deleteProject.mutate(project.id, {
      onSuccess: () => setShowDeleteAlert(false)
    });
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    console.log("Navigate to project:", project.id);
    toast({
      title: "Navigation",
      description: "Project view functionality to be implemented",
    });
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    createProject.mutate({
      name: `${project.name} (Copy)`,
      description: project.description || "",
    });
  };

  // --- UI ---
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="!h-6 !w-6 p-0 hover:bg-black/10"
            onPress={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onPress={handleView} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            View Project
          </DropdownMenuItem>
          <DropdownMenuItem onPress={handleEdit} className="cursor-pointer">
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Project
          </DropdownMenuItem>
          <DropdownMenuItem onPress={handleDuplicate} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onPress={(e) => {
              e.stopPropagation(); // Prevent card click navigation
              setShowDeleteAlert(true);
            }}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-2">
                Project Name *
              </label>
              <Input
                id="name"
                value={editForm.name}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter project name"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-2">
                Description
              </label>
              <Textarea
                id="description"
                value={editForm.description}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, description: text }))}
                placeholder="Enter project description"
                numberOfLines={3}
                className="w-full resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onPress={() => setShowEditDialog(false)}
              disabled={updateProject.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onPress={handleSaveEdit}
              disabled={updateProject.isPending}
            >
              {updateProject.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project{" "}
              <span className="font-semibold">"{project.name}"</span> and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProject.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onPress={handleDelete}
              disabled={deleteProject.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteProject.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
