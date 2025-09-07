"use client";

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";

interface Props {
  children: React.ReactNode;
}

export default function CustomApolloProvider({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
