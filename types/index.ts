export interface JwtPayload{
    id?:string,
  }
  
  // ================= Enums =================
  export type ViewType = "KANBAN" | "LIST" | "TABLE" | "CALENDAR" | "GANTT";
  
  export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  
  export type SystemRole = "ADMIN" | "USER" | "MANAGER" | "GUEST";
  
  export type WorkspacePermission = "VIEW" | "COMMENT" | "EDIT" | "MANAGE" | "ADMIN";
  
  export type Gender = "MALE" | "FEMALE" | "OTHER";
  
  export type LocationType = "CONTINENT" | "COUNTRY" | "STATE" | "CITY" | "DISTRICT" | "ZONE";
  
  export type NotificationType = "TASK_UPDATE" | "MENTION" | "SYSTEM" | "WORKSPACE";
  
  // ================= Core Role & Permission =================
  export interface Permission {
    id: string;
    key: string;
    value: string;
    createdAt: string;
    roles?: Role[];
  }
  
  export interface Role {
    id: string;
    key: string;
    value: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    permissions: Permission[];
    users?: User[];
  }
  
  // ================= User =================
  export interface User {
    id: string;
    name: string;
    username: string;
    email?: string | null;
    gender: Gender;
    profileImage?: string | null;
    password: string;
    verified: boolean;
    otp?: string | null;
    otpExpiry?: string | null;
    refreshToken?: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
  
    roleId?: string | null;
    role?: Role;
  
    locationId?: string | null;
    location?: Location;
  
    ownedWorkspaces?: Workspace[];
    memberships?: WorkspaceMember[];
    currentWorkspaceId?: string | null;
    currentWorkspace?: Workspace;
  
    workspaceAccess?: UserWorkspaceAccess[];
    ownedTasks?: Task[];
    assignedTasks?: TaskAssignee[];
    comments?: Comment[];
    stickyNotes?: StickyNoteType[];
    timeEntries?: TimeEntry[];
    notifications?: Notification[];
  
    userSettings?: UserSettings | null;
    workspaceActivities?: WorkspaceActivity[];
  
    permissions: Permission[];
  }
  
  // ================= Workspace & Access =================
  export interface UserWorkspaceAccess {
    userId: string;
    workspaceId: string;
    lastAccess: string;
    permissions: WorkspacePermission[];
    user?: User;
    workspace?: Workspace;
  }
  
  export interface Workspace {
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    isActive: boolean;
  
    ownerId: string;
    owner?: User;
  
    members?: WorkspaceMember[];
    boards?: Board[];
    activities?: WorkspaceActivity[];
    stickyNotes?: StickyNoteType[];
    currentUsers?: User[];
    accessRecords?: UserWorkspaceAccess[];
  }
  
  export interface WorkspaceMember {
    workspaceId: string;
    userId: string;
    permissions: WorkspacePermission[];
    joinedAt: string;
    lastAccess?: string | null;
    workspace?: Workspace;
    user?: User;
  }
  
  export interface WorkspaceActivity {
    id: string;
    workspaceId: string;
    userId: string;
    action: string;
    metadata?: any;
    createdAt: string;
    workspace?: Workspace;
    user?: User;
  }
  
  // ================= Location =================
  export interface Location {
    id: string;
    name: string;
    type: LocationType;
    parentId?: string | null;
    parent?: Location;
    children?: Location[];
    createdAt: string;
    updatedAt: string;
    users?: User[];
  }
  
  // ================= Notifications =================
  export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    metadata?: any;
    isRead: boolean;
    recipientId: string;
    createdAt: string;
    recipient?: User;
  }
  
  // ================= User Settings =================
  export interface UserSettings {
    userId: string;
    sms: boolean;
    email: boolean;
    whatsApp: boolean;
    app: boolean;
    user?: User;
  }
  
  // ================= Time Tracking =================
  export interface TimeEntry {
    id: string;
    userId: string;
    taskId?: string | null;
    description?: string | null;
    startTime: string;
    endTime?: string | null;
    duration?: number | null;
    createdAt: string;
  
    user?: User;
    task?: Task;
  }
  
  // ================= Board & Task =================
  export interface BoardStatus {
    id: string;
    name: string;
    color: string;
    boardId: string;
    order: number;
    createdAt: string;
  
    board?: Board;
    tasks?: Task[];
  }
  
  export interface Board {
    id: string;
    name: string;
    description?: string | null;
    workspaceId: string;
    viewType: ViewType;
    createdAt: string;
    updatedAt: string
  
    workspace?: Workspace;
    lists?: List[];
    statuses?: BoardStatus[];
  }
  
  export interface List {
    id: string;
    name: string;
    boardId: string;
    order: number;
    board?: Board;
    tasks?: Task[];
  }
  
  export interface Task {
    id: string;
    title: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
    dueDate?: string | null;
    priority: TaskPriority;
    ownerId: string;
    listId?: string | null;
    statusId?: string | null;
    parentId?: string | null;
    completedAt?: string | null;
    estimatedHours?: number | null;
    isArchived: boolean;
  
    owner?: User;
    list?: List;
    status?: BoardStatus;
    parent?: Task;
  
    subtasks?: Task[];
    assignees?: TaskAssignee[];
    timeEntries?: TimeEntry[];
    labels?: TaskLabel[];
    attachments?: TaskAttachment[];
    comments?: Comment[];
  }
  
  export interface TaskAssignee {
    taskId: string;
    userId: string;
    createdAt: string;
    task?: Task;
    user?: User;
  }
  
  export interface TaskLabel {
    id: string;
    name: string;
    color: string;
    taskId: string;
    createdAt: string;
    task?: Task;
  }
  
  export interface TaskAttachment {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    taskId: string;
    createdAt: string;
    task?: Task;
  }
  
  export interface Comment {
    id: string;
    content: string;
    taskId: string;
    userId: string;
    parentId?: string | null;
    createdAt: string;
    updatedAt: string;
  
    task?: Task;
    user?: User;
    parent?: Comment;
    replies?: Comment[];
  }
  
  export interface StickyNoteType {
    id: string;
    content: string;
    color: string;
    colorHeader: string;
    colorBody: string;
    positionX: number;
    positionY: number;
    width: number;
    height: number;
    createdAt: string; // or Date if you prefer actual Date objects
    updatedAt: string;
    ownerId: string;
    workspaceId: string;
  
    owner?: User;
    workspace?: Workspace;
  }
  
  
  
  export interface ProjectItem {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  
    workspaceId: string;
    workspace?: Workspace;
  
    // timeEntries
  }