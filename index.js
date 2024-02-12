const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

require('dotenv').config()
const spreadsheetId = process.env.GOOGLE_SPREADSHEETSID
const spreadsheetRange = process.env.SPREADSHEETS_RANGE

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */

async function showStudentsData(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: spreadsheetRange,
    });
    const rows = res.data.values;
    if (!rows) {
        console.log('No data found.');
        return;
    }

    console.log('PLANILHA ORIGINAL')

    for (let i = 3; i < rows.length; i++) {
        const absences = parseInt(rows[i][2]);
        const exam1 = parseInt(rows[i][3]);
        const exam2 = parseInt(rows[i][4]);
        const exam3 = parseInt(rows[i][5]);

        let avg = parseInt((exam1 + exam2 + exam3) / 3)

        const totalClasses = 60
        let AbsencePorcentage = (absences / totalClasses) * 100

        let finalAprovalScore
        let status

        if (AbsencePorcentage > 25) {
            status = 'Reprovado por Falta'
            rows[i][6] = status
        } else if (avg < 50) {
            status = 'Reprovado por Nota'
            rows[i][6] = status
        } else if (avg >=50 && avg < 70) {
            status = 'Exame Final'
            rows[i][6] = status
        } else {
            status = 'Aprovado'
            rows[i][6] = status
        }

        if (status === 'Exame Final') {
            finalAprovalScore = Math.abs((50 * 2) - avg)
            rows[i][7] = finalAprovalScore
        } else {
            finalAprovalScore = 0
            rows[i][7] = finalAprovalScore
        }

        console.log('Estudante: ' + rows[i][1] + ', Faltas: ' + absences + ', Situação Final: ' + ' ' + ' Nota para Aprovação Final: ' + ' ' + '\n')
    }

    try {
        await sheets.spreadsheets.values.update({
            auth: auth,
            spreadsheetId: spreadsheetId,
            range: spreadsheetRange,
            valueInputOption: 'RAW',
            resource: { values: rows },
        })
        console.log('Data Updated!' + '\n')
    } catch (error) {
        console.error('Erro' + error)
    } finally {
        const sheets = google.sheets({ version: 'v4', auth });
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: spreadsheetRange,
        });
        const rows = res.data.values;

        console.log('TABELA ATUALIZADA')
        for (let i = 3; i < rows.length; i++) {
            console.log('Estudante: ' + rows[i] + '\n')
        }
    }
}

authorize().then(showStudentsData).catch(console.error);