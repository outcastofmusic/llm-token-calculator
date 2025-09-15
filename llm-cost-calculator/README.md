# LLM Cost Calculator

A React-based web application for calculating costs across different LLM providers and pricing models.

## Features

- **Multi-Provider Support**: Calculate costs for Azure OpenAI, Anthropic Claude, and Google Vertex AI models
- **Multiple Pricing Models**:
  - Pay per Token pricing
  - PTU (Provisioned Throughput Units) for Azure OpenAI
  - API Call-based pricing
- **Real-time Calculation**: Instant cost calculations with detailed breakdowns
- **Responsive Design**: Works on desktop and mobile devices

## Supported Models

### Azure OpenAI
- GPT-4o
- GPT-4o mini
- GPT-4 Turbo
- GPT-3.5 Turbo

### Anthropic
- Claude Opus 4
- Claude Sonnet 4
- Claude 3.5 Sonnet
- Claude 3 Opus
- Claude 3 Haiku

### Google Vertex AI
- Gemini 2.5 Pro
- Gemini 2.5 Flash
- Gemini 2.5 Flash-Lite
- Gemini 1.5 Pro
- Gemini 1.5 Flash

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Navigate to `http://localhost:5173` to use the calculator.

## Building for Production

```bash
npm run build
```

## Pricing Notes

- **Azure OpenAI**: Prices per 1,000 tokens for pay-per-token model, hourly rates for PTU
- **Anthropic**: Prices per 1 million tokens
- **Google Vertex AI**: Prices per 1 million tokens with special long-context pricing for >200K tokens

Prices are based on publicly available information as of January 2025. Always verify with official provider documentation for current pricing.
