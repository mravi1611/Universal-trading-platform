
import AppLayout from "@/components/layout/AppLayout";
import { PageTitle } from "@/components/shared/PageTitle";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { useData } from "@/contexts/DataContext";
import { useEffect } from "react";

export default function Transactions() {
  const { transactions, refreshData } = useData();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <AppLayout>
      <PageTitle 
        title="Transaction History" 
        description="View your complete transaction history"
      />
      
      <TransactionsList transactions={transactions} />
    </AppLayout>
  );
}
