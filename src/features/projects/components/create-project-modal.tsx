"use client";

import { ResponsiveModal } from "@/components/responsive-model";
import { CreateProjectForm } from "./create-project-form";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";

export function CreateProjectModal() {
  const { isOpen, close, setIsOpen } = useCreateProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
}
