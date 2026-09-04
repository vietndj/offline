import 'dotenv/config';
import { google, sheets_v4 } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface RegistrationPayload {
  fullName: string;
  phone: string;
  email?: string;
  occupation?: string;
  reason?: string;
  source?: string;
  submittedAt: string;
}

export interface SpreadsheetConfig {
  primaryId: string;
  primaryName: string;
  masterId: string;
  masterName: string;
}

export interface AppendResult {
  primarySuccess: boolean;
  masterSuccess: boolean;
  primaryError?: string;
  masterError?: string;
}

const DEFAULT_TELEGRAM_BOT_TOKEN = "8964853536:AAHuRNm_hY-YQtveBD1HlmthN4I5xpVzM8U";
const DEFAULT_TELEGRAM_CHAT_ID = "2050406425";
const DEFAULT_GOOGLE_CLIENT_EMAIL = "form-feedback-offline@vietndj-git-cms.iam.gserviceaccount.com";

// SỔ CON (Primary Sheet làm việc chính, dùng chung với đối tác/quản lý)
const DEFAULT_PRIMARY_SPREADSHEET_ID = "1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg";
const DEFAULT_PRIMARY_SHEET_NAME = "Danh Sách Học Viên";

// SỔ MẸ (Két Sắt Bảo Hiểm Tự Động - kho lưu trữ tích lũy toàn bộ dữ liệu)
const DEFAULT_MASTER_SPREADSHEET_ID = "1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04";
const DEFAULT_MASTER_SHEET_NAME = "Offline FEDU";

const DEFAULT_GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDTkXmjGxkiIuCC\nD3z0pKQE0lIJewMjIWfu5oPT12wxOB7SNZw+PHURG4suLaKD7lNAYGe9J4AB3reu\nTc0u7lbYoLsydxRa3WQ8NALYcEldWc7NnQvtd7bz6VEbPfKwjCLE5btg7B30FKKw\nFz26wnmvaBDOudopx6dI69GHa2Paj0BRTj2JZ92OjU1OPb+ONULe2UGBnuxLSK8N\nu3qIM1ooQFB2D2irtXoPvD6DJmO6HmjIjoO2rSrWqusX9qwVwnbfMDL7BmeG/0rZ\nE3QI+VjU6geWyUJ/XVWgUVtM8EA9IihM1DkDif2yatPfJ3E6iv5TDYOsHo3rQXWt\nob1fHk7rAgMBAAECggEAGPmk4tDJnEKCv0fFx/mBlUIgxha77ZM9ejHDIShekMbf\nuI/0lFI9vZnDSd3AQBPLxx86T9WQYmggxdZQYPhozyTWRGRTRlC5SvQW2+cRehAm\nfhZKeKt3sP57gRxEgHvihNzbzFrDRHOFKwVrV5cqlz7RMR42d1Um1dBkyTgvrvag\nLXUrgqhPfN8U9ILSJDFXJF2o0bSJuiqhLiWWshp4rF857ngg2HDVO14Mp7Mk85tb\nKOsUr+UUEuPMtTP1jJrO2m3shesTSeVG1J81bDtoeXUDHaloYTmoGyMMjwje0lou\nCIiXmlHQF3z9UVYa3WgwF03vQ+542MacOnTa6jlZxQKBgQD0ZZO0ohr4rSwyJn0O\n9ce7B3GfJR4RKg/xRoNGaYPlIrfYgKEU4GirWTtFhL0UlsFVWBZJqSYt6j7Antvo\nFWfWsO7nn8ptbgWWwgHGtzFjAs7AKjzcbdf8SFJRG/kizSvQffuDxXAZSxU5c3lb\n2fEowhYkuFZw+ep3noCYJaZDDQKBgQDdnOWiq3JY1oHJwEV9uCDqm6JtyTVY2Rth\nDRi1DF1V2yoveAStanTfpfdRYp09HMS83fkCWMgPcDlJdi/m18pfJrOOK4xpYT3Y\nOkaA6i6l3QsQAly2/EJp6XzGYyYCFMhzewrNM9zT5fu4jgNqawGFgWnG5F7YSh8W\nPuAciSg71wKBgBPA1gRmicmJraXMCJWZ9e++9UcIp/p5LNqyeU/KnXd6q+Na2iom\nzS70Ql8nEGVGng+40+xWOJjDcxj8fgevGzp2CIk+GA1qNBdwTNZz3hEDnBRaFZs3\nYZqpecXGfgd7D8yFMjv/TEUvFWMUWz26Ssyhi0qif5IYEQRkEj655EtNAoGAN4jE\nxuHd0sNWXN9wypNktEXyCz77vlsRkF1+zofdr9EvHhweV/KwfQcTFfL3YkQeTRH2\n/46N+8hsoqsaT+fNj9Cb+EmTcyjqHZBk8JM+w1PEHOvqnfRTFEVtfi2EbcsVfFLe\nHxQbB4K/dL0pv/Y2uGT4w92gouTYK3PwJ1Z7nZsCgYA1lXF3fW+0sDX7A8AgaDQ3\nAVlY6JMYbOUGI4qEHmAcdycykGeMAafBxicmbrWGEa6QF6pZ8m+9RQUH9cfASd4X\nY6mNtQ5COwZ/6hD6JIL2n/Fk/Kl+pRjjctfcZMPwam9hn6FDybCwuDP5RjD1xg40\nrnev+mxuY6JF6giGE0oJbw==\n-----END PRIVATE KEY-----\n";

