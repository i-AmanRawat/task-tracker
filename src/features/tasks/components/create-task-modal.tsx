"use client";

import { ResponsiveModal } from "@/components/responsive-model";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import CreateTaskFormWrapper from "./create-task-form-wrapper";

export default function CreateTaskModal() {
  const { isOpen, close, setIsOpen } = useCreateTaskModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
}
