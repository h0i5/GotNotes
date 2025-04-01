# GotNotes?
*Answering the infamous question every college students asks each semester, **Got Notes?***

A college-centric platform for sharing notes, papers, and resources with your college peers.

## Overview

GotNotes is a modern web application that helps college students share and access academic resources within their college community. Built with Next.js 14, Supabase, and Tailwind CSS, it provides a seamless experience for managing and discovering course materials.

![Landing Page](https://github.com/user-attachments/assets/a787e497-0a18-4111-b248-75caffb23c9f)
*Landing page with dynamic animations and modern design*

## Features

### 🏛️ College Communities
- Join your college's dedicated space
- Collaborate with peers from your institution
- Maintain privacy within your college network

![College List](https://github.com/user-attachments/assets/138a12ed-5b40-4282-b9df-e0fecf06faab)
*Browse and join college communities*

### 📖 Course Management
- Create and organize courses
- Bulk course creation via JSON
- Smart search functionality
- Real-time updates

![Dashboard](https://github.com/user-attachments/assets/97554d2e-c44b-4e6d-95b0-52f8d17bf7ef)
*Home dashboard with courses and forum*

### 📝 Resource Sharing
- Share course notes
- Upload previous year papers
- Organize resources by courses
- Easy file management

![image](https://github.com/user-attachments/assets/a7d751ae-6665-4826-9985-fac0258cf639)
*Courses under a College*

### 📑 Notes & Papers
- Dedicated sections for notes and papers
- Preview files before downloading
- Track resource creators and timestamps

![Notes Section](https://github.com/user-attachments/assets/963aba08-6442-4007-95a0-d10dff6ecab6)
*Notes management interface*

![Notes Section](https://github.com/user-attachments/assets/ddf50206-a627-4352-bd25-5468e81b8949)
*View Notes directly in Browser*

![Papers Section](https://github.com/user-attachments/assets/8d1d13d0-1b8f-4d32-9da4-397356fb2eea)
*Previous year papers section*

### Forum for discussions
![Forum Section](https://github.com/user-attachments/assets/55f299be-9eeb-4dfc-ae0e-a99a6ad2b44b)
*In College Chat Service*


## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Deployment**: Vercel

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/h0i5/gotnotes.git
```

2. Install dependencies:

```bash
npm install
```

3. Copy the `.env.example` file to `.env.local` and set the environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000` to access the application.

## Contributing

We welcome contributions! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
