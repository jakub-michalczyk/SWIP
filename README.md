
![alt text](https://github.com/jakub-michalczyk/SWIP/blob/master/public/images/logo.svg?raw=true)

**SWIP** is a modern job search and recruitment platform featuring a landing page with a few subpages, allowing users to register as either job seekers or employers. Job seekers can browse job offers using a swipe-based system—swiping right to apply and left to reject—while also managing their account. Employers can view their job postings, check applicants' CVs, and edit account details. The app supports PWA functionality, and its backend is powered by Firebase

## Features

- **Job Seekers**: 
  - Browse job offers using a swipe-based system (right to apply, left to reject).
  - Manage user account

- **Employers**:
  - View and manage job postings.
  - Review applicants' CVs.
  - Edit account details.

- **PWA Support**: 
  - Offline functionality and app-like behavior on mobile devices.
  
- **Backend**: 
  - Firebase integration for user authentication, data storage, and real-time features.

![alt text](https://github.com/jakub-michalczyk/SWIP/blob/master/public/images/monogram.png)
  
## Technologies Used

- **Angular 19**: For the front-end framework.
- **Firebase**: For backend services (authentication, Firestore, and hosting).
- **Tailwind CSS**: For styling.
- **PWA (Progressive Web App)**: To provide app-like experience on mobile and desktop.
- **RxJS**: For reactive programming and handling asynchronous data flows.

## Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js**: Recommended version 16 or higher.
- **Angular CLI**: If not installed, you can install it globally using the command:

```bash
npm install -g @angular/cli
```
- **Firebase CLI**: For Firebase hosting and functions deployment.
```bash
npm install -g firebase-tools
```

## Setup
- **Clone repository:**
```bash
git clone https://github.com/jakub-michalczyk/SWIP
```

- **Navigate to the project folder:**
```bash
cd swip
```

- **Install the dependencies:**
```bash
npm install
```

- **Firebase init:**
  - Create a Firebase project in the [Firebase Console](https://firebase.google.com/)

  - Add your Firebase configuration details to the environment files in:
_src/environments/environment.ts_


- **Run the development server:**
```bash
ng serve
```

The app will be available at [http://localhost:4200](http://localhost:4200).

## Build for Production ##
To build the project for production, use the following command:
```bash
ng build --prod
```
The build artifacts will be stored in the dist/ directory. You can deploy the project to Firebase Hosting or any other hosting service.

## License ##
This project is licensed under the MIT License - see the LICENSE file for details.

![alt text](https://github.com/jakub-michalczyk/SWIP/blob/master/public/images/moon.gif)
