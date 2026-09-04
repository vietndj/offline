import 'dotenv/config';
import { google } from 'googleapis';

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function checkSheets() {
  console.log('--- Checking Primary Sheet (1PaHkFMd... - Danh Sách Học Viên) ---');
  const res1 = await sheets.spreadsheets.values.get({
    spreadsheetId: '1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg',
    range: "'Danh Sách Học Viên'!A:G",
  });
  const rows1 = res1.data.values || [];
  console.log('Primary total rows:', rows1.length);
  console.log('Last row in Primary:', rows1[rows1.length - 1]);

  console.log('\n--- Checking Master Sheet (1J9ZrjLx... - Offline FEDU) ---');
  const res2 = await sheets.spreadsheets.values.get({
    spreadsheetId: '1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04',
    range: "'Offline FEDU'!A:G",
  });
  const rows2 = res2.data.values || [];
  console.log('Master total rows:', rows2.length);
  console.log('Last row in Master:', rows2[rows2.length - 1]);
}

checkSheets().catch(console.error);
