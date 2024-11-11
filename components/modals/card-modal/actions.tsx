"use client";

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithLsit } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface ActionsProps {
  data: CardWithLsit;
}

const Actions = ({ data }: ActionsProps) => {
  const params = useParams();
  const { onClose } = useCardModal((state) => state);

  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title} copied"`);
        onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title} deleted"`);
        onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const onCopy = () => {
    console.log("Ima cliked");

    const boardId = params.boardId as string;

    executeCopyCard({
      id: data.id,
      boardId,
    });
  };

  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDeleteCard({
      id: data.id,
      boardId,
    });
  };

  return (
    <div className=" space-y-2 mt-2">
      <p className=" text-xs font-semibold ">Actions</p>
      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        variant="gray"
        size="inline"
        className=" w-full justify-start"
      >
        <Copy className=" h-4 w-4 mr-2" />
        Cop
      </Button>
      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        variant="gray"
        size="inline"
        className=" w-full justify-start"
      >
        <Trash className=" h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

export default Actions;

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className=" space-y-2 mt-2">
      <Skeleton className=" h-4 w-20  bg-neutral-200" />
      <Skeleton className=" h-8 w-full  bg-neutral-200" />
      <Skeleton className=" h-8 w-full  bg-neutral-200" />
    </div>
  );
};
