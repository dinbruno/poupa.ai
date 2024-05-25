"use client";
import { Toaster } from "sonner";
import withAuth from "@/hooks/useWithAuth";
import React from "react";
import AdminLayout from "@/components/Layout";

function Template({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>
      <Toaster />
      {children}
    </AdminLayout>
  );
}

export default withAuth(Template);
