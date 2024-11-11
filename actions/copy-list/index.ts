"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import db from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyList } from "./schema";
import { title } from "process";
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
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      include: {
        cards: true,
      },
    });

    if (!listToCopy) {
      return {
        error: "Failed to delete.",
      };
    }

    const lastList = await db.list.findFirst({
      where: {
        boardId,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} - Copy`,
        order: newOrder,
        ...(listToCopy.cards.length > 0 && {
          cards: {
            createMany: {
              data: listToCopy.cards.map((card) => ({
                title: card.title,
                description: card.description,
                order: card.order,
              })),
            },
          },
        }),
      },
      include: {
        cards: true,
      },
    });

    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    });
  } catch {
    return {
      error: "Failed to copy.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
};

export const copyList = createSafeAction(CopyList, handler);
