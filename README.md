# Google Drive Transfer File Ownership using Node.js and Google Drive API

This project demonstrates how to transfer ownership of a file in Google Drive using Node.js and the Google Drive API. It requires user authentication via OAuth2 and allows you to transfer ownership of a file by providing the file ID and the new owner's email.

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (version 12 or later)
- A Google Cloud Platform (GCP) project with the Google Drive API enabled

## Setup

### Step 1: Enable Google Drive API and Get Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Enable the **Google Drive API** for the project.
4. Go to the **Credentials** tab and click on **Create Credentials**.
5. Choose **OAuth 2.0 Client IDs** and configure your consent screen.
6. Go to **Audience** and add **Test Users**

### Step 2: Clone this Repository

```bash
git clone https://github.com/Zier0Code/gdrive_transfer_file_ownership.git
```

### Step 3: Install Packages and Run

Run the following command to install the necessary dependencies and run:

```bash
npm i
npm start
```
