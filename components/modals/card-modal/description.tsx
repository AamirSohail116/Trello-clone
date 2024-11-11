"use client";

import { updateCard } from "@/actions/update-card";
import FormSubmit from "@/components/form/firm-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithLsit } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface DescriptionProps {
  data: CardWithLsit;
}

const Description = ({ data }: DescriptionProps) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id],
      });
      toast.success(`Card  "${data.title}" updated`);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const enableEditing = () => {
    setIsEditing(true);

    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useOnClickOutside(formRef, disableEditing);
  useEventListener("keydown", onKeyDown);

  const onSumbit = (formData: FormData) => {
    const description = formData.get("description") as string;
    const boardId = params.boardId as string;

    execute({ description, boardId, id: data.id });
  };

  return (
    <div className=" flex items-start gap-x-3 w-full">
      <AlignLeft className=" size-5 mt-0.5 text-neutral-700" />
      <div className=" w-full">
        <p className=" font-semibold text-neutral-700 mb-2">Description</p>
        {isEditing ? (
          <form action={onSumbit} ref={formRef} className=" space-y-2">
            <FormTextarea
              id="description"
              className=" w-full mt-2"
              ref={textareaRef}
              placeholder="Add a more detailed description"
              defaultValue={data.description || undefined}
              errors={fieldErrors}
            />
            <div className=" flex items-center gap-x-1">
              <FormSubmit>Save</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size={"sm"}
                variant={"ghost"}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className=" min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {data.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Description;

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className=" flex items-start gap-x-3 mb-6">
      <Skeleton className=" h-6 w-6 mt-1 bg-neutral-200" />
      <div className=" w-full">
        <Skeleton className=" w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className=" w-full h-[78px]  bg-neutral-100" />
      </div>
    </div>
  );
};
