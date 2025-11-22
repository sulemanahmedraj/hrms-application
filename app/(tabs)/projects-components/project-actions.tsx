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
import { Text, View } from "react-native";

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
  const handleEdit = (e: any) => {
    // e.stopPropagation(); // Not needed/supported in the same way for RN DropdownMenuItem usually, but if it is, keep it. 
    // However, DropdownMenuItem in RN primitives usually handles this. 
    // If using a web-compat library, event might exist. 
    // For safety in RN, we usually don't need stopPropagation on menu items unless they bubble to a parent pressable.
    // But since the parent Card has onPress, we might need it if the menu is inside the card.
    // The DropdownMenuTrigger is inside the card.
    // On RN, the Modal/Dropdown usually overlays, so pressing it doesn't trigger the card underneath.
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

  const handleView = (e: any) => {
    // e.stopPropagation();
    console.log("Navigate to project:", project.id);
    toast({
      title: "Navigation",
      description: "Project view functionality to be implemented",
    });
  };

  const handleDuplicate = (e: any) => {
    // e.stopPropagation();
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
          // onPress={(e) => e.stopPropagation()} // RN Button might not need this if it captures touch
          >
            <MoreVertical className="h-4 w-4" />
            <Text className="sr-only">Open menu</Text>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onPress={handleView} className="cursor-pointer flex-row items-center">
            <Eye className="mr-2 h-4 w-4" />
            <Text>View Project</Text>
          </DropdownMenuItem>
          <DropdownMenuItem onPress={handleEdit} className="cursor-pointer flex-row items-center">
            <Edit2 className="mr-2 h-4 w-4" />
            <Text>Edit Project</Text>
          </DropdownMenuItem>
          <DropdownMenuItem onPress={handleDuplicate} className="cursor-pointer flex-row items-center">
            <Copy className="mr-2 h-4 w-4" />
            <Text>Duplicate</Text>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onPress={() => {
              setShowDeleteAlert(true);
            }}
            className="cursor-pointer text-red-600 focus:text-red-600 flex-row items-center"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <Text className="text-red-600">Delete Project</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <View className="gap-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </Text>
              <Input
                value={editForm.name}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter project name"
                className="w-full"
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Description
              </Text>
              <Textarea
                value={editForm.description}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, description: text }))}
                placeholder="Enter project description"
                numberOfLines={3}
                className="w-full"
              />
            </View>
          </View>
          <DialogFooter>
            <Button
              variant="outline"
              onPress={() => setShowEditDialog(false)}
              disabled={updateProject.isPending}
            >
              <Text>Cancel</Text>
            </Button>
            <Button
              onPress={handleSaveEdit}
              disabled={updateProject.isPending}
            >
              <Text>{updateProject.isPending ? "Saving..." : "Save Changes"}</Text>
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
              <Text className="font-semibold">"{project.name}"</Text> and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Button variant="outline" onPress={() => setShowDeleteAlert(false)} disabled={deleteProject.isPending}>
                <Text>Cancel</Text>
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction>
              <Button
                variant="destructive"
                onPress={handleDelete}
                disabled={deleteProject.isPending}
              >
                <Text className="text-white">{deleteProject.isPending ? "Deleting..." : "Delete"}</Text>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
