import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react-native";
import { Suspense } from "react";
import { AddProjectPopup } from "./projects-components/create-project";
import { ProjectList } from "./projects-components/project-listing";

const ProjectsPage = () => {
    return (
        <div className="p-4">
            <div className="flex items-center gap-2 mb-4 justify-between">
                <span className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">Projects</h1>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="text-muted-foreground hover:text-foreground transition-colors">
                                <Info className="h-4 w-4" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="space-y-2">
                                <h4 className="font-medium">API Response Format</h4>
                                <p className="text-sm text-muted-foreground">
                                    This table demonstrates <strong>snake_case</strong> API responses. Field names use underscores (e.g., first_name, last_name, created_at).
                                </p>
                            </div>
                        </PopoverContent>
                    </Popover>
                </span>
               <AddProjectPopup />
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <ProjectList />
            </Suspense>
        </div>
    );
};

export default ProjectsPage;
