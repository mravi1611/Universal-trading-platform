import { Asset, MarketData, Transaction, TradePosition, AssetHistoricalData } from "@/types";

// Common stock names and symbols for mocking
const stockSymbols = [
  { symbol: "AAPL", name: "Apple Inc.", country: "US" },
  { symbol: "MSFT", name: "Microsoft Corp.", country: "US" },
  { symbol: "AMZN", name: "Amazon.com Inc.", country: "US" },
  { symbol: "GOOGL", name: "Alphabet Inc.", country: "US" },
  { symbol: "META", name: "Meta Platforms Inc.", country: "US" },
  { symbol: "TSLA", name: "Tesla Inc.", country: "US" },
  { symbol: "NVDA", name: "NVIDIA Corp.", country: "US" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", country: "US" },
  { symbol: "V", name: "Visa Inc.", country: "US" },
  { symbol: "JNJ", name: "Johnson & Johnson", country: "US" },
  { symbol: "WMT", name: "Walmart Inc.", country: "US" },
  { symbol: "PG", name: "Procter & Gamble Co.", country: "US" },
  { symbol: "MA", name: "Mastercard Inc.", country: "US" },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", country: "US" },
  { symbol: "HD", name: "Home Depot Inc.", country: "US" },
  { symbol: "BAC", name: "Bank of America Corp.", country: "US" },
  { symbol: "XOM", name: "Exxon Mobil Corp.", country: "US" },
  { symbol: "INTC", name: "Intel Corp.", country: "US" },
  { symbol: "VZ", name: "Verizon Communications Inc.", country: "US" },
  { symbol: "PFE", name: "Pfizer Inc.", country: "US" },
  { symbol: "9984.T", name: "SoftBank Group Corp.", country: "JP" },
  { symbol: "7203.T", name: "Toyota Motor Corp.", country: "JP" },
  { symbol: "6758.T", name: "Sony Group Corp.", country: "JP" },
  { symbol: "HSBA.L", name: "HSBC Holdings plc", country: "UK" },
  { symbol: "SHEL.L", name: "Shell plc", country: "UK" },
  { symbol: "GSK.L", name: "GSK plc", country: "UK" },
  { symbol: "AIR.PA", name: "Airbus SE", country: "FR" },
  { symbol: "MC.PA", name: "LVMH Moët Hennessy", country: "FR" },
  { symbol: "SAP.DE", name: "SAP SE", country: "DE" },
  { symbol: "SIE.DE", name: "Siemens AG", country: "DE" },
  { symbol: "VOW3.DE", name: "Volkswagen AG", country: "DE" },
  { symbol: "SAN.MC", name: "Banco Santander, S.A.", country: "ES" },
  { symbol: "ENEL.MI", name: "Enel SpA", country: "IT" },
  { symbol: "NOVN.SW", name: "Novartis AG", country: "CH" },
  { symbol: "ROG.SW", name: "Roche Holding AG", country: "CH" },
  { symbol: "NESN.SW", name: "Nestlé S.A.", country: "CH" },
  { symbol: "CBA.AX", name: "Commonwealth Bank", country: "AU" },
  { symbol: "BHP.AX", name: "BHP Group Ltd", country: "AU" },
  { symbol: "600519.SS", name: "Kweichow Moutai Co", country: "CN" },
  { symbol: "601398.SS", name: "ICBC", country: "CN" },
  { symbol: "005930.KS", name: "Samsung Electronics Co", country: "KR" },
  { symbol: "RIL.NS", name: "Reliance Industries", country: "IN" },
  { symbol: "TCS.NS", name: "Tata Consultancy", country: "IN" },
  { symbol: "VALE3.SA", name: "Vale S.A.", country: "BR" },
  { symbol: "PETR4.SA", name: "Petróleo Brasileiro", country: "BR" },
  { symbol: "SU.TO", name: "Suncor Energy Inc.", country: "CA" },
  { symbol: "TD.TO", name: "Toronto-Dominion Bank", country: "CA" },
  { symbol: "SAPRE.MX", name: "Santander México", country: "MX" },
  { symbol: "WALMEX.MX", name: "Walmart de México", country: "MX" },
  { symbol: "ROSN.ME", name: "Rosneft Oil Company", country: "RU" },
];

// Common crypto names and symbols
const cryptoSymbols = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "BNB", name: "Binance Coin" },
  { symbol: "XRP", name: "XRP" },
  { symbol: "ADA", name: "Cardano" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "DOT", name: "Polkadot" },
  { symbol: "DOGE", name: "Dogecoin" },
  { symbol: "AVAX", name: "Avalanche" },
  { symbol: "MATIC", name: "Polygon" },
  { symbol: "LINK", name: "Chainlink" },
  { symbol: "UNI", name: "Uniswap" },
  { symbol: "LTC", name: "Litecoin" },
  { symbol: "ALGO", name: "Algorand" },
  { symbol: "XLM", name: "Stellar" },
  { symbol: "FTM", name: "Fantom" },
  { symbol: "ATOM", name: "Cosmos" },
  { symbol: "VET", name: "VeChain" },
  { symbol: "MANA", name: "Decentraland" },
  { symbol: "SAND", name: "The Sandbox" },
  { symbol: "AXS", name: "Axie Infinity" },
  { symbol: "AAVE", name: "Aave" },
  { symbol: "EGLD", name: "Elrond" },
  { symbol: "THETA", name: "Theta Network" },
  { symbol: "XTZ", name: "Tezos" },
  { symbol: "EOS", name: "EOS" },
  { symbol: "MKR", name: "Maker" },
  { symbol: "NEO", name: "NEO" },
  { symbol: "ZEC", name: "Zcash" },
  { symbol: "DASH", name: "Dash" },
  { symbol: "BAT", name: "Basic Attention Token" },
  { symbol: "ENJ", name: "Enjin Coin" },
  { symbol: "COMP", name: "Compound" },
  { symbol: "HBAR", name: "Hedera" },
  { symbol: "HOT", name: "Holo" },
  { symbol: "ZIL", name: "Zilliqa" },
  { symbol: "CAKE", name: "PancakeSwap" },
  { symbol: "FLOW", name: "Flow" },
  { symbol: "ONE", name: "Harmony" },
  { symbol: "CHZ", name: "Chiliz" },
  { symbol: "WAVES", name: "Waves" },
  { symbol: "STX", name: "Stacks" },
  { symbol: "AR", name: "Arweave" },
  { symbol: "KAVA", name: "Kava" },
  { symbol: "SC", name: "Siacoin" },
  { symbol: "XMR", name: "Monero" },
  { symbol: "ICX", name: "ICON" },
  { symbol: "ZRX", name: "0x" },
  { symbol: "YFI", name: "yearn.finance" },
  { symbol: "RVN", name: "Ravencoin" },
];

