# Document Wallet

A modern, secure document management application with a beautiful wallet-inspired interface. Built with React, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

## Features

- **Secure Authentication**: Email/password authentication via Supabase Auth
- **Document Storage**: Upload and store PDF, DOCX, PNG, and JPG files
- **Beautiful UI**: Wallet-inspired design with smooth animations
- **Search & Filter**: Find documents quickly with search and filter options
- **Private Storage**: Each user can only access their own documents
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Auth, Database, Storage)
- **Build Tool**: Vite

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

The migration file is already included in `supabase/migrations/create_documents_table.sql`. 

To apply the migration:
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of the migration file
4. Run the SQL query

This will create:
- `documents` table with proper structure
- Row Level Security (RLS) policies
- Storage bucket for documents
- Storage policies for secure file access

### 4. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Upload Documents**: Drag and drop or click to upload supported file types
3. **Manage Documents**: View, download, or delete your documents
4. **Search & Filter**: Use the search bar and filters to find specific documents
5. **Secure Access**: All documents are private and only accessible to their owner

## Supported File Types

- PDF documents (.pdf)
- Word documents (.docx)
- Images (.png, .jpg, .jpeg)
- Maximum file size: 10MB per file

## Security Features

- Row Level Security (RLS) ensures users can only access their own documents
- Secure file storage with Supabase Storage
- User authentication with Supabase Auth
- Private file paths with user ID prefixes

## Development

### Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard components
│   └── UI/            # Reusable UI components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API services
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

### Key Components

- **AuthProvider**: Manages authentication state
- **DocumentService**: Handles file operations
- **UploadArea**: Drag-and-drop file upload
- **DocumentGrid**: Displays documents in a grid layout
- **DocumentCard**: Individual document display with actions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.