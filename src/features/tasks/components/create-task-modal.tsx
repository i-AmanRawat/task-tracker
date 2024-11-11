"use client";

import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import CreateTaskFormWrapper from "@/features/tasks/components/create-task-form-wrapper";

import { ResponsiveModal } from "@/components/responsive-model";

export default function CreateTaskModal() {
  const { isOpen, close, setIsOpen } = useCreateTaskModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
}
