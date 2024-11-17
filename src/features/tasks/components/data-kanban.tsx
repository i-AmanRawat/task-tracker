import { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { KanbanColumnHeader } from "./kanban-column-header";

import { Task, TaskStatus } from "../types";

// const boards: TaskStatus = [
//   TaskStatus.BACKLOG,
//   TaskStatus.DONE,
//   TaskStatus.IN_PROGRESS,
//   TaskStatus.IN_REVIEW,
//   TaskStatus.TODO,
// ];

const boards: TaskStatus[] = Object.values(TaskStatus);

type TasksState = {
  [key in TaskStatus]: Task[];
};

/*
//mapped type in TypeScript : Dynamic Key Assignment : Automatically generates keys from a union or enum.
type TasksState = {
  TODO: Task[];
  IN_PROGRESS: Task[];
  IN_REVIEW: Task[];
  DONE: Task[];
  BACKLOG: Task[];
};
*/

interface DataKanbanProps {
  data: Task[];
}

export function DataKanban({ data }: DataKanbanProps) {
  const [tasks, setTasks] = useState<TasksState>(() => {
    //initializing statuses with empty task lists
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.DONE]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.TODO]: [],
    };

    //mapping all tasks and categorizing them on the basis of status
    data.forEach((task) => initialTasks[task.status].push(task));

    //using key(status) and sorting the task list under each key using position parameter
    Object.keys(initialTasks).forEach((key) =>
      initialTasks[key as TaskStatus].sort((a, b) => a.position - b.position)
    );

    return initialTasks;
  });

  // using useCallback is optional
  const onDragEnd = useCallback(() => {
    // the only one that is required
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board, index) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              {/* <Draggable key={board.$id} draggableId={board.$id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {board.name}
                  </div>
                )}
              </Draggable> */}
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
