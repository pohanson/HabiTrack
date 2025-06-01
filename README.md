# HabiTrack

**Team Name**: HabiTrack  
**Proposed Level of Achievement**: Apollo 11  

## Table of Contents
- [Project Scope](#project-scope)
  - [Motivation](#motivation)
- [Requirements](#requirements)
  - [Features](#features)
    - [Core Features](#core-features)
    - [Extension Features](#extension-features)
  - [User Stories](#user-stories)
  - [Use Cases](#use-cases)
- [Timeline](#timeline)
  - [Milestone 1](#milestone-1)
  - [Milestone 2](#milestone-2)
  - [Milestone 3](#milestone-3)
- [Setup Instructions](#setup-instructions)
  - [Preview](#preview)
  - [Development](#development)
- [Tech Stack](#tech-stack)
  - [React Native](#react-native)
  - [Git](#git)

## Project Scope

A habit tracker that can motivate you to keep to your habits.

We hope to help one track their many tasks and habits, and consistently complete daily routines that are beneficial to them. To that end, we want to motivate them through means such as milestones, percentage completion, and possibly healthy competitions. 


### Motivation

We often find ourselves wanting to have a convenient way to become more organised and disciplined. Being consistent requires building good habits, so an app that tracks and reminds us of habits would be very useful. Such an app can be a fun and rewarding way to stay consistent and reach long term goals, since it “gamifies” the process and encourages us to continue our streaks. Also, we hope to utilise the power of peer pressure for good, and spur friends to motivate each other on to complete a habit.

## Requirements

### Features

#### Core Features

##### 1. Habits
- The input should support the creation, editing, and deletion of habits. For each habit, users can specify how often it occurs by selecting the days of the week and at what time.
- Each habit should be able to be marked as completed for the day. The Habit List should show all incomplete habits at the top, followed by complete habits at the bottom.
- One non-functional requirement is that it should be able to work offline.
- Each habit simply has only 2 statuses: complete or incomplete.

##### 2. Statistics Page

- Calendar heatmap reflecting habit completion.
- Bar graph (for all habits overview)/pie chart (for each specific habit) reflecting habit completion.
- Best streak(s): shows the longest streak(s) of consecutive days a habit was successfully completed.

##### 3. Notifications
- App notifications at custom timings that remind the user about incomplete habits.
- App notifications when habit milestones are reached.

##### 4. Milestones
- Have badges for consistent completion of habits over certain lengths of time. (e.g. 1 Week, 1 month, 6 months, 100 times!)

#### Extension Features

##### 1. Habit Extensions
- Implementation for habits that are measurable in nature, e.g. running distance or study duration.
- Ability to add optional textual notes after completing a habit (for personal reference and logging).

##### 2. Account Creation
- Ability for users to create accounts and log in with a username and password.
- Ability for users to add/edit their profile picture and bio for their own account.

##### 3. Social Features
- Ability for users to search for other usernames to make friend requests or accept them.
- A selection of a few preset habits which users can choose from to compete with their friends by aiming for a higher completion rate.

### User Stories

1. As a university student who wants to get better grades, I want to be able to track and record how much I study throughout the day, so I can easily review and adjust my studying habits.
2. As a musician who wants to practice playing an instrument more often, I want to be able to make sure I hit my weekly practice goals.
3. As friends who are aiming to achieve the same habit together, we want to be able to motivate each other to be consistent and committed in achieving the goal.
4. As a recovering addict, I want to be able to have consistent reminders when I reach big milestones.
5. As a careless user, I want to be able to edit the habits I had previously created. 
6. As a youth who likes to try new things, I would want to be able to delete the habits that I no longer am doing, so that I would not be continuously bombarded with notifications about the habit I am no longer interested in doing. But I will still want to view it.


### Use Cases

#### Use case: UC01 - Create New Habits
Actor: Self  
Main Success Scenario (MSS):  
1. User chooses to create new habit, and input the details
2. HT verified that all the relevant fields are keyed in, and displays a notification indicating success

#### Use case: UC02 - View Specific Habit Statistics
Actor: Self  
MSS:  
1. Tap on a habit
2. View relevant statistics about the habit’s completion rates (Calendar View, Pie Chart, Best Streak)

#### Use case: UC03 - View Habit Overview Statistics
Actor: Self  
MSS:  
1. Tap on the Stats button on the Bottom Navigation Bar
2. View overall statistics about user’s habit completion rates (Calendar Heatmap, Bar Graph, Best Streaks)

#### Use case: UC04 - Edit a Habit
Actor: Self  
MSS:  
1. Tap on a habit’s edit button
2. Edit the name, description, and frequency of habit

#### Use case UC05 - Delete a Habit
Actor: Self  
MSS:  
1. Tap on a habit’s edit button
2. Tap on the delete button
Extensions
  2a. Confirmation of delete

#### Use case UC06 - Complete a Habit
Actor: Self  
MSS:  
1. Tap the checkbox beside a habit to mark it as complete for the day
Extensions:  
  1a. Ability to mark habit as skipped by swiping left

#### Use case UC07 - Create An Account
Actor: Self  
MSS:  
1. Type in a unique Username and type in a password
2. Tap the ‘CREATE’ button to create an account
3. User is logged into the app and can now use its features

#### Use case UC08 - Edit Account Settings
Actor: Self  
MSS:  
1. Tap the settings button on the homepage
2. Tap on the Account button on the Settings page
3. Type in a new Username and Bio and/or tap on the edit profile picture button and upload a new profile picture
4. Tap on the Save Changes button

#### Use case UC09 - Delete Account
Actor: Self  
MSS:  
1. Tap the settings button on the homepage
2. Tap on the Account button on the Settings page
3. Tap on the Delete Account button

#### Use case UC10 - Toggle Notification Types
Actor: Self  
MSS:  
1. Tap the settings button on the homepage
2. Tap on the Notifications button on the Settings page
3. For each type of app notification, toggle on/off using its checkbox
4. Users will only receive notifications for the types that are enabled

#### Use case UC11 - Add Friends
Actor: Self  
MSS:  
1. Tap the Social button on the Bottom Navigation Bar
2. Tap the Add Friends button on the Social page
3. Search for a username
4. Tap on the username
5. Tap on send friend request/accept friend request

#### Use case UC12 - Select Preset Habit To Compete With Friend
Actor: Self  
MSS:  
1. Tap the Social button on the Bottom Navigation Bar
2. Tap the Preset Habits button on the Social page
3. Search for a Preset Habit
4. Tap on the Habit
5. Select a friend’s username to compete with

#### Use case UC13 - View Preset Habit Completion Rate Against Friends
Actor: Self  
MSS:  
1. Tap the Social button on the Bottom Navigation Bar
2. Tap the Friends Leaderboard button on the Social page
3. View your habit completion rate against your friends 

## Timeline

### Milestone 1
Technical proof of concept (i.e., a minimal working system with both the frontend and the backend integrated for a very simple feature)

- Implement habit creation (with frequency and optional duration).
- Allow habit completion tracking for a day.
- Basic data storage for habits and completion status.

### Milestone 2
Prototype (i.e., a working system with the core features)

- Implement habit editing and habit deletion features.
- Develop the statistics page (daily/weekly/monthly views, bar/line graphs, calendar view).
- Build custom notifications for habits and task deadlines.
- UI/UX: Design the interface for habit lists, statistics, and calendar view.

### Milestone 3
Extended system (i.e., a  working system with both the core + extension features)

- Implement social features for friends to compete in tracking habits (e.g., exercise).
- UI/UX: Refine user interface and ensure smooth interaction with notifications, tasks, and leaderboard.
- Testing to ensure that it is user-friendly and bug-free

### Setup Instructions

#### Preview 
2 Main Ways:
1. Download the apk file here:
https://expo.dev/artifacts/eas/3x4FmKaPceFdwhaswwJfSi.apk

2. Go to the link and click install. Follow the instructions provided there.
https://expo.dev/accounts/pohanson/projects/HabiTrack/builds/148899e7-f578-4b38-9e13-1b50b064538d

#### Development
1. Follow the instructions on the website and download npm:
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
2. Download Expo Go on your phone
3. Ensure you have git installed: https://git-scm.com/downloads
4. Open the terminal, run `git clone https://github.com/pohanson/HabiTrack.git`
5. Then `cd HabiTrack/HabiTrack; npm install` to install all the packages we used
6. Run `npm run start` to start the development build.
7. Scan the QR code in the terminal using the Expo Go app to see it. 

## Tech Stack

### React Native

It allows us to have cross-platform app development with a single codebase, thus helping us to reach both IOS and Android users. While there are drawbacks of cross-platform development such as not being as performant, we believe that the benefits outweighs this drawback as our app is not resource intensive for modern standard.

#### Expo

https://docs.expo.dev/

The Expo framework has many useful feature to simplify and speed up the development process when using React Native such as Expo Router and hot reload. There is also a mobile app that could be downloaded that allows us to easily test the app on our device. This has led us to discover the importance of testing on actual devices. The Android emulator is very different from actual app as it uses physical keyboard and mouse for the input. However, for the actual app, we would be using our fingers which are not as precise as a mouse, leading to issues with the buttons.

#### Expo SQLite

https://docs.expo.dev/versions/latest/sdk/sqlite/  

Initially, we used [powersync](https://www.powersync.com/) because it can sync the local database with the cloud database. This allows the user to use the app without internet connection, yet store everything on the cloud when needed. However, there are some issues with the installation, leading us to find other alternatives.

We used Expo SQLite because it is in the official documentation for Expo, which means that the developer of Expo have tested it to make sure it works. To adhere to DRY principle, that is to avoid repeating code, we decided to utilise [Drizzle ORM](https://orm.drizzle.team/) to help with the database migration. Another benefit of Object Relational Mapper (ORM) is that it can help handle the database operations easily, allowing us to quickly develop our app without manually coding serializer and deserializer which might be error prone due to duplication of the types.

### Git

#### Husky

https://typicode.github.io/husky/  

We used husky for pre-commit hooks so we can upload the pre-commit hook into the repository so that collaborators can have the same check. The pre-commit hook performs linting and formatting so that our code will look neat.
