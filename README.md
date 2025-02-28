# CDP Assistant Chatbot

A React-based chatbot application that helps users with "how-to" questions related to Customer Data Platforms (CDPs) including Segment, mParticle, Lytics, and Zeotap.

<img width="1709" alt="image" src="https://github.com/user-attachments/assets/fd67a28c-bc96-470b-a165-5e2b7dc7264c" />


## Overview

The CDP Assistant is an AI-powered chatbot designed to extract and provide relevant information from official CDP documentation. It helps users understand how to perform specific tasks or achieve outcomes across different CDP platforms.

## Features

- **CDP Q&A Support**: Answers "how-to" questions for Segment, mParticle, Lytics, and Zeotap
- **Documentation Integration**: Extracts relevant information from official documentation
- **Cross-CDP Comparisons**: Compares approaches and functionalities across the four platforms
- **Advanced Configuration Guidance**: Provides support for complex, platform-specific questions
- **Responsive UI**: Works seamlessly across desktop and mobile devices
- **Dark/Light Theme**: Supports user preference with persistent theme settings
- **Chat History**: Maintains conversation context within sessions
- **Quick Questions**: Suggests common queries to help users get started

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Components**: Custom components with responsive design
- **API Integration**: Cohere API for natural language processing
- **Data Storage**: Supabase for chat history persistence
- **Styling**: Tailwind CSS for responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Cohere API key
- Supabase account and API keys

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/cdp-assistant.git
   cd cdp-assistant
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_COHERE_API_KEY=your_cohere_api_key
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```

## Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── ChatMessage.tsx
│   │   ├── QuickQuestion.tsx
│   │   └── ...
│   ├── services/
│   │   ├── cohereService.ts       # Handles API calls to Cohere
│   │   └── supabaseClient.ts      # Handles chat history persistence
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── App.tsx                    # Main application component
│   └── index.tsx                  # Entry point
├── .env.example
├── package.json
└── README.md
```

## How It Works

The CDP Assistant uses the following workflow:

1. User inputs a question about one of the supported CDPs
2. The question is processed by the Cohere NLP API
3. The system retrieves relevant information from indexed CDP documentation
4. The chatbot formulates and delivers a response based on the documentation
5. Conversations are saved to Supabase for context preservation

## Supported Question Types

### Basic How-To Questions
- "How do I set up a new source in Segment?"
- "How can I create a user profile in mParticle?"
- "How do I build an audience segment in Lytics?"
- "How can I integrate my data with Zeotap?"

### Cross-CDP Comparisons
- "How does Segment's audience creation process compare to Lytics'?"
- "What are the differences between mParticle and Zeotap for mobile app tracking?"

### Advanced Configuration
- "How do I implement custom event tracking in Segment?"
- "What's the process for setting up real-time personalization with Lytics?"

## Handling Edge Cases

The CDP Assistant handles:

- Extremely long questions without breaking
- Questions irrelevant to CDPs (gracefully redirects conversation)
- Platform-specific terminology and concepts
- Ambiguous queries with clarification requests

## Deployment

This application can be deployed to various platforms:

### Vercel/Netlify
```
npm run build
# Then follow platform-specific deployment instructions
```

### Docker
```
docker build -t cdp-assistant .
docker run -p 3000:3000 cdp-assistant
```

## Future Enhancements

- Integration with more CDP platforms
- Enhanced visualization of step-by-step guides
- User authentication for personalized experiences
- PDF/Document upload for custom documentation support
- Voice input/output capabilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Official documentation from Segment, mParticle, Lytics, and Zeotap
- Cohere for providing NLP capabilities
- Supabase for backend services
