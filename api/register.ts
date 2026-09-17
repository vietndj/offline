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
  url?: string;
  submittedAt: string;
}

export interface SpreadsheetConfig {
  courseId: string;
  courseName: string;
  primaryId: string;
  primaryName: string;
  masterId: string;
  masterName: string;
}

export interface AppendResult {
  courseSuccess: boolean;
  primarySuccess: boolean;
  masterSuccess: boolean;
  courseError?: string;
  primaryError?: string;
  masterError?: string;
}

const DEFAULT_TELEGRAM_BOT_TOKEN = "7991600422:AAHNmZ9ixcQtf_pTVQewadrnYZ0apOEvxgk";
const DEFAULT_TELEGRAM_CHAT_ID = "2050406425";
const DEFAULT_GOOGLE_CLIENT_EMAIL = "form-feedback-offline@vietndj-git-cms.iam.gserviceaccount.com";

// SỔ RIÊNG KHÓA OFFLINE (Bảng [FEDU] Danh Sách Học Viên - Khóa Làm Video Viral (Offline) mà anh Việt theo dõi)
const DEFAULT_COURSE_SPREADSHEET_ID = "1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg";
const DEFAULT_COURSE_SHEET_NAME = "Danh Sách Học Viên";

// SỔ CON ADS/MARKETING TỔNG HỢP (Data - FEDU -> "Offline-VideoEdu")
const DEFAULT_PRIMARY_SPREADSHEET_ID = "1ZYfONTXG2yUAzC-laIOyJT6o-mA1yFbwp99ZIgNWwPE";
const DEFAULT_PRIMARY_SHEET_NAME = "Offline-VideoEdu";

// SỔ MẸ (Két Sắt Bảo Hiểm Tự Động - kho lưu trữ tích lũy toàn bộ dữ liệu)
const DEFAULT_MASTER_SPREADSHEET_ID = "1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04";
const DEFAULT_MASTER_SHEET_NAME = "Offline FEDU";

// CRM DCSO API Config
const DEFAULT_CRM_API_URL = "https://esa.dcso.pro/public-api/leads/createLead";
const DEFAULT_CRM_API_KEY = "b69ddc30-143d-447d-881d-791c4e99f83b";
// Key bổ sung đang hoạt động của videoedu.topexpert.vn trên DCSO
const LEGACY_CRM_API_KEY = "533d7d16-e6da-4ac1-abc3-405d04cfffc2";

const DEFAULT_GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDTkXmjGxkiIuCC\nD3z0pKQE0lIJewMjIWfu5oPT12wxOB7SNZw+PHURG4suLaKD7lNAYGe9J4AB3reu\nTc0u7lbYoLsydxRa3WQ8NALYcEldWc7NnQvtd7bz6VEbPfKwjCLE5btg7B30FKKw\nFz26wnmvaBDOudopx6dI69GHa2Paj0BRTj2JZ92OjU1OPb+ONULe2UGBnuxLSK8N\nu3qIM1ooQFB2D2irtXoPvD6DJmO6HmjIjoO2rSrWqusX9qwVwnbfMDL7BmeG/0rZ\nE3QI+VjU6geWyUJ/XVWgUVtM8EA9IihM1DkDif2yatPfJ3E6iv5TDYOsHo3rQXWt\nob1fHk7rAgMBAAECggEAGPmk4tDJnEKCv0fFx/mBlUIgxha77ZM9ejHDIShekMbf\nuI/0lFI9vZnDSd3AQBPLxx86T9WQYmggxdZQYPhozyTWRGRTRlC5SvQW2+cRehAm\nfhZKeKt3sP57gRxEgHvihNzbzFrDRHOFKwVrV5cqlz7RMR42d1Um1dBkyTgvrvag\nLXUrgqhPfN8U9ILSJDFXJF2o0bSJuiqhLiWWshp4rF857ngg2HDVO14Mp7Mk85tb\nKOsUr+UUEuPMtTP1jJrO2m3shesTSeVG1J81bDtoeXUDHaloYTmoGyMMjwje0lou\nCIiXmlHQF3z9UVYa3WgwF03vQ+542MacOnTa6jlZxQKBgQD0ZZO0ohr4rSwyJn0O\n9ce7B3GfJR4RKg/xRoNGaYPlIrfYgKEU4GirWTtFhL0UlsFVWBZJqSYt6j7Antvo\nFWfWsO7nn8ptbgWWwgHGtzFjAs7AKjzcbdf8SFJRG/kizSvQffuDxXAZSxU5c3lb\n2fEowhYkuFZw+ep3noCYJaZDDQKBgQDdnOWiq3JY1oHJwEV9uCDqm6JtyTVY2Rth\nDRi1DF1V2yoveAStanTfpfdRYp09HMS83fkCWMgPcDlJdi/m18pfJrOOK4xpYT3Y\nOkaA6i6l3QsQAly2/EJp6XzGYyYCFMhzewrNM9zT5fu4jgNqawGFgWnG5F7YSh8W\nPuAciSg71wKBgBPA1gRmicmJraXMCJWZ9e++9UcIp/p5LNqyeU/KnXd6q+Na2iom\nzS70Ql8nEGVGng+40+xWOJjDcxj8fgevGzp2CIk+GA1qNBdwTNZz3hEDnBRaFZs3\nYZqpecXGfgd7D8yFMjv/TEUvFWMUWz26Ssyhi0qif5IYEQRkEj655EtNAoGAN4jE\nxuHd0sNWXN9wypNktEXyCz77vlsRkF1+zofdr9EvHhweV/KwfQcTFfL3YkQeTRH2\n/46N+8hsoqsaT+fNj9Cb+EmTcyjqHZBk8JM+w1PEHOvqnfRTFEVtfi2EbcsVfFLe\nHxQbB4K/dL0pv/Y2uGT4w92gouTYK3PwJ1Z7nZsCgYA1lXF3fW+0sDX7A8AgaDQ3\nAVlY6JMYbOUGI4qEHmAcdycykGeMAafBxicmbrWGEa6QF6pZ8m+9RQUH9cfASd4X\nY6mNtQ5COwZ/6hD6JIL2n/Fk/Kl+pRjjctfcZMPwam9hn6FDybCwuDP5RjD1xg40\nrnev+mxuY6JF6giGE0oJbw==\n-----END PRIVATE KEY-----\n";

