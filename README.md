# 42 Transcript Generator
> [!IMPORTANT]
> **This project is currently undergoing a major refactor (V2), moving away from Python (FastAPI) to Next.js.** Some features may be under active development during this transition.


A web-based tool developed in collaboration with the **Pedago team at 42 Berlin** to generate ** academic transcripts** for 42 Berlin students. This service was created to fill the gap where a formal transcript did not previously exist, helping students present their achievements to employers, universities, and other institutions upon request.

![42 Berlin Transcript Generator Screenshot](img/42_Berlin_Transcript_Generator.jpg)

https://transcript42.project-cloud.cloud

---

## ✨ Features

- 🔐 **OAuth2 Authentication** via the 42 API  
- 📄 **PDF Transcript Generation** in **English** or **German**
- 🎓 Option to generate:
  - Only the **core curriculum**
  - Core curriculum + **specialization track** (for advanced students)
- 📁 Stores user data locally in `.json` and outputs `.pdf`
- 🛠️ **Developer Log View** (secured by password)
- 🚀 **GitHub Actions CI/CD** for auto-deployment
- 📦 **Dockerized** for reproducible builds and easy deployment

---

## 🧠 Tech Stack

| Technology      | Role                                     |
|-----------------|------------------------------------------|
| **Next.js 15**  | Full-stack Web Framework (App Router)    |
| **React 19**    | UI Components                            |
| **TypeScript**  | Static typing & DX                       |
| **LaTeX**       | PDF formatting and generation            |
| **Google Maps API** | Interactive background visualizations |
| **Docker**      | Containerization                         |
| **42 API**      | Student data integration (OAuth + fetch) |
| **GitHub Actions** | CI/CD pipeline                       |

---

## 🔧 Endpoints Overview

| Endpoint                  | Method | Description                                      |
|---------------------------|--------|--------------------------------------------------|
| `/` or `/my_fabulous_transcript` | GET    | Initiates OAuth2 authorization with 42 API       |
| `/oauth_redirect`         | GET    | Handles the 42 OAuth redirect and token exchange |
| `/transcript`             | POST   | Generates a PDF based on submitted form data     |
| `/logs`                   | GET    | Shows server logs (requires password)            |

---

## 📄 Transcript Example

Transcripts include:
- Student name and birth info
- Completed projects
- Grades and evaluation scores
- Optional: specialization track (if applicable)

You can choose between **German** or **English** formats.

---

## 🔐 Security

- OAuth 2.0 ensures authentication via 42's secure API.
- Log access is protected by a secret password.
- User files are stored in a `data/` folder and are private to the instance.

---

## 🧑‍💻 Maintainance

For suggestions or contributions, feel free to open a pull request or issue.
