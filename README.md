# Quell

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbrowserbase%2Fopen-operator&env=OPENAI_API_KEY,BROWSERBASE_API_KEY,BROWSERBASE_PROJECT_ID&envDescription=API%20keys%20needed%20to%20run%20Open%20Operator&envLink=https%3A%2F%2Fgithub.com%2Fbrowserbase%2Fopen-operator%23environment-variables)

## Getting Started

First, install the dependencies for this repository. This requires [pnpm](https://pnpm.io/installation#using-other-package-managers).

<!-- This doesn't work with NPM, haven't tested with yarn -->

```bash
pnpm install
```

Next, copy the example environment variables:

```bash
cp .env.example .env.local
```

You'll need to set up your API keys:

1. Get your OpenAI API key from [OpenAI's dashboard](https://platform.openai.com/api-keys)
2. Get your Browserbase API key and project ID from [Browserbase](https://www.browserbase.com)

Update `.env.local` with your API keys:

- `OPENAI_API_KEY`: Your OpenAI API key
- `BROWSERBASE_API_KEY`: Your Browserbase API key
- `BROWSERBASE_PROJECT_ID`: Your Browserbase project ID

Then, run the development server:

<!-- This doesn't work with NPM, haven't tested with yarn -->

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see Open Operator in action.

## How It Works

Building a web agent is a complex task. You need to understand the user's intent, convert it into headless browser operations, and execute actions, each of which can be incredibly complex on their own.

Stagehand is a tool that helps you build web agents. It allows you to convert natural language into headless browser operations, execute actions on the browser, and extract results back into structured data.

Stagehand uses Browserbase to execute actions on the browser, and OpenAI to understand the user's intent.


### Key Technologies

- **[CrewAI](https://www.crewai.com)**: Agent orchestration and tool layer
- **[Browserbase](https://www.browserbase.com)**: Powers the core browser automation and interaction capabilities
- **[Stagehand](https://www.stagehand.dev)**: Handles precise DOM manipulation and state management
- **[Next.js](https://nextjs.org)**: Provides the modern web framework foundation
- **[OpenAI](https://openai.com)**: Enable natural language understanding and decision making

## Contributing

Please feel free to open issues and pull requests.

## License

Quell is proprietary software licensed under the MIT license.