/**
 * Định dạng thời gian Việt Nam chuẩn "yyyy-MM-dd HH:mm:ss"
 */
export function formatVietnamTime(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) {
    map[p.type] = p.value;
  }
  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`;
}

/**
 * Chuẩn hóa số điện thoại Việt Nam (10 số, bắt đầu bằng 0)
 */
export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '').trim();
  if (cleaned.startsWith('+84')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('84') && cleaned.length >= 11) {
    cleaned = '0' + cleaned.slice(2);
  } else if (cleaned.length === 9 && !cleaned.startsWith('0')) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
}

/**
 * Phân tách họ và tên tiếng Việt:
 * - LastName: Từ đầu tiên của họ tên
 * - FirstName: Phần còn lại của họ tên
 */
export function splitVietnameseName(fullName: string): { lastName: string; firstName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { lastName: '', firstName: '' };
  }
  if (parts.length === 1) {
    return { lastName: parts[0], firstName: '' };
  }
  const lastName = parts[0];
  const firstName = parts.slice(1).join(' ');
  return { lastName, firstName };
}

export function getSpreadsheetConfig(): SpreadsheetConfig {
  // 1. SỔ RIÊNG KHÓA OFFLINE (Bảng mà anh Việt theo dõi: "[FEDU] Danh Sách Học Viên - Khóa Làm Video Viral (Offline)")
  const courseId = process.env.COURSE_SPREADSHEET_ID || DEFAULT_COURSE_SPREADSHEET_ID;
  const courseName = process.env.COURSE_SHEET_NAME || (courseId === DEFAULT_COURSE_SPREADSHEET_ID ? DEFAULT_COURSE_SHEET_NAME : (process.env.GOOGLE_SHEET_NAME || DEFAULT_COURSE_SHEET_NAME));

  // 2. SỔ CON ADS/MARKETING TỔNG HỢP (Primary Sheet: "Offline-VideoEdu")
  const primaryId = process.env.PRIMARY_SPREADSHEET_ID || DEFAULT_PRIMARY_SPREADSHEET_ID;
  const primaryName = process.env.PRIMARY_SHEET_NAME || DEFAULT_PRIMARY_SHEET_NAME;

  // 3. SỔ MẸ (Két Sắt Bảo Hiểm Tự Động: "Offline FEDU")
  const masterId = process.env.MASTER_SPREADSHEET_ID || DEFAULT_MASTER_SPREADSHEET_ID;
  const masterName = process.env.MASTER_SHEET_NAME || DEFAULT_MASTER_SHEET_NAME;

  return {
    courseId,
    courseName,
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

export function evaluateDirectSubmission(data: RegistrationPayload): {
  isDirect: boolean;
  warningText: string;
  courseSource: string;
  courseStatus: string;
  masterStatus: string;
  telegramBadge: string;
  telegramAlertBlock: string;
} {
  const url = data.url || (data.source && data.source.startsWith('http') ? data.source : 'https://offline.fedu.vn');
  const hasAdsTracking = url.includes('utm_') || url.includes('fbclid') || url.includes('gclid') || url.includes('tiktok') || url.includes('zalo');
  const isDirect = !hasAdsTracking;

  const hasNoDetails = (!data.occupation || data.occupation.trim() === '' || data.occupation === 'Chưa điền') &&
                       (!data.reason || data.reason.trim() === '' || data.reason === 'Chưa điền');

  if (isDirect) {
    const hint = hasNoDetails ? 'Không có mã UTM tracking + Bỏ trống nghề nghiệp & nút thắt' : 'Truy cập trực tiếp (Không có mã UTM tracking)';
    return {
      isDirect: true,
      warningText: 'Nghi vấn Sale tự điền sau khi chốt / Truy cập trực tiếp',
      courseSource: `${url} [⚠️ Nghi vấn điền hộ - Check lại]`,
      courseStatus: 'Chờ tư vấn [⚠️ Check nguồn]',
      masterStatus: 'Mới đăng ký [⚠️ Nghi vấn điền hộ]',
      telegramBadge: ' <b>⚠️ (Trực tiếp - Nghi vấn điền hộ)</b>',
      telegramAlertBlock:
        `⚠️ <b>CẢNH BÁO NGUỒN (NGHI VẤN ĐIỀN HỘ):</b>\n` +
        `<code>Khách vào trực tiếp (${hint}). Khả năng cao là Trinh/Sale tự điền sau khi chốt hoặc khách tự gõ web — Anh Việt cần đối soát lại với Sale!</code>\n` +
        `━━━━━━━━━━━━━━━━━━━━\n`,
    };
  }

  return {
    isDirect: false,
    warningText: '',
    courseSource: url,
    courseStatus: 'Chờ tư vấn',
    masterStatus: 'Mới đăng ký',
    telegramBadge: '',
    telegramAlertBlock: '',
  };
}

async function appendToGoogleSheet(
  data: RegistrationPayload,
  config: SpreadsheetConfig
): Promise<AppendResult> {
  const sheets = getGoogleSheetsClient();
  if (!sheets) {
    console.warn('[Google Sheets] Client not ready');
    return {
      courseSuccess: false,
      primarySuccess: false,
      masterSuccess: false,
      courseError: 'Google Sheets client unconfigured',
      primaryError: 'Google Sheets client unconfigured',
      masterError: 'Google Sheets client unconfigured',
    };
  }

  const pageUrl = data.url || (data.source && data.source.startsWith('http') ? data.source : 'https://offline.fedu.vn');
  const directEval = evaluateDirectSubmission(data);

  const normalizedPhone = normalizePhone(data.phone);
  // Thêm dấu nháy đơn ' trước số điện thoại để Google Sheet không tự ý cắt mất số 0 ở đầu
  const sheetPhone = `'${normalizedPhone}`;

  // 1. Format cột cho Sổ Riêng Khóa Offline "[FEDU] Danh Sách Học Viên - Khóa Làm Video Viral (Offline)":
  // Cột A: Thời Gian Đăng Ký
  // Cột B: Họ Và Tên
  // Cột C: Số Điện Thoại / Zalo
  // Cột D: Email
  // Cột E: Ngành Nghề / Lĩnh Vực
  // Cột F: Khó Khăn / Nút Thắt Lớn Nhất
  // Cột G: Nguồn Đăng Ký
  // Cột H: Tình Trạng Liên Hệ
  const courseRowValues = [
    data.submittedAt,
    data.fullName,
    sheetPhone,
    data.email || '',
    data.occupation || 'Chưa điền',
    data.reason || 'Chưa điền',
    directEval.courseSource,
    directEval.courseStatus,
  ];

  // 2. Format cột cho Sổ Con Ads "Offline-VideoEdu":
  // Cột A: Thời gian ("yyyy-MM-dd HH:mm:ss")
  // Cột B: Họ tên
  // Cột C: Số điện thoại
  // Cột D: Email
  // Cột E: Link đăng ký (URL kèm UTM query string)
  // Cột F: Ngành nghề
  // Cột G: Lý do tham gia
  // Cột H: Đã thanh toán
  const primaryRowValues = [
    data.submittedAt,
    data.fullName,
    sheetPhone,
    data.email || '',
    directEval.courseSource,
    data.occupation || '',
    data.reason || '',
    '',
  ];

  // 3. Format cho Sổ Mẹ (Két Sắt Bảo Hiểm "Offline FEDU"):
  const masterRowValues = [
    data.submittedAt,
    data.fullName,
    sheetPhone,
    data.email || '',
    data.occupation || 'Chưa điền',
    data.reason || 'Chưa điền',
    directEval.courseSource,
    directEval.masterStatus,
  ];

  const result: AppendResult = {
    courseSuccess: false,
    primarySuccess: false,
    masterSuccess: false,
  };

  const executeAppend = async (spreadsheetId: string, sheetName: string, values: any[], rangeCol: string): Promise<boolean> => {
    const appendPromise = sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${sheetName}'!${rangeCol}`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [values] },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout appending to sheet ${spreadsheetId} after 7000ms`)), 7000)
    );

    await Promise.race([appendPromise, timeoutPromise]);
    return true;
  };

  // 1. Ghi vào SỔ RIÊNG KHÓA OFFLINE (Bảng chính mà anh Việt mở xem học viên)
  const coursePromise = (async () => {
    if (config.courseId) {
      try {
        await executeAppend(config.courseId, config.courseName, courseRowValues, 'A:H');
        console.log(`[Google Sheets] Successfully appended to Course Sheet (${config.courseName}) [ID: ${config.courseId}]`);
        result.courseSuccess = true;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`[Google Sheets] Error appending to Course Sheet (${config.courseName}):`, msg);
        result.courseError = msg;
      }
    }
  })();

  // 2. Ghi vào SỔ CON ADS/MARKETING ("Offline-VideoEdu")
  const primaryPromise = (async () => {
    if (config.primaryId && config.primaryId !== config.courseId) {
      try {
        await executeAppend(config.primaryId, config.primaryName, primaryRowValues, 'A:H');
        console.log(`[Google Sheets] Successfully appended to Primary Sheet (${config.primaryName}) [ID: ${config.primaryId}]`);
        result.primarySuccess = true;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`[Google Sheets] Error appending to Primary Sheet (${config.primaryName}):`, msg);
        result.primaryError = msg;
      }
    } else if (config.primaryId === config.courseId) {
      result.primarySuccess = result.courseSuccess;
    }
  })();

  // 3. Ghi đồng thời vào SỔ MẸ (Két Sắt Bảo Hiểm: "Offline FEDU")
  const masterPromise = (async () => {
    if (config.masterId && config.masterId !== config.primaryId && config.masterId !== config.courseId) {
      try {
        await executeAppend(config.masterId, config.masterName, masterRowValues, 'A:H');
        console.log(`[Google Sheets] Successfully appended to Backup Master Sheet (${config.masterName}) [ID: ${config.masterId}]`);
        result.masterSuccess = true;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`[Google Sheets] Error appending to Backup Master Sheet (${config.masterName}):`, msg);
        result.masterError = msg;
      }
    } else if (config.masterId === config.primaryId) {
      result.masterSuccess = result.primarySuccess;
    } else if (config.masterId === config.courseId) {
      result.masterSuccess = result.courseSuccess;
    }
  })();

  await Promise.allSettled([coursePromise, primaryPromise, masterPromise]);
  return result;
}

