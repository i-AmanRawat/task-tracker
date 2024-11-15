"use client";

import { useEditTaskModal } from "@/features/tasks/hooks/use-edit-task-modal";
import EditTaskFormWrapper from "@/features/tasks/components/edit-task-form-wrapper";

import { ResponsiveModal } from "@/components/responsive-model";

export default function EditTaskModal() {
  const { taskId, close } = useEditTaskModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskFormWrapper id={taskId} onCancel={close} />}
    </ResponsiveModal>
  );
}
