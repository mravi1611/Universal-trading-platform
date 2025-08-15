
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AssetTable } from "@/components/dashboard/AssetTable"; 
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, RefreshCw, Banknote, ChevronRight } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { Asset } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Index = () => {
  const { user, isLoading } = useAuth();
  const { marketData } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trendingStocks, setTrendingStocks] = useState<Asset[]>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    // Auto-redirect logged in users to dashboard
    if (user && !isLoading) {
      console.log("User logged in, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }

    if (marketData.stocks.length > 0) {
      const trending = [...marketData.stocks]
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 5);
      setTrendingStocks(trending);
    }
  }, [user, isLoading, navigate, marketData.stocks]);

  const handleTradeClick = () => {
    if (!user) {
      setShowAuthDialog(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-trading-blue to-trading-blue-light text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="bg-white/20 text-white hover:bg-white/30 mb-4">
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  AI-Powered Trading
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                  Trade Smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">UnivTrade</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-white/80 leading-relaxed">
                  The universal AI-powered trading platform for stocks, crypto, forex and mutual funds. Make data-driven decisions with our advanced analytics.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-white text-trading-blue hover:bg-white/90"
                  onClick={() => navigate("/register")}
                >
                  Create Free Account
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="p-4 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 w-full max-w-md">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold">Trending Stocks</h3>
                  <Badge variant="outline" className="border-white/40 text-white/80">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Live Data
                  </Badge>
                </div>
                <div className="space-y-3">
                  {trendingStocks.map((stock) => (
                    <div key={stock.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                          {stock.symbol.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{stock.name}</p>
                          <p className="text-sm text-white/70">{stock.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${stock.price.current.toFixed(2)}
                        </p>
                        <p className={`text-sm ${stock.price.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {stock.price.change >= 0 ? "+" : ""}
                          {stock.price.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white"
                  onClick={handleTradeClick}
                >
                  Start Trading <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="bg-white/20 text-white hover:bg-white/30 mb-4">
                <Shield className="h-3.5 w-3.5 mr-1" />
                Platform Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trade Multiple Asset Classes</h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Our platform gives you access to global markets with real-time data and AI-powered insights
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-all hover:translate-y-[-4px]">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <Banknote className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trade Stocks</h3>
                <p className="text-white/80">
                  Access global stock markets with real-time data and AI-powered insights
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-all hover:translate-y-[-4px]">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <Banknote className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trade Crypto</h3>
                <p className="text-white/80">
                  Buy and sell cryptocurrencies with advanced technical analysis tools
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-all hover:translate-y-[-4px]">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <Banknote className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trade Forex</h3>
                <p className="text-white/80">
                  Trade currency pairs with competitive spreads and market depth information
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-all hover:translate-y-[-4px]">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <Banknote className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trade Funds</h3>
                <p className="text-white/80">
                  Invest in a wide range of mutual funds and ETFs for long-term growth
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Trending Assets</h2>
            <p className="text-xl text-white/80">
              Start trading with the most popular assets on our platform
            </p>
          </div>
          <div className="mb-8">
            <AssetTable 
              title="Trending Stocks" 
              assetType="stocks" 
              assets={trendingStocks} 
              showActions={true} 
            />
          </div>
          <div className="text-center">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={handleTradeClick}
            >
              View All Markets
            </Button>
          </div>
        </div>

        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Sign in required</DialogTitle>
              <DialogDescription>
                You need to sign in or create an account to start trading.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-center">
              <Button
                variant="default"
                onClick={() => {
                  setShowAuthDialog(false);
                  navigate("/register");
                }}
              >
                Create Account
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAuthDialog(false);
                  navigate("/login");
                }}
              >
                Sign In
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