export function getSpreadsheetConfig(): SpreadsheetConfig {
  // 1. SỔ CON (Primary Sheet làm việc chính, dùng chung với đối tác/quản lý)
  let primaryId = process.env.PRIMARY_SPREADSHEET_ID;
  if (!primaryId) {
    if (process.env.GOOGLE_SPREADSHEET_ID && process.env.GOOGLE_SPREADSHEET_ID !== DEFAULT_MASTER_SPREADSHEET_ID) {
      primaryId = process.env.GOOGLE_SPREADSHEET_ID;
    } else {
      primaryId = DEFAULT_PRIMARY_SPREADSHEET_ID;
    }
  }

  const primaryName = process.env.PRIMARY_SHEET_NAME ||
    (process.env.GOOGLE_SHEET_NAME && process.env.GOOGLE_SHEET_NAME !== DEFAULT_MASTER_SHEET_NAME
      ? process.env.GOOGLE_SHEET_NAME
      : DEFAULT_PRIMARY_SHEET_NAME);

  // 2. SỔ MẸ (Két Sắt Bảo Hiểm Tự Động - kho lưu trữ tích lũy toàn bộ dữ liệu)
  let masterId = process.env.MASTER_SPREADSHEET_ID || process.env.GOOGLE_MASTER_SPREADSHEET_ID;
  if (!masterId) {
    if (process.env.GOOGLE_SPREADSHEET_ID === DEFAULT_MASTER_SPREADSHEET_ID) {
      masterId = process.env.GOOGLE_SPREADSHEET_ID;
    } else {
      masterId = DEFAULT_MASTER_SPREADSHEET_ID;
    }
  }

  const masterName = process.env.MASTER_SHEET_NAME || DEFAULT_MASTER_SHEET_NAME;

  return {
    primaryId,
    primaryName,
    masterId,
    masterName,
  };
}

function getGoogleSheetsClient(): sheets_v4.Sheets | null {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL || DEFAULT_GOOGLE_CLIENT_EMAIL;
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || DEFAULT_GOOGLE_PRIVATE_KEY).replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    console.warn('[Google Sheets] Missing Google Service Account private key or email');
    return null;
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return google.sheets({ version: 'v4', auth });
  } catch (e: unknown) {
    const err = e instanceof Error ? e.message : String(e);
    console.error('[Google Sheets] Auth initialization error:', err);
    return null;
  }
}

