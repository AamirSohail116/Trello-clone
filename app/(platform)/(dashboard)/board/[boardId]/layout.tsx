import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import BoardNavbar from "./_components/board-navbar";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const { orgId } = await auth();

  if (!orgId)
    return {
      title: "Board",
    };

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  return {
    title: board?.title || "Board",
  };
}

export default async function BoardIdLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { boardId: string };
}>) {
  const { orgId } = await auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  if (!board) {
    return notFound();
  }

  return (
    <div
      className="  h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar data={board} />
      <div className=" absolute inset-0 bg-black/10 z-[10]" />
      <main className=" relative pt-28  h-full z-[20]">{children}</main>
    </div>
  );
}
