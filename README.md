
# Linker: Shorten Links, Extend Possibilities

Linker is a customizable URL shortener that transforms long URLs into concise, manageable links, with options to create QR codes and personalize short URLs. Designed to streamline URL sharing and offer ease of use.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation and Setup](#installation-and-setup)
5. [Usage Guide](#usage-guide)
6. [API Endpoints](#api-endpoints)
7. [Future Plans](#future-plans)
8. [Contributing](#contributing)

## Project Overview

The Linker project is a full-stack application designed to shorten URLs and generate QR codes with a simple, user-friendly interface. With options for custom URLs, Linker supports users in creating memorable, branded links. Its intuitive design aims to make URL management and sharing efficient and customizable.

## Features

- **Custom URL Shortening**: Create and personalize shortened URLs easily.
- **QR Code Generation**: Generate and download QR codes for easy sharing.
- **Link Management**: View, edit, copy, and delete shortened links.
- **Responsive Interface**: Clean and user-friendly design for desktop and mobile.
- **Expandable Link Details**: Expandable sections for viewing and managing link information.
- **Clipboard Copy and Notifications**: Copy shortened URLs to clipboard with notifications.

## Technologies Used

- **Frontend**: React.js, CSS for styling, SVG icons.
- **Backend**: Node.js, Express.js for handling requests.
- **Database**: MongoDB for storing URL data and associated metadata.
- **QR Code Library**: react-qr-code for QR code generation.

## Installation and Setup

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/linker.git
    cd linker
    ```

2. **Install Dependencies**:
   For both the client and server directories:
    ```bash
    npm install
    ```

3. **Run the Backend**:
    Navigate to the backend directory and start the server:
    ```bash
    node server.js
    ```

4. **Run the Frontend**:
    Start the frontend server:
    ```bash
    npm start
    ```

5. **Access the Application**:
    Open your browser and go to `http://localhost:3000`.

## Usage Guide

- **Shortening a URL**: Enter a URL in the input field and click the "Shorten" button.
- **Editing a Shortened URL**: Use the Edit option to assign a custom URL.
- **Generating a QR Code**: Automatically created for each shortened link; downloadable as an image.
- **Managing Links**: View a list of all shortened links, where you can edit, delete, or copy them directly.

## API Endpoints

The following endpoints are accessible for integration and testing:

- **POST /shorten**: Accepts a long URL and returns the shortened URL.
- **GET /shortened-urls**: Retrieves a list of all stored shortened URLs.
- **PUT /shortened-urls/:shortUrl**: Updates the original or short URL based on user input.
- **DELETE /shortened-urls/:shortUrl**: Deletes the specified shortened URL.

## Future Plans

1. **User Authentication**: To enable user-specific link storage and personalization.
2. **Analytics**: Click tracking and analytics to help users understand link performance.
3. **Custom QR Code Styling**: Allow customization of QR code colors and designs.