async function appendToGoogleSheet(
  data: RegistrationPayload,
  config: SpreadsheetConfig
): Promise<AppendResult> {
  const sheets = getGoogleSheetsClient();
  if (!sheets) {
    console.warn('[Google Sheets] Client not ready');
    return {
      primarySuccess: false,
      masterSuccess: false,
      primaryError: 'Google Sheets client unconfigured',
      masterError: 'Google Sheets client unconfigured',
    };
  }

  const rowValues = [
    data.submittedAt,
    data.fullName,
    data.phone,
    data.email || '',
    data.occupation || 'Chưa điền',
    data.reason || 'Chưa điền',
    data.source || 'offline.fedu.vn',
  ];

  const result: AppendResult = {
    primarySuccess: false,
    masterSuccess: false,
  };

  const executeAppend = async (spreadsheetId: string, sheetName: string): Promise<boolean> => {
    const appendPromise = sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${sheetName}'!A:G`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [rowValues] },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout appending to sheet ${spreadsheetId} after 7000ms`)), 7000)
    );

    await Promise.race([appendPromise, timeoutPromise]);
    return true;
  };

  // 1. Ghi vào SỔ CON (Làm việc chính: "Danh Sách Học Viên")
  const primaryPromise = executeAppend(config.primaryId, config.primaryName)
    .then(() => {
      console.log(`[Google Sheets] Successfully appended to Primary Sheet (${config.primaryName}) [ID: ${config.primaryId}]`);
      result.primarySuccess = true;
    })
    .catch((e: unknown) => {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[Google Sheets] Error appending to Primary Sheet (${config.primaryName}):`, msg);
      result.primaryError = msg;
    });

  // 2. Ghi đồng thời vào SỔ MẸ (Két Sắt Bảo Hiểm: "Offline FEDU")
  const masterPromise = (async () => {
    if (config.masterId && config.masterId !== config.primaryId) {
      try {
        await executeAppend(config.masterId, config.masterName);
        console.log(`[Google Sheets] Successfully appended to Backup Master Sheet (${config.masterName}) [ID: ${config.masterId}]`);
        result.masterSuccess = true;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`[Google Sheets] Error appending to Backup Master Sheet (${config.masterName}):`, msg);
        result.masterError = msg;
      }
    } else if (config.masterId === config.primaryId) {
      result.masterSuccess = result.primarySuccess;
    }
  })();

  await Promise.allSettled([primaryPromise, masterPromise]);
  return result;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function dispatchToTelegramNova(
  data: RegistrationPayload,
  config: SpreadsheetConfig
): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('[Telegram] Missing bot token or chat ID');
    return { success: false, error: 'Telegram unconfigured' };
  }

  try {
    const cleanPhone = data.phone.replace(/[^\d+]/g, '');
    const primaryUrl = `https://docs.google.com/spreadsheets/d/${config.primaryId}/edit`;
    const masterUrl = `https://docs.google.com/spreadsheets/d/${config.masterId}/edit`;

    const text =
      `🔥 <b>HỌC VIÊN ĐĂNG KÝ KHÓA OFFLINE FEDU!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 <b>Họ tên:</b> <b>${escapeHtml(data.fullName)}</b>\n` +
      `📞 <b>Điện thoại:</b> <a href="tel:${cleanPhone}"><b>${escapeHtml(data.phone)}</b></a> | <a href="https://zalo.me/${cleanPhone}"><b>Nhắn Zalo</b></a>\n` +
      `📧 <b>Email:</b> ${escapeHtml(data.email || 'Chưa điền')}\n` +
      `💼 <b>Nghề nghiệp / Lĩnh vực:</b> ${escapeHtml(data.occupation || 'Chưa điền')}\n` +
      `🎯 <b>Nút thắt cần giải quyết:</b>\n<i>"${escapeHtml(data.reason || 'Chưa điền')}"</i>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📊 <a href="${primaryUrl}"><b>Mở Google Sheet Quản Lý (Sổ Con)</b></a>\n` +
      `📦 <a href="${masterUrl}"><b>Mở Két Sắt Dữ Liệu (Sổ Mẹ)</b></a>\n` +
      `🏷️ <b>Nguồn:</b> <code>${escapeHtml(data.source || 'offline.fedu.vn')}</code>\n` +
      `⏰ <i>${escapeHtml(data.submittedAt)}</i>`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Telegram] HTTP error ${res.status}:`, errText);
      return { success: false, error: `Telegram HTTP ${res.status}: ${errText}` };
    }

    console.log('[Telegram] Dispatched alert to Telegram successfully!');
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[Telegram] Dispatch error:', msg);
    return { success: false, error: msg };
  }
}

export default async function handler(
  req: VercelRequest | any,
  res: VercelResponse | any
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sheetConfig = getSpreadsheetConfig();

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'healthy',
      service: 'offline.fedu.vn registration API',
      primarySheet: `https://docs.google.com/spreadsheets/d/${sheetConfig.primaryId}/edit`,
      masterSheet: `https://docs.google.com/spreadsheets/d/${sheetConfig.masterId}/edit`,
      sheet: `https://docs.google.com/spreadsheets/d/${sheetConfig.primaryId}/edit`,
    });
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({
            success: false,
            error: 'Dữ liệu gửi lên không đúng định dạng JSON',
          });
        }
      }

      if (!body || typeof body !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Thiếu dữ liệu đăng ký',
        });
      }

      const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
      const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
      const email = typeof body.email === 'string' ? body.email.trim() : '';
      const occupation = typeof body.occupation === 'string' ? body.occupation.trim() : '';
      const reason = typeof body.reason === 'string' ? body.reason.trim() : '';
      const source = typeof body.source === 'string' ? body.source.trim() : 'offline.fedu.vn';

      if (!fullName || !phone) {
        return res.status(400).json({
          success: false,
          error: 'Thiếu họ tên hoặc số điện thoại',
        });
      }

      // Kiểm tra định dạng số điện thoại (tối thiểu 9 số, tối đa 15 số)
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 9 || phoneDigits.length > 15) {
        return res.status(400).json({
          success: false,
          error: 'Số điện thoại không hợp lệ (cần từ 9 đến 15 chữ số)',
        });
      }

      const submission: RegistrationPayload = {
        fullName,
        phone,
        email,
        occupation,
        reason,
        source,
        submittedAt: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      };

      const [sheetsSettled, telegramSettled] = await Promise.allSettled([
        appendToGoogleSheet(submission, sheetConfig),
        dispatchToTelegramNova(submission, sheetConfig),
      ]);

      const sheetsResult = sheetsSettled.status === 'fulfilled' ? sheetsSettled.value : null;
      const telegramResult = telegramSettled.status === 'fulfilled' ? telegramSettled.value : null;

      // Kiểm tra nếu cả hai sổ đều bị lỗi nghiêm trọng
      if (sheetsResult && !sheetsResult.primarySuccess && !sheetsResult.masterSuccess) {
        console.error('[API Register] Both Primary and Master sheets failed to append:', {
          primaryError: sheetsResult.primaryError,
          masterError: sheetsResult.masterError,
        });
        return res.status(500).json({
          success: false,
          error: 'Lỗi đồng bộ dữ liệu vào hệ thống lưu trữ Google Sheets. Vui lòng thử lại.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Đăng ký giữ chỗ thành công!',
        item: submission,
        sync: {
          primarySheet: sheetsResult ? sheetsResult.primarySuccess : false,
          masterSheet: sheetsResult ? sheetsResult.masterSuccess : false,
          telegram: telegramResult ? telegramResult.success : false,
        },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[API Register] Unhandled exception:', msg);
      return res.status(500).json({
        success: false,
        error: `Lỗi xử lý máy chủ: ${msg}`,
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method Not Allowed',
  });
}
