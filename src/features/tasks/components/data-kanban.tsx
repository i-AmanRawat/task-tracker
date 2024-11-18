import { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";

import { Task, TaskStatus } from "../types";

// const boards: TaskStatus = [
//   TaskStatus.BACKLOG,
//   TaskStatus.DONE,
// ...
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
....
};
*/

interface DataKanbanProps {
  data: Task[];
  onChange: (
    tasks: { $id: string; status: TaskStatus; position: number }[]
  ) => void;
}

export function DataKanban({ data, onChange }: DataKanbanProps) {
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

  useEffect(() => {
    const newTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.DONE]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.TODO]: [],
    };

    //mapping all tasks and categorizing them on the basis of status
    data.forEach((task) => newTasks[task.status].push(task));

    //using key(status) and sorting the task list under each key using position parameter
    Object.keys(newTasks).forEach((key) =>
      newTasks[key as TaskStatus].sort((a, b) => a.position - b.position)
    );

    setTasks(newTasks);
  }, [data]);

  // using useCallback is optional  //trigger the function whenever a drag-and-drop interaction ends
  //workflow
  /*
      ### **High-Level Workflow**
    1. **Drag Event Ends**: User drops a task somewhere on the board.
    2. **Check Valid Destination**: Ensure the task was dropped in a valid column.
    3. **Update State**:
      - Remove the task from the source column.
      - Optionally update its status.
      - Insert it into the destination column.
      - Recalculate positions for all tasks in both columns.
    4. **Generate Payload**: Collect updated task information for potential backend sync.
  */

  const onDragEnd = useCallback(
    (result: DropResult) => {
      // the only one that is required
      if (!result.destination) return; //destination not found

      const { source, destination } = result;

      const sourceStatus = source.droppableId as TaskStatus;
      const destinationStatus = destination.droppableId as TaskStatus;

      let updatesPayload: {
        $id: string;
        status: TaskStatus;
        position: number;
      }[] = []; //basically only 3 things are changing for a task id to keep track, status will change if the putting into diff header , and also the position

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };

        //safely remove the task from the source column
        const sourceColumnsTask = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumnsTask.splice(source.index, 1); //removed the task from the source column

        //if there is no moved task (shouldn't happen but incase), return the previous state
        if (!movedTask) {
          //no task got removed then simply keep the source column's task list as it is
          console.error("No task found at the source index");
          return prevTasks;
        }

        //need to push the updated task inside destination header list
        //create a new(updated) task object with potentially updated status
        //utilize the moved task (that we moved from source header)
        const updatedMovedTask =
          sourceStatus !== destinationStatus
            ? { ...movedTask, status: destinationStatus }
            : movedTask;

        //update the source column
        newTasks[sourceStatus] = sourceColumnsTask;

        //add updated task(staus updated) to destination column
        const destinationColumnsTask = [...newTasks[destinationStatus]];
        destinationColumnsTask.splice(destination.index, 0, updatedMovedTask);

        newTasks[destinationStatus] = destinationColumnsTask;

        //prepare minimal update payload
        updatesPayload = [];

        //always update the moved task
        updatesPayload.push({
          $id: movedTask.$id,
          status: destinationStatus,
          position: Math.min((destination.index + 1) * 1000, 1_000_000), //don't want it to exceed more than a million
        });

        //update the positions for affected tasks in the destination column(here the destination col could be same as source)
        newTasks[destinationStatus].forEach((task, index) => {
          if (task && task.$id !== updatedMovedTask.$id) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000); //don't want it to exceed more than a million

            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: destinationStatus,
                position: newPosition,
              });
            }
          }
        });

        //if the task moved between columns, update the position in the source column
        if (sourceStatus !== destinationStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = Math.min((index + 1) * 1000, 1_000_000); //don't want it to exceed more than a million

              if (task.position !== newPosition) {
                updatesPayload.push({
                  $id: task.$id,
                  status: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }

        return newTasks;
      });

      onChange(updatesPayload);
    },
    [onChange]
  );

  // const onDragEnd = useCallback(() => {}, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
