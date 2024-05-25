"use client";

import React from "react";
import LoadingComponent from "@/components/LoadingComponent";
import { useFamily } from "@/context/FamilyContext";
import LoginComponent from "@/app/entrar/@components/LoginComponent";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAuthComponent: React.FC = (props) => {
    const { isLoading, user } = useFamily();

    if (isLoading) {
      return <LoadingComponent />;
    }

    return user ? <WrappedComponent {...(props as P)} /> : <LoginComponent />;
  };

  return WithAuthComponent;
};

export default withAuth;
