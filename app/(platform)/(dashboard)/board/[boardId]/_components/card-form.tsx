"use client";

import { createCard } from "@/actions/create-card";
import FormSubmit from "@/components/form/firm-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, forwardRef, KeyboardEventHandler, useRef } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFormProps {
  listId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
}

const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, enableEditing, disableEditing, isEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" created`);
        formRef.current?.reset();
      },
      onError: (error) => {
        toast.error(error);
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", onKeyDown);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formdata: FormData) => {
      const title = formdata.get("title") as string;
      const listId = formdata.get("listId") as string;
      const boardId = params.boardId as string;

      execute({ title, listId, boardId });
    };

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onSubmit}
          className=" m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextarea
            id="title"
            onKeyDown={onTextareaKeyDown}
            ref={ref}
            placeholder="Enter a title for this card..."
            errors={fieldErrors}
          />
          <input hidden name="listId" id="listId" value={listId} />
          <div className=" flex items-center gap-x-1">
            <FormSubmit>Add card</FormSubmit>
            <Button onClick={disableEditing} size={"sm"} variant={"ghost"}>
              <X className=" size-4" />
            </Button>
          </div>
        </form>
      );
    }
    return (
      <div className=" pt-2 px-2">
        <Button
          onClick={enableEditing}
          className=" h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          size={"sm"}
          variant={"ghost"}
        >
          <Plus className=" size-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";
export default CardForm;