// Common forex pairs
const forexSymbols = [
  { symbol: "EUR/USD", name: "Euro / US Dollar" },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen" },
  { symbol: "GBP/USD", name: "British Pound / US Dollar" },
  { symbol: "USD/CHF", name: "US Dollar / Swiss Franc" },
  { symbol: "AUD/USD", name: "Australian Dollar / US Dollar" },
  { symbol: "USD/CAD", name: "US Dollar / Canadian Dollar" },
  { symbol: "NZD/USD", name: "New Zealand Dollar / US Dollar" },
  { symbol: "EUR/GBP", name: "Euro / British Pound" },
  { symbol: "EUR/JPY", name: "Euro / Japanese Yen" },
  { symbol: "GBP/JPY", name: "British Pound / Japanese Yen" },
  { symbol: "AUD/JPY", name: "Australian Dollar / Japanese Yen" },
  { symbol: "EUR/AUD", name: "Euro / Australian Dollar" },
  { symbol: "USD/HKD", name: "US Dollar / Hong Kong Dollar" },
  { symbol: "USD/SGD", name: "US Dollar / Singapore Dollar" },
  { symbol: "USD/INR", name: "US Dollar / Indian Rupee" },
  { symbol: "USD/MXN", name: "US Dollar / Mexican Peso" },
  { symbol: "USD/ZAR", name: "US Dollar / South African Rand" },
  { symbol: "USD/TRY", name: "US Dollar / Turkish Lira" },
  { symbol: "USD/BRL", name: "US Dollar / Brazilian Real" },
  { symbol: "USD/CNH", name: "US Dollar / Chinese Yuan Offshore" },
  { symbol: "USD/RUB", name: "US Dollar / Russian Ruble" },
  { symbol: "USD/PLN", name: "US Dollar / Polish Zloty" },
  { symbol: "USD/THB", name: "US Dollar / Thai Baht" },
  { symbol: "USD/SEK", name: "US Dollar / Swedish Krona" },
  { symbol: "USD/NOK", name: "US Dollar / Norwegian Krone" },
  { symbol: "USD/DKK", name: "US Dollar / Danish Krone" },
  { symbol: "USD/CZK", name: "US Dollar / Czech Koruna" },
  { symbol: "USD/HUF", name: "US Dollar / Hungarian Forint" },
  { symbol: "USD/ILS", name: "US Dollar / Israeli Shekel" },
  { symbol: "USD/KRW", name: "US Dollar / South Korean Won" },
  { symbol: "USD/ARS", name: "US Dollar / Argentine Peso" },
  { symbol: "USD/CLP", name: "US Dollar / Chilean Peso" },
  { symbol: "USD/COP", name: "US Dollar / Colombian Peso" },
  { symbol: "USD/IDR", name: "US Dollar / Indonesian Rupiah" },
  { symbol: "USD/KWD", name: "US Dollar / Kuwaiti Dinar" },
  { symbol: "USD/MYR", name: "US Dollar / Malaysian Ringgit" },
  { symbol: "USD/PHP", name: "US Dollar / Philippine Peso" },
  { symbol: "USD/SAR", name: "US Dollar / Saudi Riyal" },
  { symbol: "USD/TWD", name: "US Dollar / Taiwan Dollar" },
  { symbol: "USD/AED", name: "US Dollar / UAE Dirham" },
  { symbol: "AUD/CAD", name: "Australian Dollar / Canadian Dollar" },
  { symbol: "AUD/CHF", name: "Australian Dollar / Swiss Franc" },
  { symbol: "AUD/NZD", name: "Australian Dollar / New Zealand Dollar" },
  { symbol: "CAD/CHF", name: "Canadian Dollar / Swiss Franc" },
  { symbol: "CAD/JPY", name: "Canadian Dollar / Japanese Yen" },
  { symbol: "CHF/JPY", name: "Swiss Franc / Japanese Yen" },
  { symbol: "EUR/CAD", name: "Euro / Canadian Dollar" },
  { symbol: "EUR/CHF", name: "Euro / Swiss Franc" },
  { symbol: "EUR/NZD", name: "Euro / New Zealand Dollar" },
  { symbol: "GBP/AUD", name: "British Pound / Australian Dollar" },
];

