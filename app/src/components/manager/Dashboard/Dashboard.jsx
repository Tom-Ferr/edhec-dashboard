import React, { useState, useEffect } from "react";
import RecentBatches from "../RecentBatches/RecentBatches";
import ProductionTimeline from "../ProductionTimeLine/ProductionTimeLine";
import StatsGrid from "../StatsGrid/StatsGrid";
import MachineStatus from "../MachineStatus/MachineStatus";
import QuickActions from "../QuickActions/QuickActions";
import AlertsPanel from "../AlertsPanel/AlertsPanel";
import SearchBar from "../SearchBar/SearchBar";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const machineData = [
  { id: 1, name: "Mixer A1", status: "running", efficiency: "92%", output: "150L/h" },
  { id: 2, name: "Heater B2", status: "idle", efficiency: "88%", output: "200L/h" },
  { id: 3, name: "Cooler C3", status: "maintenance", efficiency: "95%", output: "180L/h" },
  { id: 4, name: "Packer D4", status: "running", efficiency: "90%", output: "120L/h" },
];

// Custom hook to fetch ALL tokens from wallet
const useWalletTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("🔄 Fetching ALL tokens from wallet...");
        const response = await fetch(`${API_BASE_URL}/wallet-tokens`);
        const data = await response.json();
        
        if (data.success && data.tokens) {
          console.log(`✅ Found ${data.tokens.length} tokens from wallet`);
          setTokens(data.tokens);
        } else {
          throw new Error(data.error || "Failed to fetch tokens");
        }
      } catch (err) {
        console.error("❌ Error fetching tokens:", err);
        setError(err.message);
        setTokens([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  return { tokens, loading, error };
};

// UPDATED: Custom hook to extract batch data from tokens with secondFileData
const useBatchesFromTokens = (tokens) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const extractBatches = async () => {
      if (!tokens || tokens.length === 0) {
        setBatches([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log(`🔄 Extracting batch data from ${tokens.length} tokens...`);
        const processedBatches = [];

        for (const token of tokens) {
          try {
            console.log(`🔍 Processing token: ${token.name} (${token.mint})`);
            
            if (!token.uri) {
              console.log(`❌ No URI for token: ${token.mint}`);
              continue;
            }

            // Fetch the token metadata
            console.log(`📥 Fetching metadata from: ${token.uri}`);
            const metadataResponse = await fetch(token.uri);
            
            if (!metadataResponse.ok) {
              console.log(`❌ Failed to fetch metadata for: ${token.name}`);
              continue;
            }

            const tokenMetadata = await metadataResponse.json();
            
            // Check if properties.files[1] exists (the second file with batch data)
            const secondFile = tokenMetadata?.properties?.files?.[1];
            
            if (secondFile && secondFile.uri) {
              console.log(`📦 Found second file: ${secondFile.uri}`);
              
              // Fetch the batch data from second file
              const secondFileResponse = await fetch(secondFile.uri);
              
              if (secondFileResponse.ok) {
                const batchData = await secondFileResponse.json();
                
                // UPDATED: Transform the data to include secondFileData
                const clientBatchData = {
                  id: batchData.id || token.mint,
                  name: batchData.name || `Batch ${processedBatches.length + 1}`,
                  status: batchData.status || "completed",
                  startDate: batchData.startDate || new Date(token.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  }),
                  product: batchData.product || token.name || "IceCream_NFT",
                  quantity: batchData.quantity || "500L",
                  // NEW: Include secondFileData for RecentBatches component
                  secondFileData: batchData,
                  // Keep the original token data for reference
                  token: {
                    mint: token.mint,
                    name: token.name,
                    uri: token.uri,
                    collection: token.collection,
                    createdAt: token.createdAt
                  }
                };
                
                processedBatches.push(clientBatchData);
                console.log(`✅ Successfully processed batch: ${clientBatchData.name}`);
              } else {
                console.log(`❌ Failed to fetch second file for: ${token.name}`);
              }
            } else {
              console.log(`⚠️ No second file found for: ${token.name}`);
            }
          } catch (tokenError) {
            console.error(`💥 Error processing token ${token.mint}:`, tokenError);
            // Continue with next token even if one fails
          }
        }
        
        console.log(`🎉 Successfully processed ${processedBatches.length} batches`);
        setBatches(processedBatches);
      } catch (err) {
        console.error("❌ Error extracting batches:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    extractBatches();
  }, [tokens]);

  return { batches, loading, error };
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Use the new hook to fetch ALL tokens from wallet
  const { tokens, loading: tokensLoading, error: tokensError } = useWalletTokens();
  const { batches, loading: batchesLoading, error: batchesError } = useBatchesFromTokens(tokens);

  // UPDATED: Filter logic to work with new batch structure
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.product?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Debug logs
  useEffect(() => {
    console.log("🔍 DEBUG - All Tokens:", tokens);
    console.log("🔍 DEBUG - Processed Batches:", batches);
    console.log("🔍 DEBUG - Filtered Batches:", filteredBatches);
    
    // Log batch structure for debugging
    if (batches.length > 0) {
      console.log("🔍 DEBUG - First batch structure:", {
        id: batches[0].id,
        name: batches[0].name,
        secondFileData: batches[0].secondFileData,
        token: batches[0].token
      });
    }
  }, [tokens, batches, filteredBatches]);

  const loading = tokensLoading || batchesLoading;
  const error = tokensError || batchesError;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          {/* Simple Miko Heart with Crop */}
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-pulse flex items-center justify-center">
              <span className="text-white text-lg font-bold">M</span>
            </div>
          </div>
          
          <div className="text-lg font-semibold text-red-600 font-unilever">
            {tokensLoading ? "Loading ice cream data..." : "Churning batches..."}
          </div>
          <div className="text-sm text-red-400 mt-2">
              Fresh from the Miko factory! 🍦
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--blue-main)] unilever-header-bold">
          FACTORY DASHBOARD
        </h1>
        <div className="text-sm text-[var(--blue-main)] unilever-header">
          Last updated: Just now
        </div>
      </div>
      
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalItems={batches.length}
        filteredItems={filteredBatches.length}
      />
      
      <StatsGrid />
      
      {/* ProductionTimeline receives ALL tokens directly */}
      <ProductionTimeline 
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        tokens={tokens}
      />

      <QuickActions />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <MachineStatus machines={machineData} />
          {/* UPDATED: RecentBatches now receives filteredBatches with secondFileData */}
          <RecentBatches batches={filteredBatches} />
        </div>
        <div className="space-y-6">
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
}