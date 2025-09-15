import React, { useState, useEffect } from 'react';
import { pricingData } from '../data/pricingData';
import '../ComparisonCalculator.css';

function ComparisonCalculator() {
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(500);
  const [apiCalls, setApiCalls] = useState(1);
  const [apiCallsPerMinute, setApiCallsPerMinute] = useState(10);
  const [duration, setDuration] = useState(60);
  const [useApiPerMinute, setUseApiPerMinute] = useState(false);
  const [hours, setHours] = useState(1);
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState('totalCost');
  const [filterProvider, setFilterProvider] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());

  const calculateAllCosts = () => {
    const allResults = [];

    // Calculate effective API calls and duration
    const effectiveApiCalls = useApiPerMinute ? apiCallsPerMinute * duration : apiCalls;
    const effectiveDuration = useApiPerMinute ? duration : hours * 60; // convert hours to minutes for PTU
    const effectiveHours = useApiPerMinute ? duration / 60 : hours;

    Object.entries(pricingData).forEach(([provider, providerData]) => {
      Object.entries(providerData.models).forEach(([model, modelData]) => {
        // Calculate Pay per Token pricing
        if (modelData.payPerToken) {
          let costPerCall = 0;
          let details = {};

          if (provider === "Azure OpenAI") {
            const inputCostPerCall = (inputTokens / 1000) * modelData.payPerToken.inputPer1000;
            const outputCostPerCall = (outputTokens / 1000) * modelData.payPerToken.outputPer1000;
            costPerCall = inputCostPerCall + outputCostPerCall;
            details = {
              inputCostPerCall: inputCostPerCall.toFixed(6),
              outputCostPerCall: outputCostPerCall.toFixed(6),
              inputRate: `$${modelData.payPerToken.inputPer1000}/1K`,
              outputRate: `$${modelData.payPerToken.outputPer1000}/1K`
            };
          } else {
            const totalTokens = inputTokens + outputTokens;
            const isLongContext = provider === "Google Vertex AI" &&
                                modelData.payPerToken.contextThreshold &&
                                totalTokens > modelData.payPerToken.contextThreshold;

            let inputRate, outputRate;
            if (isLongContext && modelData.payPerToken.longContextInputPer1M) {
              inputRate = modelData.payPerToken.longContextInputPer1M;
              outputRate = modelData.payPerToken.longContextOutputPer1M;
            } else {
              inputRate = modelData.payPerToken.inputPer1M;
              outputRate = modelData.payPerToken.outputPer1M;
            }

            const inputCostPerCall = (inputTokens / 1000000) * inputRate;
            const outputCostPerCall = (outputTokens / 1000000) * outputRate;
            costPerCall = inputCostPerCall + outputCostPerCall;
            details = {
              inputCostPerCall: inputCostPerCall.toFixed(6),
              outputCostPerCall: outputCostPerCall.toFixed(6),
              inputRate: `$${inputRate}/1M`,
              outputRate: `$${outputRate}/1M`,
              isLongContext
            };
          }

          const totalCost = costPerCall * effectiveApiCalls;

          allResults.push({
            id: `${provider}-${model}-token`,
            provider,
            model,
            method: 'Pay per Token',
            costPerCall: parseFloat(costPerCall.toFixed(6)),
            totalCost: parseFloat(totalCost.toFixed(4)),
            costPerCallDisplay: `$${costPerCall.toFixed(6)}`,
            totalCostDisplay: `$${totalCost.toFixed(4)}`,
            details: {
              ...details,
              totalApiCalls: effectiveApiCalls
            }
          });
        }

        // Calculate PTU pricing (Azure only)
        if (modelData.ptu) {
          const { inputTPMPerPTU, outputTokenRatio, hourlyRate } = modelData.ptu;

          // Calculate required PTUs based on token throughput
          const tokensPerMinute = useApiPerMinute
            ? apiCallsPerMinute * (inputTokens + (outputTokens * outputTokenRatio))
            : (effectiveApiCalls * (inputTokens + (outputTokens * outputTokenRatio))) / effectiveDuration;

          const requiredPTUs = Math.ceil(tokensPerMinute / inputTPMPerPTU);
          const ptuCostPerHour = requiredPTUs * hourlyRate;
          const totalCost = ptuCostPerHour * effectiveHours;

          // Cost per call calculation for PTU
          const costPerCall = totalCost / effectiveApiCalls;

          allResults.push({
            id: `${provider}-${model}-ptu`,
            provider,
            model,
            method: 'PTU',
            costPerCall: parseFloat(costPerCall.toFixed(6)),
            totalCost: parseFloat(totalCost.toFixed(4)),
            costPerCallDisplay: `$${costPerCall.toFixed(6)}`,
            totalCostDisplay: `$${totalCost.toFixed(4)}`,
            details: {
              hourlyRate: `$${hourlyRate}/hour`,
              requiredPTUs: requiredPTUs,
              tokensPerMinute: Math.round(tokensPerMinute),
              maxTPMCapacity: requiredPTUs * inputTPMPerPTU,
              utilizationPercent: ((tokensPerMinute / (requiredPTUs * inputTPMPerPTU)) * 100).toFixed(1),
              totalHours: effectiveHours,
              totalApiCalls: effectiveApiCalls,
              description: modelData.ptu.description
            }
          });
        }

        // Calculate API Call pricing
        if (modelData.apiCalls) {
          const costPerCall = modelData.apiCalls.perCall;
          const totalCost = costPerCall * effectiveApiCalls;

          allResults.push({
            id: `${provider}-${model}-api`,
            provider,
            model,
            method: 'API Calls',
            costPerCall: parseFloat(costPerCall.toFixed(6)),
            totalCost: parseFloat(totalCost.toFixed(4)),
            costPerCallDisplay: `$${costPerCall.toFixed(6)}`,
            totalCostDisplay: `$${totalCost.toFixed(4)}`,
            details: {
              perCallRate: `$${costPerCall}/call`,
              totalCalls: effectiveApiCalls,
              description: modelData.apiCalls.description
            }
          });
        }
      });
    });

    return allResults;
  };

  useEffect(() => {
    const allCosts = calculateAllCosts();
    setResults(allCosts);
  }, [inputTokens, outputTokens, apiCalls, apiCallsPerMinute, duration, useApiPerMinute, hours]);

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getFilteredAndSortedResults = () => {
    let filtered = results;

    // Filter by provider
    if (filterProvider !== 'all') {
      filtered = filtered.filter(r => r.provider === filterProvider);
    }

    // Filter by method
    if (filterMethod !== 'all') {
      filtered = filtered.filter(r => r.method === filterMethod);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.provider.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'totalCost') {
        return a.totalCost - b.totalCost;
      } else if (sortBy === 'costPerCall') {
        return a.costPerCall - b.costPerCall;
      } else if (sortBy === 'provider') {
        return a.provider.localeCompare(b.provider);
      } else if (sortBy === 'model') {
        return a.model.localeCompare(b.model);
      }
      return 0;
    });

    return sorted;
  };

  const displayedResults = getFilteredAndSortedResults();
  const minTotalCost = Math.min(...displayedResults.map(r => r.totalCost));
  const maxTotalCost = Math.max(...displayedResults.map(r => r.totalCost));

  const getRowColor = (totalCost) => {
    if (displayedResults.length <= 1) return '';
    const range = maxTotalCost - minTotalCost;
    if (range === 0) return '';

    const position = (totalCost - minTotalCost) / range;
    if (position < 0.33) return 'cost-low';
    if (position < 0.66) return 'cost-medium';
    return 'cost-high';
  };

  const exportToCSV = () => {
    const headers = ['Provider', 'Model', 'Pricing Method', 'Cost', 'Input Tokens', 'Output Tokens', 'API Calls', 'Hours'];
    const rows = displayedResults.map(r => [
      r.provider,
      r.model,
      r.method,
      r.costDisplay,
      inputTokens,
      outputTokens,
      apiCalls,
      hours
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llm-cost-comparison.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="comparison-container">
      <h1>LLM Cost Comparison Calculator</h1>
      <p className="subtitle">Enter your usage to compare costs across all models and pricing options</p>

      <div className="input-section">
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="inputTokens">Input Tokens per Call</label>
            <input
              id="inputTokens"
              type="number"
              min="0"
              value={inputTokens}
              onChange={(e) => setInputTokens(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="outputTokens">Output Tokens per Call</label>
            <input
              id="outputTokens"
              type="number"
              min="0"
              value={outputTokens}
              onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="input-group">
            <div className="toggle-group">
              <label>
                <input
                  type="checkbox"
                  checked={useApiPerMinute}
                  onChange={(e) => setUseApiPerMinute(e.target.checked)}
                />
                Use API calls per minute
              </label>
            </div>
            {useApiPerMinute ? (
              <>
                <label htmlFor="apiCallsPerMinute">API Calls per Minute</label>
                <input
                  id="apiCallsPerMinute"
                  type="number"
                  min="1"
                  value={apiCallsPerMinute}
                  onChange={(e) => setApiCallsPerMinute(parseInt(e.target.value) || 1)}
                />
              </>
            ) : (
              <>
                <label htmlFor="apiCalls">Total API Calls</label>
                <input
                  id="apiCalls"
                  type="number"
                  min="1"
                  value={apiCalls}
                  onChange={(e) => setApiCalls(parseInt(e.target.value) || 1)}
                />
              </>
            )}
          </div>
          <div className="input-group">
            {useApiPerMinute ? (
              <>
                <label htmlFor="duration">Duration (minutes)</label>
                <input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                />
              </>
            ) : (
              <>
                <label htmlFor="hours">Hours (PTU)</label>
                <input
                  id="hours"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={hours}
                  onChange={(e) => setHours(parseFloat(e.target.value) || 1)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="filter-controls">
          <div className="control-group">
            <label>Provider:</label>
            <select value={filterProvider} onChange={(e) => setFilterProvider(e.target.value)}>
              <option value="all">All Providers</option>
              <option value="Azure OpenAI">Azure OpenAI</option>
              <option value="Anthropic">Anthropic</option>
              <option value="Google Vertex AI">Google Vertex AI</option>
            </select>
          </div>
          <div className="control-group">
            <label>Pricing Method:</label>
            <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
              <option value="all">All Methods</option>
              <option value="Pay per Token">Pay per Token</option>
              <option value="PTU">PTU</option>
              <option value="API Calls">API Calls</option>
            </select>
          </div>
          <div className="control-group">
            <label>Sort By:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="totalCost">Total Cost (Low to High)</option>
              <option value="costPerCall">Cost per Call (Low to High)</option>
              <option value="provider">Provider</option>
              <option value="model">Model</option>
            </select>
          </div>
          <div className="control-group search-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button className="export-btn" onClick={exportToCSV}>
          Export to CSV
        </button>
      </div>

      <div className="results-section">
        <div className="results-count">
          Showing {displayedResults.length} pricing options
        </div>

        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Model</th>
                <th>Pricing Method</th>
                <th>Cost per Call</th>
                <th>Total Cost</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {displayedResults.map((result) => (
                <React.Fragment key={result.id}>
                  <tr
                    className={`result-row ${getRowColor(result.totalCost)}`}
                    onClick={() => toggleRowExpansion(result.id)}
                  >
                    <td className="provider-cell">{result.provider}</td>
                    <td className="model-cell">{result.model}</td>
                    <td className="method-cell">{result.method}</td>
                    <td className="cost-cell">
                      <span className="cost-value">{result.costPerCallDisplay}</span>
                    </td>
                    <td className="cost-cell">
                      <span className="cost-value">{result.totalCostDisplay}</span>
                    </td>
                    <td className="details-cell">
                      <button className="expand-btn">
                        {expandedRows.has(result.id) ? '▼' : '▶'} Details
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(result.id) && (
                    <tr className="details-row">
                      <td colSpan="6">
                        <div className="details-content">
                          {result.method === 'Pay per Token' && (
                            <>
                              <div className="detail-item">
                                <span className="detail-label">Input Cost per Call:</span>
                                <span>${result.details.inputCostPerCall} ({inputTokens.toLocaleString()} tokens @ {result.details.inputRate})</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Output Cost per Call:</span>
                                <span>${result.details.outputCostPerCall} ({outputTokens.toLocaleString()} tokens @ {result.details.outputRate})</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Total API Calls:</span>
                                <span>{result.details.totalApiCalls.toLocaleString()}</span>
                              </div>
                              {result.details.isLongContext && (
                                <div className="detail-note">Long context pricing applied (&gt;200K tokens)</div>
                              )}
                            </>
                          )}
                          {result.method === 'PTU' && (
                            <>
                              <div className="detail-item">
                                <span className="detail-label">Required PTUs:</span>
                                <span>{result.details.requiredPTUs} PTU(s)</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">PTU Hourly Cost:</span>
                                <span>{result.details.hourlyRate} × {result.details.requiredPTUs} = ${(parseFloat(result.details.hourlyRate.replace('$', '').replace('/hour', '')) * result.details.requiredPTUs).toFixed(2)}/hour</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Total Hours:</span>
                                <span>{result.details.totalHours.toFixed(2)} hours</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Token Throughput:</span>
                                <span>{result.details.tokensPerMinute.toLocaleString()} TPM (Capacity: {result.details.maxTPMCapacity.toLocaleString()} TPM)</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Utilization:</span>
                                <span>{result.details.utilizationPercent}% of PTU capacity</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Total API Calls:</span>
                                <span>{result.details.totalApiCalls.toLocaleString()}</span>
                              </div>
                              <div className="detail-note">{result.details.description}</div>
                            </>
                          )}
                          {result.method === 'API Calls' && (
                            <>
                              <div className="detail-item">
                                <span className="detail-label">Per Call Rate:</span>
                                <span>{result.details.perCallRate}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Total Calls:</span>
                                <span>{result.details.totalCalls.toLocaleString()}</span>
                              </div>
                              <div className="detail-note">{result.details.description}</div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="info-footer">
        <p>Prices as of January 2025. Azure OpenAI uses per-1K-token pricing, others use per-1M-token pricing.</p>
      </div>
    </div>
  );
}

export default ComparisonCalculator;