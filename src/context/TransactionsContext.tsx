import { ReactNode, useEffect, useState, useCallback } from "react";
import { createContext } from "use-context-selector";
import { api } from "../libs/axios";

interface Transaction {
  id: number;
  description: string;
  type: "income" | "outcome";
  category: string;
  price: number;
  created_at: string;
}
interface CreateTransactionInput {
  description: string;
  price: number;
  category: string;
  type: "income" | "outcome";
}

interface TransactionContextType {
  transactions: Transaction[];
  createTransaction: (data: CreateTransactionInput) => Promise<void>;
  fetchTransactions: (query?: string) => Promise<void>;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get("/transactions", {
      params: {
        _sort: "created_at",
        _order: "desc",
        q: query,
      },
    });
    setTransactions(response.data);
  }, []);

  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const { description, price, category, type } = data;
      const response = await api.post("transactions", {
        description,
        price,
        category,
        type,
        created_at: new Date(),
      });
      setTransactions((oldState) => [response.data, ...oldState]);
    },
    []
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // async function createTransaction(data: CreateTransactionInput) {
  //   const { description, price, category, type } = data;
  //   const response = await api.post("transactions", {
  //     description,
  //     price,
  //     category,
  //     type,
  //     created_at: new Date(),
  //   });
  //   setTransactions((oldState) => [response.data, ...oldState]);
  // }

  // useEffect(() => {
  //   fetchTransactions();
  // }, []);

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
