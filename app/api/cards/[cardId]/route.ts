import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    const card = await db.card.findUnique({
      where: {
        id: params.cardId,
        List: {
          board: {
            orgId,
          },
        },
      },
      include: {
        List: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...card,
      list: card?.List,
    });
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
