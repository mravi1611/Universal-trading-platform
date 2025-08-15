
import AppLayout from "@/components/layout/AppLayout";
import { PageTitle } from "@/components/shared/PageTitle";
import { useData } from "@/contexts/DataContext";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { useEffect } from "react";

export default function History() {
  const { transactions, refreshData } = useData();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <AppLayout>
      <PageTitle 
        title="Trading History" 
        description="View your complete trading and transaction history"
      />
      
      <TransactionsList transactions={transactions} />
    </AppLayout>
  );
}
