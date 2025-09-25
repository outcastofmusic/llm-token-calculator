export const pricingData = {
  "Azure OpenAI": {
    references: {
      pricing: "https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/",
      ptuDocs: "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/provisioned-throughput-onboarding",
      quotaLimits: "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/quotas-limits",
      ptuCalculator: "https://ai.azure.com/resource/calculator",
      lastUpdated: "January 2025"
    },
    models: {
      "GPT-4o": {
        payPerToken: {
          inputPer1000: 0.0025,
          outputPer1000: 0.01
        },
        ptu: {
          hourlyRate: 2.00,
          inputTPMPerPTU: 2500,
          outputTokenRatio: 4,
          description: "Provisioned Throughput Unit (PTU) - charged per hour regardless of usage"
        }
      },
      "GPT-4o mini": {
        payPerToken: {
          inputPer1000: 0.00015,
          outputPer1000: 0.0006
        },
        ptu: {
          hourlyRate: 0.50,
          inputTPMPerPTU: 37000,
          outputTokenRatio: 4,
          description: "Provisioned Throughput Unit (PTU) - charged per hour regardless of usage"
        }
      },
      "GPT-4 Turbo": {
        payPerToken: {
          inputPer1000: 0.01,
          outputPer1000: 0.03
        },
        ptu: {
          hourlyRate: 3.00,
          inputTPMPerPTU: 2000,
          outputTokenRatio: 3,
          description: "Provisioned Throughput Unit (PTU) - charged per hour regardless of usage"
        }
      },
      "GPT-3.5 Turbo": {
        payPerToken: {
          inputPer1000: 0.0005,
          outputPer1000: 0.0015
        },
        ptu: {
          hourlyRate: 0.30,
          inputTPMPerPTU: 4000,
          outputTokenRatio: 3,
          description: "Provisioned Throughput Unit (PTU) - charged per hour regardless of usage"
        }
      },
      "GPT-5": {
        payPerToken: {
          inputPer1000: 0.00125,
          outputPer1000: 0.01
        },
        ptu: {
          hourlyRate: 5.00,
          inputTPMPerPTU: 4750,
          outputTokenRatio: 8,
          description: "Latest GPT-5 with 272K context, intelligent caching (90% discount), and enhanced reasoning"
        }
      },
      "GPT-5 mini": {
        payPerToken: {
          inputPer1000: 0.00025,
          outputPer1000: 0.002
        },
        ptu: {
          hourlyRate: 1.50,
          inputTPMPerPTU: 8000,
          outputTokenRatio: 8,
          description: "Cost-efficient GPT-5 variant with 272K context and intelligent caching"
        }
      },
      "GPT-5 nano": {
        payPerToken: {
          inputPer1000: 0.00005,
          outputPer1000: 0.0004
        },
        ptu: {
          hourlyRate: 0.80,
          inputTPMPerPTU: 15000,
          outputTokenRatio: 8,
          description: "Ultra-efficient GPT-5 variant optimized for high-volume applications"
        }
      }
    }
  },
  "Anthropic": {
    references: {
      pricing: "https://www.anthropic.com/pricing",
      apiDocs: "https://docs.anthropic.com/en/docs/about-claude/pricing",
      models: "https://docs.anthropic.com/en/docs/about-claude/models/overview",
      claude4: "https://www.anthropic.com/news/claude-4",
      lastUpdated: "January 2025"
    },
    models: {
      "Claude Opus 4": {
        payPerToken: {
          inputPer1M: 15,
          outputPer1M: 75
        },
        apiCalls: {
          perCall: 0.05,
          description: "Estimated per API call cost"
        }
      },
      "Claude Sonnet 4": {
        payPerToken: {
          inputPer1M: 3,
          outputPer1M: 15
        },
        apiCalls: {
          perCall: 0.01,
          description: "Estimated per API call cost"
        }
      },
      "Claude 3.5 Sonnet": {
        payPerToken: {
          inputPer1M: 3,
          outputPer1M: 15
        },
        apiCalls: {
          perCall: 0.01,
          description: "Estimated per API call cost"
        }
      },
      "Claude 3 Opus": {
        payPerToken: {
          inputPer1M: 15,
          outputPer1M: 75
        },
        apiCalls: {
          perCall: 0.05,
          description: "Estimated per API call cost"
        }
      },
      "Claude 3 Haiku": {
        payPerToken: {
          inputPer1M: 0.25,
          outputPer1M: 1.25
        },
        apiCalls: {
          perCall: 0.001,
          description: "Estimated per API call cost"
        }
      }
    }
  },
  "Google Vertex AI": {
    references: {
      pricing: "https://cloud.google.com/vertex-ai/generative-ai/pricing",
      geminiDocs: "https://ai.google.dev/gemini-api/docs/pricing",
      vertexPricing: "https://cloud.google.com/vertex-ai/pricing",
      models: "https://ai.google.dev/gemini-api/docs/models",
      lastUpdated: "January 2025"
    },
    models: {
      "Gemini 2.5 Pro": {
        payPerToken: {
          inputPer1M: 1.25,
          outputPer1M: 10,
          longContextInputPer1M: 2.5,
          longContextOutputPer1M: 15,
          contextThreshold: 200000
        },
        apiCalls: {
          perCall: 0.01,
          description: "Estimated per API call cost"
        }
      },
      "Gemini 2.5 Flash": {
        payPerToken: {
          inputPer1M: 0.3,
          outputPer1M: 2,
          longContextInputPer1M: 1,
          longContextOutputPer1M: 4,
          contextThreshold: 200000
        },
        apiCalls: {
          perCall: 0.002,
          description: "Estimated per API call cost"
        }
      },
      "Gemini 2.5 Flash-Lite": {
        payPerToken: {
          inputPer1M: 0.1,
          outputPer1M: 0.4,
          longContextInputPer1M: 0.2,
          longContextOutputPer1M: 0.8,
          contextThreshold: 200000
        },
        apiCalls: {
          perCall: 0.0005,
          description: "Estimated per API call cost"
        }
      },
      "Gemini 1.5 Pro": {
        payPerToken: {
          inputPer1M: 3.5,
          outputPer1M: 10.5,
          longContextInputPer1M: 7,
          longContextOutputPer1M: 21,
          contextThreshold: 200000
        },
        apiCalls: {
          perCall: 0.015,
          description: "Estimated per API call cost"
        }
      },
      "Gemini 1.5 Flash": {
        payPerToken: {
          inputPer1M: 0.35,
          outputPer1M: 1.05,
          longContextInputPer1M: 0.7,
          longContextOutputPer1M: 2.1,
          contextThreshold: 200000
        },
        apiCalls: {
          perCall: 0.001,
          description: "Estimated per API call cost"
        }
      }
    }
  }
};

