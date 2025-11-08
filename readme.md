# Chat App (Full Stack)

A Full-Stack MERN (MongoDB, Express, React, Node) realtime chat application built with **Socket.IO**, **Tailwind CSS**, and **Cloudinary** for media uploads.  

Live demo: [https://wechatpro.vercel.app](https://wechatpro.vercel.app)

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Technologies](#technologies)  
- [Repository Structure](#repository-structure-typical)  
- [Setup and Local Development](#setup-and-local-development)  
  - [Prerequisites](#prerequisites)  
  - [Environment Variables (.env examples)](#environment-variables-env-examples)  
  - [Install and Run (Server & Client)](#install-and-run-server--client)  
- [Running in Production / Deployment Notes](#running-in-production--deployment-notes)  
- [API Endpoints (High Level)](#api-endpoints-high-level)  
- [Socket / Realtime Notes](#socket--realtime-notes)  
- [Media Uploads (Cloudinary)](#media-uploads-cloudinary)  
- [Security & Production Considerations](#security--production-considerations)  
- [Contributing](#contributing)  
- [License & Credits](#license--credits)


## Project Overview

This project is a realtime chat web application (web client + server). Users can:

- Create accounts and sign in  
- Send direct messages in realtime  
- Exchange media
- Update profile picture or full name 

Messages are delivered in realtime using **Socket.IO**, and media files are stored via **Cloudinary**.


## Features

- User authentication (signup/login)  
- Realtime messaging (Socket.IO)   
- Online status
- Message history persisted to MongoDB  
- Image uploads via Cloudinary  
- Responsive UI built with Tailwind CSS  
- Deployment-ready (Vercel for frontend, Railway for backend)


## Technologies

- **Frontend:** React.js, TailwindCSS  
- **Backend:** Node.js, Express.js  
- **Realtime:** Socket.IO  
- **Database:** MongoDB (Atlas or self-hosted)  
- **Media:** Cloudinary  
- **Dev Tools:** npm


## Repository Structure (Typical)

- Adjust to reflect your repo’s actual layout:

- /client — React frontend public/ src/ components/ pages/ services/

- /server — Express backend controllers/ models/ routes/ middlewares/ sockets/ utils/

- .env should be included separately in both folders

### Prerequisites

- Node.js (LTS recommended)  
- npm or yarn  
- MongoDB (Atlas or local)  
- Cloudinary account (for media upload)  
- Optional: ngrok (for testing socket events across devices during local dev)


### Environment Variables (.env Examples)

#### Client ('client/.env')

```bash
VITE_BACKEND_URL=http://localhost:yourport



#### Server (`server/.env`)
