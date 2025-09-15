import { useState, useEffect } from 'react';
import { pricingData, getPricingMethods, calculateCost } from '../data/pricingData';

function LLMCalculator() {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [pricingMethod, setPricingMethod] = useState('');
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);
  const [apiCalls, setApiCalls] = useState(1);
  const [hours, setHours] = useState(1);
  const [result, setResult] = useState(null);

  const providers = Object.keys(pricingData);
  const models = selectedProvider ? Object.keys(pricingData[selectedProvider].models) : [];
  const pricingMethods = selectedProvider ? getPricingMethods(selectedProvider) : [];

  useEffect(() => {
    setSelectedModel('');
    setPricingMethod('');
    setResult(null);
  }, [selectedProvider]);

  useEffect(() => {
    setPricingMethod('');
    setResult(null);
  }, [selectedModel]);

  const handleCalculate = () => {
    if (!selectedProvider || !selectedModel || !pricingMethod) {
      alert('Please select provider, model, and pricing method');
      return;
    }

    const cost = calculateCost(
      selectedProvider,
      selectedModel,
      pricingMethod,
      inputTokens,
      outputTokens,
      apiCalls,
      hours
    );

    setResult(cost);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="calculator-container">
      <h1>LLM Cost Calculator</h1>
      <p className="subtitle">Calculate costs for Azure OpenAI, Anthropic, and Google Vertex AI models</p>

      <div className="form-section">
        <div className="form-group">
          <label htmlFor="provider">Provider</label>
          <select
            id="provider"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            <option value="">Select a provider</option>
            {providers.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </div>

        {selectedProvider && (
          <div className="form-group">
            <label htmlFor="model">Model</label>
            <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">Select a model</option>
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        )}

        {selectedModel && (
          <div className="form-group">
            <label htmlFor="pricing">Pricing Method</label>
            <select
              id="pricing"
              value={pricingMethod}
              onChange={(e) => setPricingMethod(e.target.value)}
            >
              <option value="">Select pricing method</option>
              {pricingMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        )}

        {pricingMethod && (
          <>
            {(pricingMethod === 'Pay per Token') && (
              <>
                <div className="form-group">
                  <label htmlFor="inputTokens">Input Tokens</label>
                  <input
                    id="inputTokens"
                    type="number"
                    min="0"
                    value={inputTokens}
                    onChange={(e) => setInputTokens(parseInt(e.target.value) || 0)}
                    placeholder="Enter number of input tokens"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="outputTokens">Output Tokens</label>
                  <input
                    id="outputTokens"
                    type="number"
                    min="0"
                    value={outputTokens}
                    onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)}
                    placeholder="Enter number of output tokens"
                  />
                </div>
              </>
            )}

            {pricingMethod === 'PTU (Provisioned Throughput Units)' && (
              <div className="form-group">
                <label htmlFor="hours">Hours</label>
                <input
                  id="hours"
                  type="number"
                  min="1"
                  step="0.1"
                  value={hours}
                  onChange={(e) => setHours(parseFloat(e.target.value) || 1)}
                  placeholder="Enter number of hours"
                />
              </div>
            )}

            {pricingMethod === 'API Calls' && (
              <div className="form-group">
                <label htmlFor="apiCalls">Number of API Calls</label>
                <input
                  id="apiCalls"
                  type="number"
                  min="1"
                  value={apiCalls}
                  onChange={(e) => setApiCalls(parseInt(e.target.value) || 1)}
                  placeholder="Enter number of API calls"
                />
              </div>
            )}

            <button className="calculate-btn" onClick={handleCalculate}>
              Calculate Cost
            </button>
          </>
        )}
      </div>

      {result && (
        <div className="result-section">
          <h2>Cost Calculation Result</h2>
          <div className="result-card">
            <div className="total-cost">
              <span className="label">Total Cost:</span>
              <span className="amount">${result.totalCost}</span>
            </div>

            <div className="breakdown">
              <h3>Breakdown:</h3>
              {pricingMethod === 'Pay per Token' && (
                <>
                  <div className="breakdown-item">
                    <span>Input Tokens:</span>
                    <span>{formatNumber(inputTokens)} @ {result.breakdown.inputRate}</span>
                    <span className="cost">${result.breakdown.inputCost}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Output Tokens:</span>
                    <span>{formatNumber(outputTokens)} @ {result.breakdown.outputRate}</span>
                    <span className="cost">${result.breakdown.outputCost}</span>
                  </div>
                  {result.breakdown.isLongContext && (
                    <div className="note">Note: Long context pricing applied (>200K tokens)</div>
                  )}
                </>
              )}

              {pricingMethod === 'PTU (Provisioned Throughput Units)' && (
                <>
                  <div className="breakdown-item">
                    <span>Hourly Rate:</span>
                    <span>{result.breakdown.hourlyRate}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Hours:</span>
                    <span>{result.breakdown.hours}</span>
                  </div>
                  <div className="note">{result.breakdown.description}</div>
                </>
              )}

              {pricingMethod === 'API Calls' && (
                <>
                  <div className="breakdown-item">
                    <span>Per Call Rate:</span>
                    <span>{result.breakdown.perCallRate}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Total Calls:</span>
                    <span>{formatNumber(result.breakdown.totalCalls)}</span>
                  </div>
                  <div className="note">{result.breakdown.description}</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="info-section">
        <h3>Pricing Information</h3>
        <ul>
          <li><strong>Azure OpenAI:</strong> Prices in USD per 1,000 tokens for pay-per-token, hourly rates for PTU</li>
          <li><strong>Anthropic:</strong> Prices in USD per 1 million tokens</li>
          <li><strong>Google Vertex AI:</strong> Prices in USD per 1 million tokens, with different rates for context >200K tokens</li>
        </ul>
        <p className="disclaimer">
          Prices are based on publicly available information as of January 2025 and may vary by region and usage volume.
          Always check official provider documentation for the most current pricing.
        </p>
      </div>
    </div>
  );
}

export default LLMCalculator;