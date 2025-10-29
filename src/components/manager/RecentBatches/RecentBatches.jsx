import React, { useState, useMemo, useEffect } from "react";
import { CheckCircle, Clock, XCircle, MoreVertical, Package } from "lucide-react";

export default function RecentBatches({ batches }) {
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  // Process batches to show only the newest token from each collection with second file data
  const processedBatches = useMemo(() => {
    if (!batches || batches.length === 0) return [];

    const collections = {};
    
    batches.forEach(batch => {
      // Skip batches without token data, collection, or second file data
      if (!batch.token || !batch.token.collection || !batch.secondFileData) return;
      
      const collectionKey = batch.token.collection.address || batch.token.collection.name;
      if (!collectionKey) return;

      // If collection doesn't exist or this token is newer, update the collection
      if (!collections[collectionKey] || 
          new Date(batch.token.createdAt) > new Date(collections[collectionKey].token.createdAt)) {
        collections[collectionKey] = {
          ...batch,
          // Use second file data for display
          name: batch.secondFileData.name || batch.name,
          product: batch.secondFileData.product || batch.product,
          quantity: batch.secondFileData.quantity || batch.quantity,
          status: batch.secondFileData.status || batch.status,
          startDate: batch.secondFileData.startDate || batch.startDate
        };
      }
    });

    // Convert to array and sort by creation date (newest first)
    return Object.values(collections)
      .sort((a, b) => new Date(b.token.createdAt) - new Date(a.token.createdAt));
  }, [batches]);

  // Close details if selected batch is no longer in the filtered list
  useEffect(() => {
    if (selectedBatchId) {
      const batchStillExists = processedBatches.some(batch => batch.id === selectedBatchId);
      if (!batchStillExists) {
        setSelectedBatchId(null);
      }
    }
  }, [processedBatches, selectedBatchId]);

  const handleBatchClick = (batchId) => {
    // Toggle: if clicking the same batch, close it
    if (selectedBatchId === batchId) {
      setSelectedBatchId(null);
    } else {
      setSelectedBatchId(batchId);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "processing":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "processing":
        return "bg-yellow-50 border-yellow-200";
      case "failed":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const selectedBatch = processedBatches.find(batch => batch.id === selectedBatchId);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Batches</h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing batch data from newest tokens
            {batches.length > 0 && (
              <span className="text-gray-400">
                {" "}({processedBatches.length} collections)
              </span>
            )}
          </p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {processedBatches.length > 0 ? (
          processedBatches.map((batch) => (
            <div
              key={batch.id}
              onClick={() => handleBatchClick(batch.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                getStatusColor(batch.status)
              } ${
                selectedBatchId === batch.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(batch.status)}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {batch.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="truncate">{batch.product}</span>
                      <span>•</span>
                      <span>{batch.quantity}</span>
                    </div>
                    {batch.token?.collection?.name && (
                      <p className="text-xs text-gray-500 mt-1">
                        Collection: {batch.token.collection.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right min-w-0 flex-shrink-0">
                  <p className="text-sm font-medium text-gray-900">
                    {batch.startDate}
                  </p>
                  <p className={`text-xs font-medium ${
                    batch.status === "completed" ? "text-green-600" :
                    batch.status === "processing" ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {batch.status?.charAt(0).toUpperCase() + batch.status?.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {batches.length === 0 
                ? "No batches found" 
                : "No valid batch data available"
              }
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {batches.length === 0
                ? "Process some NFTs to see batches here"
                : "All tokens are missing collection or batch data"
              }
            </p>
          </div>
        )}
      </div>

      {selectedBatch && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Batch Details</h3>
            <button 
              onClick={() => setSelectedBatchId(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* Batch Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 border-b pb-1">Batch Information</h4>
              <div>
                <span className="text-gray-600">Name:</span>
                <p className="font-medium">{selectedBatch.name}</p>
              </div>
              <div>
                <span className="text-gray-600">Product:</span>
                <p className="font-medium">{selectedBatch.product}</p>
              </div>
              <div>
                <span className="text-gray-600">Quantity:</span>
                <p className="font-medium">{selectedBatch.quantity}</p>
              </div>
            </div>

            {/* Status Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 border-b pb-1">Status Information</h4>
              <div>
                <span className="text-gray-600">Status:</span>
                <p className={`font-medium ${
                  selectedBatch.status === "completed" ? "text-green-600" :
                  selectedBatch.status === "processing" ? "text-yellow-600" : "text-red-600"
                }`}>
                  {selectedBatch.status?.charAt(0).toUpperCase() + selectedBatch.status?.slice(1)}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Start Date:</span>
                <p className="font-medium">{selectedBatch.startDate}</p>
              </div>
              {selectedBatch.token?.createdAt && (
                <div>
                  <span className="text-gray-600">Token Created:</span>
                  <p className="font-medium">{formatDate(selectedBatch.token.createdAt)}</p>
                </div>
              )}
            </div>

            {/* Collection Information */}
            {selectedBatch.token?.collection && (
              <div className="md:col-span-2 space-y-3 pt-3 border-t">
                <h4 className="font-medium text-gray-700">Collection Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Collection Name:</span>
                    <p className="font-medium">{selectedBatch.token.collection.name}</p>
                  </div>
                  {selectedBatch.token.collection.address && (
                    <div>
                      <span className="text-gray-600">Collection Address:</span>
                      <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded mt-1">
                        {selectedBatch.token.collection.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Token Information */}
            {selectedBatch.token && (
              <div className="md:col-span-2 space-y-3 pt-3 border-t">
                <h4 className="font-medium text-gray-700">Token Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Token Name:</span>
                    <p className="font-medium">{selectedBatch.token.name || "Unnamed"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Mint Address:</span>
                    <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded mt-1">
                      {selectedBatch.token.mint}
                    </p>
                  </div>
                </div>
                {selectedBatch.token.uri && (
                  <div>
                    <span className="text-gray-600">Metadata URI:</span>
                    <p className="text-xs break-all bg-gray-100 p-2 rounded mt-1">
                      {selectedBatch.token.uri}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}