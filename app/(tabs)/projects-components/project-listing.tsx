"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from "@/hooks/use-project";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "expo-router";
import { FileText } from "lucide-react-native";
import { ProjectActions } from "./project-actions";

export function ProjectList() {
    const router = useRouter();
    const { data: projects = [], status } = useProjects()


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };


    if (status == "pending") {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="pb-3">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            <div className="flex justify-between items-center">
                                <div className="h-5 bg-gray-200 rounded w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!projects.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500 max-w-sm">
                    Get started by creating your first project to organize your work and collaborate with your team.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project, index) => (
                <Card key={index} className="h-full hover:shadow-md hover:ring-2 ring-primary ring-offset-2 transition-shadow gap-0 cursor-pointer p-4" onPress={() => router.push(`/projects/${project.id}` as any)}>                    
                    <CardHeader className="!m-0 p-0">
                        <div className="flex justify-between items-start mb-2">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                {project.name}
                            </CardTitle>
                            <ProjectActions project={project} />
                        </div>
                    </CardHeader>
                    <CardContent className="!p-0 flex flex-col gap-2 justify-end h-full">
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <Badge variant={"outline"} className={"ml-auto relative"}>Created At {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</Badge>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
