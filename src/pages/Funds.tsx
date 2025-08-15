import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageTitle } from "@/components/shared/PageTitle";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

export default function Funds() {
  const { profile } = useAuth();
  const { depositFunds, withdrawFunds, refreshData } = useData();
  const { toast } = useToast();
  
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
      });
      return;
    }
    
    try {
      setIsDepositing(true);
      console.log("Starting deposit of", amount);
      await depositFunds(amount);
      
      toast({
        title: "Deposit Successful",
        description: `$${amount.toFixed(2)} has been added to your account`,
      });
      
      setDepositAmount("");
      
      // Force an immediate data refresh to update UI
      console.log("Forcing refresh after deposit");
      refreshData();
    } catch (error) {
      console.error("Deposit error:", error);
      toast({
        variant: "destructive",
        title: "Deposit Failed",
        description: "There was an error processing your deposit",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
      });
      return;
    }
    
    if (!profile || amount > profile.balance) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: "You do not have enough funds to withdraw this amount",
      });
      return;
    }
    
    try {
      setIsWithdrawing(true);
      console.log("Starting withdrawal of", amount);
      await withdrawFunds(amount);
      
      toast({
        title: "Withdrawal Successful",
        description: `$${amount.toFixed(2)} has been withdrawn from your account`,
      });
      
      setWithdrawAmount("");
      
      // Force an immediate data refresh to update UI
      console.log("Forcing refresh after withdrawal");
      refreshData();
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast({
        variant: "destructive",
        title: "Withdrawal Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <AppLayout>
      <PageTitle 
        title="Manage Funds" 
        description="Deposit or withdraw funds from your account"
      />
      
      <div className="grid gap-6">
        {/* Current Balance Card */}
        <StatCard
          title="Current Balance"
          value={profile ? formatCurrency(profile.balance) : "$0.00"}
          icon={<Wallet className="h-6 w-6" />}
          className="border-2 border-primary/20"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deposit Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowDownLeft className="w-5 h-5 mr-2 text-trading-green" /> 
                Deposit Funds
              </CardTitle>
              <CardDescription>
                Add money to your trading account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleDeposit}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="depositAmount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="depositAmount"
                        type="number"
                        placeholder="0.00"
                        className="pl-7"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-trading-green hover:bg-trading-green/90"
                  disabled={isDepositing || !depositAmount}
                >
                  {isDepositing ? "Processing..." : "Deposit Funds"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          {/* Withdraw Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpRight className="w-5 h-5 mr-2 text-trading-red" /> 
                Withdraw Funds
              </CardTitle>
              <CardDescription>
                Withdraw money from your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleWithdraw}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdrawAmount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="withdrawAmount"
                        type="number"
                        placeholder="0.00"
                        className="pl-7"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        min="0"
                        max={profile?.balance || 0}
                        step="0.01"
                      />
                    </div>
                    {profile && (
                      <p className="text-xs text-muted-foreground">
                        Available: {formatCurrency(profile.balance)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  variant="outline"
                  className="w-full"
                  disabled={isWithdrawing || !withdrawAmount || !profile || parseFloat(withdrawAmount) > profile.balance}
                >
                  {isWithdrawing ? "Processing..." : "Withdraw Funds"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
            <CardDescription>
              Important information about deposits and withdrawals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium">Processing Time</h3>
                <p className="text-sm text-muted-foreground">
                  Deposits are typically processed instantly. Withdrawals may take 1-3 business days to process depending on your bank.
                </p>
              </div>
              
              <div>
                <h3 className="text-base font-medium">Transaction Limits</h3>
                <p className="text-sm text-muted-foreground">
                  Minimum deposit: $10.00
                  <br />
                  Minimum withdrawal: $10.00
                  <br />
                  Maximum deposit: $1,000,000.00 per transaction
                  <br />
                  Maximum withdrawal: $100,000.00 per transaction
                </p>
              </div>
              
              <div>
                <h3 className="text-base font-medium">Fees</h3>
                <p className="text-sm text-muted-foreground">
                  Aether Trade does not charge fees for deposits or withdrawals. However, your bank or payment provider may charge fees for certain transaction types.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
