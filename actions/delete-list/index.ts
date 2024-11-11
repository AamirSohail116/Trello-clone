"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import db from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteList } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;

  if (!id) {
    return {
      error: "Id is required.",
    };
  }

  let list;
  try {
    list = await db.list.delete({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
    });

    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.DELETE,
    });
  } catch {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
};

export const deletList = createSafeAction(DeleteList, handler);
