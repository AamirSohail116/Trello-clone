"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithLsit } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Header from "./header";
import Description from "./description";
import Actions from "./actions";
import { AuditLog } from "@prisma/client";
import Activity from "./activity";

const CardModal = () => {
  const { id, isOpen, onClose } = useCardModal((state) => state);

  const { data: cardData } = useQuery<CardWithLsit>({
    queryKey: ["key", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  });

  const { data: auditlLogsdata } = useQuery<AuditLog[]>({
    queryKey: ["card-logs", id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
        <div className=" grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className=" col-span-3">
            <div className=" w-full space-y-6">
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description data={cardData} />
              )}
              {!cardData ? (
                <Activity.Skeleton />
              ) : (
                <Activity items={auditlLogsdata!} />
              )}
            </div>
          </div>
          {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
