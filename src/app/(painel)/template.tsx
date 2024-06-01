"use client";
import { Toaster } from "sonner";
import withAuth from "@/hooks/useWithAuth";
import React from "react";
import AdminLayout from "@/components/Layout";

function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#FAFCFF] h-full">
      <AdminLayout>
        <Toaster />
        {children}
      </AdminLayout>
    </div>
  );
}

export default withAuth(Template);
