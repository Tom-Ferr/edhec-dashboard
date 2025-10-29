import React, { useState, useMemo } from "react";
import { Factory, Truck, Beaker, FlaskRound, Focus, Calendar, Search } from "lucide-react";

export default function ProductionTimeline({ searchTerm = "", statusFilter = "all", tokens = [] }) {
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [productsPerSquare, setProductsPerSquare] = useState(100);

  // Define stations array
  const stations = ["Farm", "Docker", "Mixing", "Labs"];

  // Process tokens into batches grouped by collection - ONLY VALID COLLECTIONS
  const batches = useMemo(() => {
    if (!tokens || tokens.length === 0) return [];

    // Filter tokens to only include those with valid collections
    const tokensWithValidCollections = tokens.filter(token => 
      token.collection && 
      (token.collection.address || token.collection.name) &&
      token.collection.address !== null && 
      token.collection.name !== null
    );

    console.log(`🎯 Filtered tokens: ${tokensWithValidCollections.length} with valid collections out of ${tokens.length} total tokens`);

    if (tokensWithValidCollections.length === 0) return [];

    // Group tokens by collection
    const collections = {};
    
    tokensWithValidCollections.forEach(token => {
      const collectionKey = token.collection.address || token.collection.name;
      
      if (!collections[collectionKey]) {
        collections[collectionKey] = {
          id: collectionKey,
          product: token.collection.name || `Collection ${collectionKey.slice(0, 8)}`,
          status: "processing",
          tokens: []
        };
      }
      
      collections[collectionKey].tokens.push(token);
    });

    // Sort tokens within each collection by creation date (oldest first)
    Object.values(collections).forEach(collection => {
      collection.tokens.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    // Convert collections to batch format
    return Object.values(collections).map(collection => {
      const tokenCount = collection.tokens.length;
      
      // Calculate progress based on token count (simulate production progress)
      const farmCompleted = Math.min(tokenCount, 9);
      const dockerCompleted = Math.max(0, Math.min(tokenCount - 9, 5));
      const mixingCompleted = Math.max(0, Math.min(tokenCount - 14, 8));
      const labsCompleted = Math.max(0, Math.min(tokenCount - 22, 7));

      const isCompleted = tokenCount >= 29; // Total of all stations: 9+5+8+7=29

      return {
        id: collection.id.length > 8 ? collection.id.slice(0, 8) + '...' : collection.id,
        product: collection.product,
        status: isCompleted ? "completed" : "processing",
        tokens: collection.tokens,
        lines: [
          {
            stations: {
              "Farm": { 
                completed: farmCompleted, 
                total: 9, 
                status: farmCompleted === 9 ? "completed" : "processing", 
                data: collection.tokens.slice(0, farmCompleted) 
              },
              "Docker": { 
                completed: dockerCompleted, 
                total: 5, 
                status: dockerCompleted === 5 ? "completed" : dockerCompleted > 0 ? "processing" : "pending", 
                data: collection.tokens.slice(9, 9 + dockerCompleted) 
              },
              "Mixing": { 
                completed: mixingCompleted, 
                total: 8, 
                status: mixingCompleted === 8 ? "completed" : mixingCompleted > 0 ? "processing" : "pending", 
                data: collection.tokens.slice(14, 14 + mixingCompleted) 
              },
              "Labs": { 
                completed: labsCompleted, 
                total: 7, 
                status: labsCompleted === 7 ? "completed" : labsCompleted > 0 ? "processing" : "pending", 
                data: collection.tokens.slice(22, 22 + labsCompleted) 
              }
            }
          }
        ]
      };
    });
  }, [tokens]);

  // Filter batches based on search term and status filter from props
  const filteredBatches = useMemo(() => {
    return batches.filter(batch => {
      const matchesSearch = 
        batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.product.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" || 
        batch.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [batches, searchTerm, statusFilter]);

  // Sample data for focus view
  const stationData = {
    "Farm": {
      name: "Farm Providers",
      icon: Truck,
      status: "Active",
      efficiency: "94%",
      currentBatch: "MK_17",
      temperature: "4°C",
      humidity: "65%",
      lastUpdate: "2 minutes ago",
      aiAnalysis: "Farm supply chain operating at optimal efficiency. Milk quality metrics are excellent with 99.2% purity rating."
    },
    "Docker": {
      name: "Docker Station",
      icon: Factory,
      status: "Ready",
      efficiency: "88%",
      currentBatch: "None",
      containerCount: "45",
      waitTime: "15min",
      lastUpdate: "5 minutes ago",
      aiAnalysis: "Docker station awaiting next batch. System calibrated and ready for MK_17 arrival. Estimated processing time: 2.3 hours."
    },
    "Mixing": {
      name: "Mixing Room",
      icon: Beaker,
      status: "Standby",
      efficiency: "92%",
      currentBatch: "MK_15",
      mixQuality: "98.7%",
      temperature: "18°C",
      lastUpdate: "10 minutes ago",
      aiAnalysis: "Mixing room maintaining consistent quality. Recent batches show improved homogenization with 2.1% better consistency."
    },
    "Labs": {
      name: "Quality Labs",
      icon: FlaskRound,
      status: "Testing",
      efficiency: "96%",
      currentBatch: "MK_16",
      testsCompleted: "8/12",
      qualityScore: "99.1%",
      lastUpdate: "Just now",
      aiAnalysis: "Lab analysis shows exceptional product quality. All safety parameters within optimal range. Ready for final approval."
    }
  };

  const handleSquareClick = (batchId, lineIndex, stationName, squareIndex) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;
    
    const stationProgress = batch.lines[lineIndex].stations[stationName];
    const isCompleted = squareIndex < stationProgress.completed;
    
    if (isCompleted && stationProgress.data[squareIndex]) {
      const token = stationProgress.data[squareIndex];
      setSelectedStation(stationName);
      setSelectedSquare({
        batchId,
        lineIndex,
        stationName,
        squareIndex,
        token,
        data: generateSquareData(token, stationName, squareIndex)
      });
    }
  };

  const handleStationClick = (stationName) => {
    setSelectedStation(stationName);
    setSelectedSquare(null);
  };

  const generateSquareData = (token, stationName, squareIndex) => {
    const baseData = [
      { parameter: "Token Name", value: token.name || "Unnamed", status: "info" },
      { parameter: "Mint Address", value: `${token.mint.slice(0, 4)}...${token.mint.slice(-4)}`, status: "info" },
      { parameter: "Created", value: new Date(token.createdAt).toLocaleDateString(), status: "info" }
    ];

    const stationSpecificData = {
      "Farm": [
        { parameter: "Milk Quality", value: "99.2%", status: "excellent" },
        { parameter: "Temperature", value: "4.1°C", status: "optimal" },
        { parameter: "Volume", value: `${(squareIndex + 1) * 100}L`, status: "normal" }
      ],
      "Docker": [
        { parameter: "Processing Time", value: "2.3h", status: "normal" },
        { parameter: "Container ID", value: `CTR-${squareIndex + 1}`, status: "info" },
        { parameter: "Status", value: "Ready", status: "ready" }
      ],
      "Mixing": [
        { parameter: "Mix Consistency", value: "98.7%", status: "excellent" },
        { parameter: "Temperature", value: "18.2°C", status: "optimal" },
        { parameter: "Batch Size", value: `${(squareIndex + 1) * 50}L`, status: "normal" }
      ],
      "Labs": [
        { parameter: "Quality Score", value: "99.1%", status: "excellent" },
        { parameter: "Tests Passed", value: `${squareIndex + 8}/12`, status: "good" },
        { parameter: "Safety Level", value: "A+", status: "excellent" }
      ]
    };

    return [...baseData, ...(stationSpecificData[stationName] || [])];
  };

  const getSquareColor = (stationName, squareIndex, completed, status) => {
    if (squareIndex < completed) {
      switch (status) {
        case "completed": return "bg-green-500 border-green-600";
        case "processing": return "bg-blue-500 border-blue-600";
        case "error": return "bg-red-500 border-red-600";
        case "warning": return "bg-yellow-500 border-yellow-600";
        default: return "bg-green-500 border-green-600";
      }
    }
    return "bg-gray-200 border-gray-300";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-100";
      case "optimal": return "text-blue-600 bg-blue-100";
      case "normal": return "text-gray-600 bg-gray-100";
      case "good": return "text-green-600 bg-green-100";
      case "ready": return "text-yellow-600 bg-yellow-100";
      case "info": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getBatchStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate statistics for display
  const tokensWithValidCollections = tokens.filter(token => 
    token.collection && 
    (token.collection.address || token.collection.name) &&
    token.collection.address !== null && 
    token.collection.name !== null
  );

  const tokensWithoutCollections = tokens.length - tokensWithValidCollections.length;

  return (
    <div className="space-y-4">
      {/* Header for Production Timeline */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Production Timeline</h2>
            <p className="text-xs text-gray-600">
              Real-time tracking of NFT collections through factory stations
              {tokens.length > 0 && (
                <span>
                  {" "}• {tokensWithValidCollections.length} tokens with collections 
                  {tokensWithoutCollections > 0 && (
                    <span className="text-orange-600">
                      {" "}({tokensWithoutCollections} without collections)
                    </span>
                  )}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-xs text-gray-600">
            <span className="font-medium">Products per square:</span>
            <select 
              value={productsPerSquare}
              onChange={(e) => setProductsPerSquare(parseInt(e.target.value))}
              className="ml-1 border border-gray-300 rounded px-2 py-1 text-xs"
            >
              <option value={1}>1</option>
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Focus Block - ON THE LEFT */}
        <div className="xl:col-span-1 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Focus className="w-4 h-4 text-purple-600" />
            <h2 className="text-base font-semibold text-gray-900">Focus</h2>
            {selectedStation && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                {selectedStation}
              </span>
            )}
          </div>

          {selectedStation ? (
            <div className="space-y-3">
              {/* Station Header */}
              <div className="flex items-center space-x-2">
                {(() => {
                  const Icon = stationData[selectedStation]?.icon || Factory;
                  return <Icon className="w-6 h-6 text-blue-600" />;
                })()}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {stationData[selectedStation]?.name || selectedStation}
                  </h3>
                  <p className="text-xs text-gray-600">
                    Status: <span className={`font-medium ${
                      stationData[selectedStation]?.status === 'Active' ? 'text-green-600' :
                      stationData[selectedStation]?.status === 'Ready' ? 'text-blue-600' :
                      stationData[selectedStation]?.status === 'Testing' ? 'text-purple-600' :
                      'text-yellow-600'
                    }`}>
                      {stationData[selectedStation]?.status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Efficiency Badge */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded border">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {stationData[selectedStation]?.efficiency}
                  </div>
                  <div className="text-xs text-gray-600">Efficiency</div>
                </div>
              </div>

              {/* Token-specific Data */}
              {selectedSquare && selectedSquare.token && (
                <div className="border-t pt-3">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                    {selectedSquare.token.name || `Token #${selectedSquare.squareIndex + 1}`}
                  </h4>
                  <div className="space-y-2">
                    <div className="p-2 bg-gray-50 rounded text-xs">
                      <div className="text-gray-600">Mint Address</div>
                      <div className="font-mono text-gray-900 truncate">
                        {selectedSquare.token.mint}
                      </div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-xs">
                      <div className="text-gray-600">Collection</div>
                      <div className="font-semibold text-gray-900">
                        {selectedSquare.token.collection?.name || "No Collection"}
                      </div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-xs">
                      <div className="text-gray-600">Created</div>
                      <div className="font-semibold text-gray-900">
                        {new Date(selectedSquare.token.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Station-specific parameters */}
                  <div className="mt-3 space-y-1">
                    {selectedSquare.data.map((item, index) => (
                      <div key={index} className={`p-2 rounded text-xs ${getStatusColor(item.status)}`}>
                        <div className="font-medium truncate">{item.parameter}</div>
                        <div className="font-semibold">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Station Data Grid (when no token selected) */}
              {!selectedSquare && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-50 rounded text-xs">
                    <div className="text-gray-600">Current Batch</div>
                    <div className="font-semibold text-gray-900 truncate">{stationData[selectedStation]?.currentBatch}</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-xs">
                    <div className="text-gray-600">Temperature</div>
                    <div className="font-semibold text-gray-900">{stationData[selectedStation]?.temperature}</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-xs">
                    <div className="text-gray-600">Last Update</div>
                    <div className="font-semibold text-gray-900 truncate">{stationData[selectedStation]?.lastUpdate}</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-xs">
                    <div className="text-gray-600">Quality</div>
                    <div className="font-semibold text-green-600 truncate">{stationData[selectedStation]?.qualityScore || stationData[selectedStation]?.mixQuality || "N/A"}</div>
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              <div className="border-t pt-3">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">AI Analysis</h4>
                <p className="text-gray-700 text-xs leading-relaxed bg-blue-50 p-2 rounded">
                  {selectedSquare && selectedSquare.token 
                    ? `Token "${selectedSquare.token.name}" is part of collection "${selectedSquare.token.collection?.name || 'Unknown'}". Created on ${new Date(selectedSquare.token.createdAt).toLocaleDateString()}.`
                    : stationData[selectedStation]?.aiAnalysis
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Factory className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-xs">Click on a station or completed square to view details</p>
              {tokens.length === 0 && (
                <p className="text-xs text-gray-400 mt-2">No tokens available</p>
              )}
              {tokens.length > 0 && batches.length === 0 && (
                <p className="text-xs text-orange-600 mt-2">
                  No tokens with valid collections found ({tokensWithoutCollections} tokens without collections)
                </p>
              )}
            </div>
          )}
        </div>

        {/* Timeline Block - Main Content on the RIGHT */}
        <div className="xl:col-span-3 bg-white rounded-lg border border-gray-200 p-4">
          {/* Compact Timeline Header */}
          <div className="flex items-center mb-3 text-xs text-gray-600 font-medium">
            <div className="w-20 flex-shrink-0">
              <span className="truncate">Factory</span>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-2">
              {stations.map((station) => (
                <div 
                  key={station}
                  onClick={() => handleStationClick(station)}
                  className={`text-center py-1 rounded cursor-pointer transition-colors truncate ${
                    selectedStation === station 
                      ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                      : 'hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  {station}
                </div>
              ))}
            </div>
            <div className="w-16 flex-shrink-0 text-right">
              <span>Collection</span>
            </div>
          </div>

          {/* Timeline Lines */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredBatches.length > 0 ? (
              filteredBatches.map((batch) => (
                <div key={batch.id} className="space-y-1">
                  {batch.lines.map((line, lineIndex) => (
                    <div key={lineIndex} className="flex items-center min-h-[40px]">
                      {/* Collection ID on left */}
                      <div className="w-20 flex-shrink-0">
                        {lineIndex === 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <span className="text-xs font-medium text-gray-900 truncate" title={batch.id}>
                                {batch.id}
                              </span>
                              <span className={`px-1 py-0.5 rounded-full text-xs font-medium ${getBatchStatusColor(batch.status)}`}>
                                {batch.status.charAt(0)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 truncate" title={batch.product}>
                              {batch.product}
                            </div>
                            <div className="text-xs text-gray-400">
                              {batch.tokens.length} tokens
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Stations Grid */}
                      <div className="flex-1 grid grid-cols-4 gap-2">
                        {stations.map((station) => {
                          const stationProgress = line.stations[station];
                          return (
                            <div 
                              key={station}
                              className="flex justify-center items-center space-x-0.5 min-h-[32px]"
                            >
                              {Array.from({ length: stationProgress.total }).map((_, squareIndex) => {
                                const isCompleted = squareIndex < stationProgress.completed;
                                const isSelected = selectedSquare && 
                                  selectedSquare.batchId === batch.id && 
                                  selectedSquare.lineIndex === lineIndex &&
                                  selectedSquare.stationName === station &&
                                  selectedSquare.squareIndex === squareIndex;

                                return (
                                  <div
                                    key={squareIndex}
                                    onClick={() => handleSquareClick(batch.id, lineIndex, station, squareIndex)}
                                    className={`w-3 h-3 border rounded cursor-pointer transition-all flex-shrink-0 ${
                                      getSquareColor(station, squareIndex, stationProgress.completed, stationProgress.status)
                                    } ${
                                      isSelected ? 'ring-1 ring-purple-500' : ''
                                    } ${
                                      isCompleted ? 'hover:scale-110' : 'cursor-default'
                                    }`}
                                    title={
                                      isCompleted 
                                        ? `Token: ${stationProgress.data[squareIndex]?.name || 'Unknown'}\n${station} - ${squareIndex + 1}/${stationProgress.total}`
                                        : `${station} - ${squareIndex + 1}/${stationProgress.total} (Pending)`
                                    }
                                  />
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Collection ID on right */}
                      <div className="w-16 flex-shrink-0 text-right">
                        <span className="text-xs font-medium text-gray-900 truncate" title={batch.id}>
                          {batch.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-xs">
                  {tokens.length === 0 
                    ? "No tokens found in wallet" 
                    : batches.length === 0
                    ? "No tokens with valid collections found"
                    : "No collections found matching your search criteria"
                  }
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {tokens.length === 0 
                    ? "Mint some NFTs to see them in the production timeline" 
                    : batches.length === 0
                    ? `${tokensWithoutCollections} tokens found but none have valid collections`
                    : "Try different search terms or status filters"
                  }
                </p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 border border-green-600 rounded"></div>
              <span>Done</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 border border-blue-600 rounded"></div>
              <span>Working</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-200 border border-gray-300 rounded"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 ring-1 ring-purple-500 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}