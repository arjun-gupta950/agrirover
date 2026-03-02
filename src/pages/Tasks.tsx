import { useState } from "react";
import { CalendarCheck, Droplets, FlaskConical, Bug, Wheat, Plus, Check } from "lucide-react";
import { mockTasks, type Task } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const typeIcons = { irrigation: Droplets, fertilizer: FlaskConical, pest: Bug, harvest: Wheat };
const typeColors = { irrigation: "text-info", fertilizer: "text-primary", pest: "text-warning", harvest: "text-accent" };

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const toggle = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Scheduler</h1>
          <p className="text-sm text-muted-foreground mt-1">Farm tasks and irrigation reminders</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => {
          const Icon = typeIcons[task.type];
          return (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card transition-all",
                task.completed && "opacity-60"
              )}
            >
              <button
                onClick={() => toggle(task.id)}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                  task.completed ? "border-primary bg-primary" : "border-border hover:border-primary/50"
                )}
              >
                {task.completed && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
              </button>
              <Icon className={cn("h-5 w-5 shrink-0", typeColors[task.type])} />
              <div className="flex-1 min-w-0">
                <p className={cn("font-medium text-card-foreground", task.completed && "line-through")}>{task.title}</p>
                <p className="text-xs text-muted-foreground">
                  Due: {format(new Date(task.dueDate), "MMM d, yyyy 'at' HH:mm")}
                </p>
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
                {task.type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
