import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { TaskStatus } from "../types";

export function useTaskFilters() {
  return useQueryStates({
    projectId: parseAsString,
    assigneeId: parseAsString,
    status: parseAsStringEnum<TaskStatus>(Object.values(TaskStatus)),
    search: parseAsString,
    dueDate: parseAsString,
  });
}
