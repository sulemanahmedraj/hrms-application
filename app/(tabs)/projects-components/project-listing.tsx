"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from "@/hooks/use-project";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "expo-router";
import { FileText } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { ProjectActions } from "./project-actions";

export function ProjectList() {
    const router = useRouter();
    const { data: projects = [], status } = useProjects();

    if (status === "pending") {
        return (
            <View className="flex-row flex-wrap gap-6">
                {[...Array(8)].map((_, i) => (
                    <View key={i} className="w-full sm:w-[48%] lg:w-[31%] xl:w-[23%]">
                        <Card className="animate-pulse">
                            <CardHeader className="pb-3">
                                <View className="h-6 bg-gray-200 rounded w-3/4" />
                            </CardHeader>
                            <CardContent className="gap-3">
                                <View className="h-4 bg-gray-200 rounded w-full" />
                                <View className="h-4 bg-gray-200 rounded w-2/3" />
                                <View className="flex-row justify-between items-center">
                                    <View className="h-5 bg-gray-200 rounded w-16" />
                                    <View className="h-4 bg-gray-200 rounded w-20" />
                                </View>
                            </CardContent>
                        </Card>
                    </View>
                ))}
            </View>
        );
    }

    if (!projects.length) {
        return (
            <View className="flex-col items-center justify-center py-20">
                <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                    <FileText className="w-12 h-12 text-gray-400" />
                </View>
                <Text className="text-lg font-semibold text-gray-900 mb-2">No projects found</Text>
                <Text className="text-gray-500 text-center max-w-sm">
                    Get started by creating your first project to organize your work and collaborate with your team.
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-row flex-wrap gap-6">
            {projects.map((project, index) => (
                <View key={index} className="w-full sm:w-[48%] lg:w-[31%] xl:w-[23%]">
                    <Pressable
                        onPress={() => router.push(`/projects/${project.id}` as any)}
                        className="h-full"
                    >
                        <Card className="h-full hover:shadow-md hover:ring-2 ring-primary ring-offset-2 transition-shadow p-4">
                            <CardHeader className="!m-0 p-0">
                                <View className="flex-row justify-between items-start mb-2">
                                    <CardTitle className="flex-row items-center gap-2 text-xl">
                                        {project.name}
                                    </CardTitle>
                                    <ProjectActions project={project} />
                                </View>
                            </CardHeader>
                            <CardContent className="!p-0 flex-col gap-2 justify-end flex-1">
                                <Text className="text-sm text-muted-foreground" numberOfLines={2}>
                                    {project.description}
                                </Text>
                                <View className="flex-row ml-auto mt-auto">
                                    <Badge variant={"outline"}>
                                        Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                                    </Badge>
                                </View>
                            </CardContent>
                        </Card>
                    </Pressable>
                </View>
            ))}
        </View>
    );
}
