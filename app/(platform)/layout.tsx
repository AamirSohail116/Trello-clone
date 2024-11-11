import ModalProvider from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs";

export default function PaltformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <ModalProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
}