// Common mutual fund names
const fundSymbols = [
  { symbol: "VFIAX", name: "Vanguard 500 Index Fund" },
  { symbol: "FXAIX", name: "Fidelity 500 Index Fund" },
  { symbol: "VTSAX", name: "Vanguard Total Stock Market Index Fund" },
  { symbol: "FSKAX", name: "Fidelity Total Market Index Fund" },
  { symbol: "VBTLX", name: "Vanguard Total Bond Market Index Fund" },
  { symbol: "FTBFX", name: "Fidelity Total Bond Fund" },
  { symbol: "VTIAX", name: "Vanguard Total International Stock Index Fund" },
  { symbol: "FTIHX", name: "Fidelity Total International Index Fund" },
  { symbol: "VGSLX", name: "Vanguard Real Estate Index Fund" },
  { symbol: "FREL", name: "Fidelity Real Estate Index Fund" },
  { symbol: "VWIGX", name: "Vanguard International Growth Fund" },
  { symbol: "FIGFX", name: "Fidelity International Growth Fund" },
  { symbol: "VTSMX", name: "Vanguard Total Stock Market Index Fund" },
  { symbol: "VFINX", name: "Vanguard 500 Index Fund" },
  { symbol: "VDIGX", name: "Vanguard Dividend Growth Fund" },
  { symbol: "FDGFX", name: "Fidelity Dividend Growth Fund" },
  { symbol: "VGHCX", name: "Vanguard Health Care Fund" },
  { symbol: "FSPHX", name: "Fidelity Select Health Care Portfolio" },
  { symbol: "VITPX", name: "Vanguard Information Technology Index Fund" },
  { symbol: "FSPTX", name: "Fidelity Select Technology Portfolio" },
  { symbol: "PRGFX", name: "T. Rowe Price Growth Stock Fund" },
  { symbol: "AGTHX", name: "American Funds The Growth Fund of America" },
  { symbol: "AIVSX", name: "American Funds Investment Company of America" },
  { symbol: "FCNTX", name: "Fidelity Contrafund" },
  { symbol: "DODGX", name: "Dodge & Cox Stock Fund" },
  { symbol: "VWELX", name: "Vanguard Wellington Fund" },
  { symbol: "ABALX", name: "American Funds American Balanced Fund" },
  { symbol: "VWINX", name: "Vanguard Wellesley Income Fund" },
  { symbol: "SWPPX", name: "Schwab S&P 500 Index Fund" },
  { symbol: "SWTSX", name: "Schwab Total Stock Market Index Fund" },
  { symbol: "SWAGX", name: "Schwab U.S. Aggregate Bond Index Fund" },
  { symbol: "SWISX", name: "Schwab International Index Fund" },
  { symbol: "VGENX", name: "Vanguard Energy Fund" },
  { symbol: "FSENX", name: "Fidelity Select Energy Portfolio" },
  { symbol: "VFAIX", name: "Vanguard FTSE Social Index Fund" },
  { symbol: "FBIOX", name: "Fidelity Select Biotechnology Portfolio" },
  { symbol: "FBGRX", name: "Fidelity Blue Chip Growth Fund" },
  { symbol: "FDGRX", name: "Fidelity Growth Company Fund" },
  { symbol: "VHCOX", name: "Vanguard High Dividend Yield Index Fund" },
  { symbol: "VMVFX", name: "Vanguard Mid-Cap Value Index Fund" },
  { symbol: "VIMAX", name: "Vanguard Mid-Cap Index Fund" },
  { symbol: "VSMAX", name: "Vanguard Small-Cap Index Fund" },
  { symbol: "VSIAX", name: "Vanguard Small-Cap Value Index Fund" },
  { symbol: "VSGAX", name: "Vanguard Small-Cap Growth Index Fund" },
  { symbol: "VMGMX", name: "Vanguard Mid-Cap Growth Index Fund" },
  { symbol: "VIGAX", name: "Vanguard Growth Index Fund" },
  { symbol: "VEMAX", name: "Vanguard Emerging Markets Stock Index Fund" },
  { symbol: "VEUSX", name: "Vanguard European Stock Index Fund" },
  { symbol: "VPACX", name: "Vanguard Pacific Stock Index Fund" },
  { symbol: "VGWAX", name: "Vanguard Global Wellington Fund" },
];