export const getPricingMethods = (provider) => {
  const methods = new Set();
  if (!pricingData[provider]) return [];

  Object.values(pricingData[provider].models).forEach(model => {
    if (model.payPerToken) methods.add('Pay per Token');
    if (model.ptu) methods.add('PTU (Provisioned Throughput Units)');
    if (model.apiCalls) methods.add('API Calls');
  });

  return Array.from(methods);
};

export const calculateCost = (provider, model, pricingMethod, inputTokens, outputTokens, apiCalls, hours = 1) => {
  const modelData = pricingData[provider]?.models[model];
  if (!modelData) return null;

  let cost = 0;
  let breakdown = {};

  switch (pricingMethod) {
    case 'Pay per Token':
      if (modelData.payPerToken) {
        if (provider === "Azure OpenAI") {
          const inputCost = (inputTokens / 1000) * modelData.payPerToken.inputPer1000;
          const outputCost = (outputTokens / 1000) * modelData.payPerToken.outputPer1000;
          cost = inputCost + outputCost;
          breakdown = {
            inputCost: inputCost.toFixed(4),
            outputCost: outputCost.toFixed(4),
            inputRate: `$${modelData.payPerToken.inputPer1000}/1K tokens`,
            outputRate: `$${modelData.payPerToken.outputPer1000}/1K tokens`
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

          const inputCost = (inputTokens / 1000000) * inputRate;
          const outputCost = (outputTokens / 1000000) * outputRate;
          cost = inputCost + outputCost;
          breakdown = {
            inputCost: inputCost.toFixed(4),
            outputCost: outputCost.toFixed(4),
            inputRate: `$${inputRate}/1M tokens`,
            outputRate: `$${outputRate}/1M tokens`,
            isLongContext: isLongContext
          };
        }
      }
      break;

    case 'PTU (Provisioned Throughput Units)':
      if (modelData.ptu) {
        cost = modelData.ptu.hourlyRate * hours;
        breakdown = {
          hourlyRate: `$${modelData.ptu.hourlyRate}/hour`,
          hours: hours,
          description: modelData.ptu.description
        };
      }
      break;

    case 'API Calls':
      if (modelData.apiCalls) {
        cost = modelData.apiCalls.perCall * apiCalls;
        breakdown = {
          perCallRate: `$${modelData.apiCalls.perCall}/call`,
          totalCalls: apiCalls,
          description: modelData.apiCalls.description
        };
      }
      break;
  }

  return {
    totalCost: cost.toFixed(4),
    breakdown
  };
};
