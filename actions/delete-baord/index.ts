"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import db from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { decreaseAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const isPro = await checkSubscription();

  const { id } = data;

  if (!id) {
    return {
      error: "Id is required.",
    };
  }

  let board;
  try {
    board = await db.board.delete({
      where: {
        id,
        orgId,
      },
    });

    if (!isPro) {
      await decreaseAvailableCount();
    }

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE,
    });
  } catch {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/organization/${id}`);
  redirect(`/organization/${orgId}`);
};

export const deletBoard = createSafeAction(DeleteBoard, handler);
