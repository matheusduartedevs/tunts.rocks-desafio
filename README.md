# Dev Training Challenge - Tunts.Rocks 🎸

Here's my solution to the challenge posed by Tunts.Rocks.

## The Challenge
You've been tasked with fetching student grade data from a Google Sheets spreadsheet, calculating the average grade, determing each student's status and updating the spreadsheet with this information. You'll need to utilize the Google Sheets API for this task and are free to use any programming languange of your choice.

## Technologies Used
- Node.js

## Setup
This project utilizes the Google Sheets API, so to run it you'll need to follow the setup instructions provided in the [Google Sheets Documentation](https://developers.google.com/sheets/api/quickstart/nodejs?hl=pt-br).

Here's what you'll need to do:
- Enable the Google Sheets API for your project.
- Generate the JSON file of your credentials and place it in project's root directory.
- Copy the link to your Google Sheet document (ensure  it's publicly accesible for editing by anyone with the link).
- Use the link as the spreadsheetId. 

follow the documentation closely to avoid any issues.

## How to Install
1. Clone this repository

```bash
  git clone [link_to_this_repo]
```

2. Install dependecies
```bash
  npm install
```

3. Run the application
```bash
  node .
```

After running the application, you should see the original spreadsheet data displayed twice in the terminal: once with the original data and again with the updated data

Here's the link to my copy of the [spreadsheet](https://docs.google.com/spreadsheets/d/1DZO5km1-v7Gz1Iq9cgdbs0i6IaO4G9jkknVFi7B-14Q/edit#gid=0)