/**
 * Đẩy dữ liệu sang hệ thống CRM DCSO (hỗ trợ cả 2 API Key để đảm bảo đổ về đúng bảng quản lý)
 */
export async function dispatchToCrm(
  data: RegistrationPayload
): Promise<{ success: boolean; data?: any; error?: string }> {
  const primaryApiKey = process.env.CRM_API_KEY || DEFAULT_CRM_API_KEY;
  const legacyApiKey = process.env.LEGACY_CRM_API_KEY || LEGACY_CRM_API_KEY;
  const crmUrl = process.env.CRM_API_URL || DEFAULT_CRM_API_URL;

  const { lastName, firstName } = splitVietnameseName(data.fullName);
  const pageUrl = data.url || (data.source && data.source.startsWith('http') ? data.source : 'https://offline.fedu.vn');
  const normalizedPhone = normalizePhone(data.phone);

  const payload = {
    model: {
      LastName: lastName,
      FirstName: firstName,
      Phone: normalizedPhone,
      email: data.email || '',
      Address: '',
    },
    metas: [
      {
        key: 'Email',
        value: data.email || '',
      },
    ],
    queryString: {
      link: pageUrl,
    },
  };

  const keysToSend = Array.from(new Set([primaryApiKey, legacyApiKey].filter(Boolean)));

  const results = await Promise.allSettled(
    keysToSend.map(async (key) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      try {
        const res = await fetch(crmUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ApiKey: key,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const json = await res.json().catch(() => null);
        if (!res.ok) {
          console.error(`[CRM DCSO] Key ${key.slice(0, 8)} non-OK:`, res.status, json);
          return { success: false, key, error: `HTTP ${res.status}` };
        }
        console.log(`[CRM DCSO] Key ${key.slice(0, 8)} lead created successfully:`, json);
        return { success: true, key, data: json };
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[CRM DCSO] Key ${key.slice(0, 8)} dispatch error:`, msg);
        return { success: false, key, error: msg };
      }
    })
  );

  const anySuccess = results.some((r) => r.status === 'fulfilled' && r.value.success);
  return { success: anySuccess, data: results };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const VN_SURNAMES = new Set([
  'nguyễn', 'nguyen', 'trần', 'tran', 'lê', 'le', 'phạm', 'pham',
  'hoàng', 'hoang', 'huỳnh', 'huynh', 'phan', 'vũ', 'vu', 'võ', 'vo',
  'đặng', 'dang', 'bùi', 'bui', 'đỗ', 'do', 'hồ', 'ho', 'ngô', 'ngo',
  'dương', 'duong', 'lý', 'ly', 'đinh', 'dinh', 'đoàn', 'doan', 'lâm', 'lam',
  'trịnh', 'trinh', 'mai', 'đào', 'cao', 'hà', 'lưu', 'luu', 'lương', 'luong',
  'thái', 'thai', 'châu', 'chau', 'tạ', 'ta', 'phùng', 'phung', 'tô', 'to',
  'vương', 'vuong', 'quách', 'quach', 'la', 'khổng'
]);

const COMPOUND_NAME_TRAILS = new Set([
  'anh', 'linh', 'châu', 'trang', 'phương', 'ngọc', 'nhâm', 'quỳnh',
  'vy', 'nhi', 'my', 'mi', 'hương', 'hường', 'nguyên', 'mai', 'lan',
  'tú', 'khánh', 'bình', 'hân', 'huyền', 'đan', 'dung', 'tiên', 'nga'
]);

const FEMALE_FIRST_NAMES = new Set([
  'lan', 'hương', 'hường', 'hằng', 'mai', 'thảo', 'trang', 'nhung',
  'nga', 'ngân', 'oanh', 'quỳnh', 'yến', 'dung', 'diệp', 'thủy', 'thuỷ',
  'thu', 'trâm', 'hạnh', 'vân', 'huyền', 'ly', 'loan', 'huệ', 'sen',
  'mỹ', 'hiền', 'tuyết', 'liên', 'nhi', 'vy', 'mi', 'mơ', 'bích',
  'diệu', 'hoa', 'hồng', 'chi', 'thùy', 'thúy', 'thuý', 'uyên', 'xuyến',
  'nương', 'khuyên', 'mến', 'thoa', 'lệ', 'quyên', 'quuyên', 'nhâm',
  'đào', 'cúc', 'nhài', 'thắm', 'tươi', 'đan', 'thục', 'phụng', 'kiều',
  'gấm', 'lụa', 'thêu', 'ngà', 'hân', 'hoài', 'trinh', 'châu', 'diễm',
  'phấn', 'mận', 'thược', 'bưởi', 'nhạn', 'cẩm', 'ngát', 'hảo', 'thơm',
  'nết', 'thương', 'nhàn', 'tình', 'dịu', 'hạ', 'băng', 'lam', 'thư',
  'nhẫn', 'bông', 'nguyên', 'giao', 'châm', 'yên', 'trà', 'quyn', 'trân',
  'tho', 'nhuận', 'vi', 'ca', 'thi', 'dơn', 'huyên', 'thuyên', 'nữ'
]);

const MALE_FIRST_NAMES = new Set([
  'dũng', 'cường', 'tuấn', 'hùng', 'hoàng', 'nam', 'hải', 'thắng',
  'thành', 'đức', 'huy', 'quân', 'long', 'toàn', 'sơn', 'tùng', 'phong',
  'trung', 'nghĩa', 'trọng', 'duy', 'việt', 'tân', 'kiên', 'bách', 'đạt',
  'khoa', 'tiến', 'vương', 'quang', 'bảo', 'lâm', 'quốc', 'tấn', 'vinh',
  'khải', 'vũ', 'hiếu', 'đông', 'trường', 'lộc', 'thế', 'quý', 'phúc',
  'nhật', 'triều', 'trí', 'đại', 'luân', 'khang', 'hưng', 'kiệt', 'phát',
  'thịnh', 'tài', 'hiệp', 'thực', 'bính', 'giáp', 'chính', 'lực', 'thông',
  'thái', 'thọ', 'chiến', 'chuẩn', 'định', 'doãn', 'hiển', 'thiện', 'thưởng',
  'hậu', 'triệu', 'quyền', 'sang', 'thao', 'thiệp', 'minh', 'luận', 'tiệp',
  'đăng', 'nhân', 'đoán', 'tuân', 'khôi', 'đô', 'toản', 'vượng', 'hỷ',
  'khoát', 'phi', 'phú', 'bằng', 'chinh', 'thạo', 'thạch', 'tráng', 'nguyên'
]);

const FEMALE_MIDDLE_KEYWORDS = [
  'thị', 'thúy', 'thuý', 'như', 'kim', 'diệu', 'ánh', 'tố', 'bích', 'mỹ',
  'ngọc', 'quỳnh', 'thanh', 'mai', 'thu', 'hồng', 'linh', 'huyền', 'cẩm',
  'kiều', 'bảo', 'phương', 'thảo', 'loan', 'hương'
];

const MALE_MIDDLE_KEYWORDS = [
  'văn', 'hữu', 'đức', 'quang', 'đình', 'tiến', 'trọng', 'công', 'bá',
  'minh', 'thành', 'hoàng', 'quốc', 'duy', 'mạnh', 'việt', 'tuấn', 'khắc',
  'thế', 'ngọc', 'hải', 'xuân', 'chí', 'đại', 'phúc', 'chính'
];

function extractDisplayName(fullName: string): string {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'bạn';
  const cleanParts = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
  if (cleanParts.length === 1) return cleanParts[0];

  if (cleanParts.length === 2) {
    const firstLower = cleanParts[0].toLowerCase();
    if (VN_SURNAMES.has(firstLower)) {
      return cleanParts[1];
    }
    return `${cleanParts[0]} ${cleanParts[1]}`;
  }

  const lastLower = cleanParts[cleanParts.length - 1].toLowerCase();
  const secondLastLower = cleanParts[cleanParts.length - 2].toLowerCase();
  if (COMPOUND_NAME_TRAILS.has(lastLower) && !['văn', 'thị', 'đình', 'hữu'].includes(secondLastLower)) {
    return `${cleanParts[cleanParts.length - 2]} ${cleanParts[cleanParts.length - 1]}`;
  }
  return cleanParts[cleanParts.length - 1];
}

function detectSalutation(fullName: string, occupation = '', email = ''): { pronoun: string; greeting: string; shortName: string } {
  const nameParts = (fullName || '').trim().split(/\s+/).filter(Boolean);
  if (nameParts.length === 0) {
    return { pronoun: 'anh', greeting: 'Chào bạn', shortName: 'bạn' };
  }

  const displayName = extractDisplayName(fullName);
  const partsLower = nameParts.map(p => p.toLowerCase());
  const lastWord = partsLower[partsLower.length - 1];
  const occLower = (occupation || '').toLowerCase();
  const emailLower = (email || '').toLowerCase();

  let gender: 'female' | 'male' | null = null;

  // 1. Từ đệm tuyệt đối
  if (partsLower.includes('thị')) {
    gender = 'female';
  } else if (partsLower.includes('văn') && !partsLower.includes('thị')) {
    gender = 'male';
  }

  // 2. Các tên ghép phổ biến
  if (!gender) {
    if (lastWord === 'anh') {
      const femaleAnh = ['quỳnh', 'lan', 'mai', 'phương', 'vân', 'trâm', 'kim', 'ngọc', 'diệu', 'hà', 'thùy', 'thúy', 'thuý', 'mỹ', 'ngân', 'nhã', 'yến', 'thanh', 'thu', 'kiều', 'hằng'];
      const maleAnh = ['tuấn', 'việt', 'đức', 'hoàng', 'hùng', 'duy', 'minh', 'quang', 'nam', 'thế', 'nhật', 'quốc', 'trung', 'hữu', 'tiến', 'đại', 'vũ', 'công', 'khải'];
      if (partsLower.some(k => femaleAnh.includes(k))) gender = 'female';
      else if (partsLower.some(k => maleAnh.includes(k))) gender = 'male';
    } else if (lastWord === 'linh') {
      const maleLinh = ['tuấn', 'mạnh', 'văn', 'hoàng', 'duy', 'quang', 'tiến', 'đức'];
      if (partsLower.some(k => maleLinh.includes(k))) gender = 'male';
      else gender = 'female';
    } else if (lastWord === 'tú') {
      const femaleTu = ['cẩm', 'ngọc', 'thanh', 'như', 'mai', 'kim', 'thu', 'đan', 'thảo'];
      const maleTu = ['tuấn', 'anh', 'văn', 'đức', 'hoàng', 'minh', 'quang', 'trọng', 'hữu', 'tiến', 'đình', 'mạnh', 'quốc'];
      if (partsLower.some(k => femaleTu.includes(k))) gender = 'female';
      else if (partsLower.some(k => maleTu.includes(k))) gender = 'male';
    } else if (lastWord === 'khánh') {
      const femaleKhanh = ['ngọc', 'mai', 'vân', 'phương', 'huyền'];
      const maleKhanh = ['quốc', 'duy', 'gia', 'đức', 'hoàng', 'nam', 'bảo', 'huy'];
      if (partsLower.some(k => femaleKhanh.includes(k))) gender = 'female';
      else if (partsLower.some(k => maleKhanh.includes(k))) gender = 'male';
    } else if (lastWord === 'bình') {
      const femaleBinh = ['thanh', 'như', 'ngọc', 'thu'];
      const maleBinh = ['đức', 'quang', 'hải', 'quốc', 'thái', 'trọng'];
      if (partsLower.some(k => femaleBinh.includes(k))) gender = 'female';
      else if (partsLower.some(k => maleBinh.includes(k))) gender = 'male';
    } else if (lastWord === 'nhâm') {
      if (partsLower.some(k => ['linh', 'ngọc', 'thu', 'hương', 'mai'].includes(k))) gender = 'female';
    }
  }

  // 3. Tên chính trong từ điển
  if (!gender) {
    if (FEMALE_FIRST_NAMES.has(lastWord)) gender = 'female';
    else if (MALE_FIRST_NAMES.has(lastWord)) gender = 'male';
  }

  // 4. Kiểm tra các từ tố khác
  if (!gender) {
    if (partsLower.some(k => FEMALE_MIDDLE_KEYWORDS.includes(k))) gender = 'female';
    else if (partsLower.some(k => MALE_MIDDLE_KEYWORDS.includes(k))) gender = 'male';
  }

  // 5. Ngành nghề
  if (!gender) {
    const femaleOccs = ['nội trợ', 'noi tro', 'mẹ bỉm', 'me bim', 'chăm con', 'bỉm sữa', 'nội chợ', 'spa', 'thẩm mỹ', 'nail', 'móng', 'nối mi', 'mi', 'mầm non', 'váy', 'đầm', 'mỹ phẩm', 'skincare'];
    const maleOccs = ['cơ khí', 'sửa xe', 'xe máy', 'gara', 'ô tô', 'xây dựng', 'thợ', 'kỹ sư', 'lái xe', 'tài xế', 'hàn xì', 'lập trình', 'developer'];
    if (femaleOccs.some(k => occLower.includes(k))) gender = 'female';
    else if (maleOccs.some(k => occLower.includes(k))) gender = 'male';
  }

  // 6. Email
  if (!gender) {
    if (['mrs', 'miss', 'girl', 'mebe', 'bimbim'].some(k => emailLower.includes(k))) gender = 'female';
    else if (['mr.', 'mr_'].some(k => emailLower.includes(k))) gender = 'male';
  }

  // 7. Fallback
  if (!gender) {
    if (['tú', 'bình', 'khánh', 'minh', 'nguyên'].includes(lastWord)) gender = 'male';
    else if (['linh', 'hà', 'giang', 'an', 'châu', 'dương'].includes(lastWord)) gender = 'female';
    else gender = 'male';
  }

  if (gender === 'female') {
    return { pronoun: 'chị', greeting: `Chào chị ${displayName}`, shortName: displayName };
  }
  return { pronoun: 'anh', greeting: `Chào anh ${displayName}`, shortName: displayName };
}

function generateSuggestedScript(data: RegistrationPayload): string {
  const occ = (data.occupation || '').trim();
  const occLower = occ.toLowerCase();
  const emailLower = (data.email || '').toLowerCase();
  const reasonLower = (data.reason || '').toLowerCase();
  const { pronoun, greeting, shortName } = detectSalutation(data.fullName, occ, emailLower);

  const hasRealOccupation = occ && !occLower.includes('chưa điền') && !occLower.includes('chua dien') && occLower !== 'none';

  // 0. Nhóm Nội trợ / Mẹ bỉm
  if (
    occLower.includes('nội trợ') ||
    occLower.includes('noi tro') ||
    occLower.includes('mẹ bỉm') ||
    occLower.includes('me bim') ||
    occLower.includes('bỉm sữa') ||
    occLower.includes('chăm con')
  ) {
    return `${greeting}, em là Việt bên lớp video offline đây ạ. Thấy mình vừa đăng ký lớp thực chiến tại Hà Nội và có ghi làm bên mảng Nội trợ. Đợt này ${pronoun} đang muốn làm video bán hàng online kiếm thêm thu nhập, hay muốn xây kênh chia sẻ cuộc sống/nấu ăn vậy ạ?`;
  }

  // 1. Nhóm F&B / Nhà hàng / Quán ăn / Ẩm thực / Cà phê
  if (
    occLower.includes('nhà hàng') ||
    occLower.includes('quán ăn') ||
    occLower.includes('quán') ||
    occLower.includes('f&b') ||
    occLower.includes('ẩm thực') ||
    occLower.includes('cà phê') ||
    occLower.includes('cafe') ||
    occLower.includes('đồ uống') ||
    occLower.includes('bếp') ||
    occLower.includes('nấu')
  ) {
    return `${greeting}, em là Việt bên lớp video offline đây ạ. Em thấy mình đăng ký lớp thực chiến 19 - 20/09 tại Hà Nội và có ghi đang làm bên nhà hàng, ẩm thực. Đợt này ${pronoun} đang muốn quay món ăn, không gian để kéo khách tới quán hay muốn tự lên hình chia sẻ câu chuyện làm nghề ạ?`;
  }

  // 2. Nhóm Bất động sản / Nhà đất / Thổ cư
  if (
    reasonLower.includes('sổ') ||
    occLower.includes('bđs') ||
    occLower.includes('bất động sản') ||
    occLower.includes('nhà đất') ||
    occLower.includes('thổ cư') ||
    occLower.includes('đất') ||
    occLower.includes('dự án')
  ) {
    return `${greeting}, em là Việt bên lớp video offline đây ạ. Em thấy mình đăng ký lớp thực chiến 19 - 20/09 tại Hà Nội và có ghi làm bên mảng BĐS. Đợt này ${pronoun} đang đánh mảng dự án hay thổ cư, và đã từng tự quay clip nào chưa hay đang bắt đầu từ số 0 ạ?`;
  }

  // 3. Nhóm Tóc / Salon / Barbershop
  if (
    emailLower.includes('hair') ||
    occLower.includes('tóc') ||
    occLower.includes('salon') ||
    occLower.includes('barber')
  ) {
    return `${greeting}, em là Việt bên lớp video offline đây ạ. Em thấy mình đăng ký lớp thực chiến 19 - 20/09 tại Hà Nội và có ghi làm salon tóc. Đợt này ${pronoun} đang muốn quay mẫu tóc thực tế để kéo khách tới tiệm hay muốn hút học viên học nghề ạ?`;
  }

  // 4. Nhóm Spa / Thẩm mỹ / Mỹ phẩm / Skincare / Nha khoa / Phun xăm
  if (
    occLower.includes('spa') ||
    occLower.includes('thẩm mỹ') ||
    occLower.includes('mỹ phẩm') ||
    occLower.includes('skincare') ||
    occLower.includes('da') ||
    occLower.includes('phun xăm') ||
    occLower.includes('nha khoa') ||
    occLower.includes('clinic')
  ) {
    return `${greeting}, em là Việt bên lớp video offline đây ạ. Em thấy mình đăng ký lớp thực chiến 19 - 20/09 tại Hà Nội và có ghi làm mảng spa, làm đẹp. Đợt này ${pronoun} đang muốn quay cận cảnh quy trình chăm sóc khách hay muốn tự lên hình tư vấn ạ?`;
  }

  // 5. Nhóm Thời trang / May mặc / Phụ kiện
  if (
    occLower.includes('thời trang') ||
    occLower.includes('quần áo') ||
    occLower.includes('váy') ||
    occLower.includes('may mặc') ||
    occLower.includes('phụ kiện')
  ) {
    return `${greeting}, em là Việt bên lớp video offline đây ạ. Em thấy mình đăng ký lớp thực chiến 19 - 20/09 tại Hà Nội và có ghi làm bên thời trang. Đợt này ${pronoun} đang muốn tự quay phối đồ/sản phẩm để kéo khách, hay đang vướng khâu lên kịch bản ạ?`;
  }

  // 6. Nhóm Đào tạo / Bác sĩ / Luật sư / Chuyên gia / Bảo hiểm
  if (
    occLower.includes('đào tạo') ||
    occLower.includes('giáo viên') ||
    occLower.includes('coach') ||
    occLower.includes('bác sĩ') ||
    occLower.includes('luật sư') ||
    occLower.includes('bảo hiểm')
  ) {
    return `${greeting}, em là Việt bên lớp video offline đây ạ. Em thấy mình đăng ký lớp thực chiến 19 - 20/09 tại Hà Nội và có ghi làm bên ${occ}. Đợt này ${pronoun} đang muốn xây kênh chuyên gia để hút khách hàng/học viên, hay đang bắt đầu từ số 0 ạ?`;
  }

  // 7. Có điền nghề nghiệp khác cụ thể
  if (hasRealOccupation) {
    return `${greeting}, em là Việt bên lớp video offline đây ạ. Em thấy mình đăng ký lớp thực chiến 19 - 20/09 tại Hà Nội và có ghi làm bên mảng ${occ}. Đợt này ${pronoun} đã lập kênh để đăng thử video nào chưa hay đang bắt đầu từ số 0 vậy ạ?`;
  }

  // 8. Chưa điền nghề nghiệp
  return `${greeting}, em là Việt bên lớp video offline đây ạ. Em thấy mình vừa đăng ký giữ chỗ lớp thực chiến 2 ngày 19 - 20/09 tại Hà Nội. Không biết đợt này ${pronoun} đã có kênh đăng clip nào chưa, hay đang bắt đầu từ số 0 để làm hình ảnh cho công việc vậy ạ?`;
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
    const courseUrl = `https://docs.google.com/spreadsheets/d/${config.courseId}/edit`;
    const primaryUrl = `https://docs.google.com/spreadsheets/d/${config.primaryId}/edit?gid=652870650#gid=652870650`;
    const masterUrl = `https://docs.google.com/spreadsheets/d/${config.masterId}/edit`;
    const suggestedScript = generateSuggestedScript(data);
    const directEval = evaluateDirectSubmission(data);

    const text =
      `🔥 <b>HỌC VIÊN ĐĂNG KÝ KHÓA OFFLINE FEDU!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 <b>Họ tên:</b> <b>${escapeHtml(data.fullName)}</b>\n` +
      `📞 <b>Điện thoại:</b> <a href="tel:${cleanPhone}"><b>${escapeHtml(data.phone)}</b></a> | <a href="zalo://conversation?phone=${cleanPhone}"><b>Mở App Zalo</b></a> | <a href="https://offline.fedu.vn/zalo?phone=${cleanPhone}">Link 1-chạm</a>\n` +
      `📧 <b>Email:</b> ${escapeHtml(data.email || 'Chưa điền')}\n` +
      `💼 <b>Nghề nghiệp / Lĩnh vực:</b> ${escapeHtml(data.occupation || 'Chưa điền')}\n` +
      `🎯 <b>Nút thắt cần giải quyết:</b>\n<i>"${escapeHtml(data.reason || 'Chưa điền')}"</i>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      directEval.telegramAlertBlock +
      `💡 <b>KỊCH BẢN ĐỀ XUẤT (VIETMAC-VOICE):</b>\n` +
      `<code>${escapeHtml(suggestedScript)}</code>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📊 <a href="${courseUrl}"><b>Mở Google Sheet Khóa Offline (Danh Sách Học Viên)</b></a>\n` +
      `📈 <a href="${primaryUrl}"><b>Mở Sổ Tổng Hợp Ads (Offline-VideoEdu)</b></a>\n` +
      `📦 <a href="${masterUrl}"><b>Mở Két Sắt Dữ Liệu (Sổ Mẹ)</b></a>\n` +
      `🏷️ <b>Nguồn:</b> <code>${escapeHtml(data.source || 'offline.fedu.vn')}</code>${directEval.telegramBadge}\n` +
      `🌐 <b>Link:</b> <a href="${escapeHtml(data.url || 'https://offline.fedu.vn')}">Chi tiết URL</a>\n` +
      `⏰ <i>${escapeHtml(data.submittedAt)}</i>`;

    const replyMarkup = {
      inline_keyboard: [
        [
          { text: '💬 Mở App Zalo (1-chạm)', url: `https://offline.fedu.vn/zalo?phone=${cleanPhone}` }
        ],
        [
          { text: '🚀 DUYỆT GỬI (iMessage + Mail + Danh bạ)', callback_data: `approve:${cleanPhone}` }
        ]
      ]
    };

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
        reply_markup: replyMarkup,
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
      courseSheet: `https://docs.google.com/spreadsheets/d/${sheetConfig.courseId}/edit`,
      primarySheet: `https://docs.google.com/spreadsheets/d/${sheetConfig.primaryId}/edit?gid=652870650#gid=652870650`,
      masterSheet: `https://docs.google.com/spreadsheets/d/${sheetConfig.masterId}/edit`,
      sheet: `https://docs.google.com/spreadsheets/d/${sheetConfig.courseId}/edit`,
      crm: 'https://esa.dcso.pro/public-api/leads/createLead',
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
      const url = typeof body.url === 'string' && body.url.trim() ? body.url.trim() :
                  (typeof body.link === 'string' && body.link.trim() ? body.link.trim() : 'https://offline.fedu.vn');

      if (!fullName || !phone) {
        return res.status(400).json({
          success: false,
          error: 'Thiếu họ tên hoặc số điện thoại',
        });
      }

      // Chuẩn hóa và kiểm tra định dạng số điện thoại (tối thiểu 9 số, tối đa 15 số)
      const normalizedPhone = normalizePhone(phone);
      const phoneDigits = normalizedPhone.replace(/\D/g, '');
      if (phoneDigits.length < 9 || phoneDigits.length > 15) {
        return res.status(400).json({
          success: false,
          error: 'Số điện thoại không hợp lệ (cần từ 9 đến 15 chữ số)',
        });
      }

      const submission: RegistrationPayload = {
        fullName,
        phone: normalizedPhone,
        email,
        occupation,
        reason,
        source,
        url,
        submittedAt: formatVietnamTime(),
      };

      const [sheetsSettled, telegramSettled, crmSettled] = await Promise.allSettled([
        appendToGoogleSheet(submission, sheetConfig),
        dispatchToTelegramNova(submission, sheetConfig),
        dispatchToCrm(submission),
      ]);

      const sheetsResult = sheetsSettled.status === 'fulfilled' ? sheetsSettled.value : null;
      const telegramResult = telegramSettled.status === 'fulfilled' ? telegramSettled.value : null;
      const crmResult = crmSettled.status === 'fulfilled' ? crmSettled.value : null;

      // Kiểm tra nếu cả ba sổ đều bị lỗi nghiêm trọng
      if (sheetsResult && !sheetsResult.primarySuccess && !sheetsResult.courseSuccess && !sheetsResult.masterSuccess) {
        console.error('[API Register] All sheets failed to append:', {
          courseError: sheetsResult.courseError,
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
          courseSheet: sheetsResult ? sheetsResult.courseSuccess : false,
          primarySheet: sheetsResult ? sheetsResult.primarySuccess : false,
          masterSheet: sheetsResult ? sheetsResult.masterSuccess : false,
          telegram: telegramResult ? telegramResult.success : false,
          crm: crmResult ? crmResult.success : false,
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
