"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api-handler";
import { toast } from "./use-toast";
import type { ProjectItem } from "@/types";

const PROJECTS_QUERY_KEY = ["projects"];

export function useProjects() {
  const queryClient = useQueryClient();

  // --- Fetch All Projects ---
  const projectsQuery = useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: async () => {
      const res = await apiGet<ProjectItem[]>("/projects/get-all-projects");
      return res.data;
    },
  });

  // --- Create Project ---
  const createProject = useMutation({
    mutationFn: async (payload: Partial<ProjectItem>) => {
      const res = await apiPost("/projects/create-project", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
      toast({
        title: "Success",
        description: "Project created successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project",
      })
    },
  });

  // --- Update Project ---
  const updateProject = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProjectItem> }) => {
      const res = await apiPatch(`/projects/update-project/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
      toast({
        title: "Success",
        description: "Project updated successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update project",
      })
    },
  });

  // --- Delete Project ---
  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiDelete(`/projects/delete-project/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project",
      })
    },
  });

  return {
    // Data
    data: projectsQuery.data ?? [],
    status: projectsQuery.status, // 'loading' | 'error' | 'success'
    error: projectsQuery.error,
    refetch: projectsQuery.refetch,

    // Mutations
    createProject,
    updateProject,
    deleteProject,
  };
}