// Helper to generate a random number within a range
const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Helper to generate a random integer within a range
const randomInt = (min: number, max: number) => {
  return Math.floor(random(min, max));
};

// Generate a mock user profile for development/demo purposes
export const generateMockUser = (email: string, name: string): any => {
  const userId = `user-${Math.random().toString(36).substring(2, 9)}`;
  return {
    id: userId,
    email,
    name,
    balance: 10000, // Default starting balance
    createdAt: new Date().toISOString()
  };
};

// Helper to generate a random price with trend bias
const generatePrice = (basePrice: number, volatility: number = 0.05) => {
  const change = basePrice * random(-volatility, volatility);
  const newPrice = basePrice + change;
  
  return {
    current: parseFloat(newPrice.toFixed(2)),
    previous: basePrice,
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat((change / basePrice * 100).toFixed(2))
  };
};

// Helper to generate asset with random price
const generateAsset = (symbol: string, name: string, type: "STOCK" | "CRYPTO" | "FOREX" | "FUND", basePrice?: number): Asset => {
  // Generate appropriate base prices based on asset type
  let price: number;
  let volume: number;
  
  switch (type) {
    case "STOCK":
      price = basePrice || random(10, 1000);
      volume = randomInt(100000, 10000000);
      break;
    case "CRYPTO":
      if (symbol === "BTC") {
        price = basePrice || random(30000, 60000);
      } else if (symbol === "ETH") {
        price = basePrice || random(1500, 3500);
      } else {
        price = basePrice || random(0.01, 200);
      }
      volume = randomInt(1000000, 10000000000);
      break;
    case "FOREX":
      price = basePrice || random(0.5, 2);
      if (symbol.includes("JPY")) price *= 100;
      volume = randomInt(10000000, 100000000000);
      break;
    case "FUND":
      price = basePrice || random(10, 500);
      volume = randomInt(10000, 1000000);
      break;
  }
  
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
    symbol,
    name,
    type,
    price: generatePrice(price),
    volume
  };
};

// Generate mock market data
export const generateMockMarketData = (count: number = 10): MarketData => {
  const stocks = stockSymbols.slice(0, count).map(({ symbol, name }) => 
    generateAsset(symbol, name, "STOCK")
  );
  
  const crypto = cryptoSymbols.slice(0, count).map(({ symbol, name }) => 
    generateAsset(symbol, name, "CRYPTO")
  );
  
  const forex = forexSymbols.slice(0, count).map(({ symbol, name }) => 
    generateAsset(symbol, name, "FOREX")
  );
  
  const funds = fundSymbols.slice(0, count).map(({ symbol, name }) => 
    generateAsset(symbol, name, "FUND")
  );
  
  return { stocks, crypto, forex, funds };
};

// Generate mock transactions
export const generateMockTransactions = (userId: string, count: number = 5): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  const types: ("DEPOSIT" | "WITHDRAWAL" | "TRADE")[] = ["DEPOSIT", "WITHDRAWAL", "TRADE"];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = Math.floor(random(100, 5000));
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    transactions.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${i}`,
      userId,
      type,
      amount,
      status: "COMPLETED",
      description: `${type} transaction`,
      createdAt: date.toISOString()
    });
  }
  
  return transactions;
};

// Generate mock portfolio
export const generateMockPortfolio = (userId: string, count: number = 5): TradePosition[] => {
  const positions: TradePosition[] = [];
  const marketData = generateMockMarketData();
  const allAssets = [
    ...marketData.stocks,
    ...marketData.crypto,
    ...marketData.forex,
    ...marketData.funds
  ];
  
  // Select random assets for the portfolio
  const selectedAssets = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allAssets.length);
    selectedAssets.push(allAssets[randomIndex]);
  }
  
  // Create portfolio positions
  for (const asset of selectedAssets) {
    const quantity = parseFloat(random(1, 100).toFixed(asset.type === "CRYPTO" ? 4 : 2));
    const entryPrice = asset.price.current * (1 - random(-0.2, 0.2));
    const currentPrice = asset.price.current;
    const profitLoss = (currentPrice - entryPrice) * quantity;
    const profitLossPercent = (currentPrice - entryPrice) / entryPrice * 100;
    
    positions.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      userId,
      assetId: asset.id,
      assetSymbol: asset.symbol,
      assetName: asset.name,
      assetType: asset.type,
      quantity,
      entryPrice,
      currentPrice,
      profitLoss,
      profitLossPercent,
      createdAt: new Date().toISOString()
    });
  }
  
  return positions;
};

// Generate chart data for portfolio balance over time
export const getChartData = (days: number = 30) => {
  const data = [];
  const now = new Date();
  let value = 10000; // Starting value
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Random daily change with slight upward bias
    const change = value * random(-0.02, 0.025);
    value += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2))
    });
  }
  
  return data;
};

// Generate historical candlestick data for an asset
export const generateHistoricalData = (assetId: string, assetType: string, days: number = 30): AssetHistoricalData[] => {
  const data: AssetHistoricalData[] = [];
  const now = new Date();
  
  // Set base price based on asset type
  let basePrice: number;
  let volatility: number;
  
  switch (assetType) {
    case "CRYPTO":
      basePrice = random(100, 2000);
      volatility = 0.05; // Higher volatility for crypto
      break;
    case "FOREX":
      basePrice = random(0.5, 2);
      volatility = 0.01; // Lower volatility for forex
      break;
    case "FUND":
      basePrice = random(50, 200);
      volatility = 0.015; // Medium-low volatility for funds
      break;
    case "STOCK":
    default:
      basePrice = random(50, 500);
      volatility = 0.02; // Medium volatility for stocks
  }
  
  // Add slight trend bias (50% up trend, 30% down trend, 20% sideways)
  const trendBias = Math.random();
  let trend = 0;
  
  if (trendBias < 0.5) {
    trend = 0.002; // Uptrend
  } else if (trendBias < 0.8) {
    trend = -0.002; // Downtrend
  }
  
  // Generate data for each day
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Apply trend and random movement
    basePrice = basePrice * (1 + trend + random(-volatility, volatility));
    
    const open = basePrice;
    const close = basePrice * (1 + random(-volatility, volatility));
    const high = Math.max(open, close) * (1 + random(0, volatility));
    const low = Math.min(open, close) * (1 - random(0, volatility));
    const volume = randomInt(100000, 10000000);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    });
  }
  
  return data;
};
