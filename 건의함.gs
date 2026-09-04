/**
 * 건의함 — 안내 페이지에서 온 건의를 이 시트에 쌓는다.
 *
 * 붙이는 법
 *   1. 구글 시트를 새로 만든다 (이름은 아무거나, 예: 무무 수업도우미 건의함)
 *   2. 확장 프로그램 → Apps Script → 이 파일 내용을 통째로 붙여넣는다
 *   3. 배포 → 새 배포 → 유형 「웹 앱」
 *        실행 계정      : 나
 *        액세스 권한    : 모든 사용자          ← 이게 「모든 사용자」여야 한다
 *   4. 나온 주소(.../exec) 를 index.html 의 보낼곳 에 넣는다
 *
 * 「모든 사용자」로 두어도 시트가 남에게 보이지는 않는다. 남이 할 수 있는 것은
 * 이 스크립트가 허락한 것 — 줄 하나 더하기 — 뿐이다.
 */

const 머리 = ['받은때', '무엇이 불편한가', '어느 화면', '버전', '화면에 뜬 말', '보낸 곳'];

function doPost (e) {
  try {
    const 것 = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const 무엇 = String(것.무엇 || '').trim();

    // 빈 것과 너무 긴 것은 받지 않는다. 기계가 두드리는 것을 그대로 쌓으면
    // 정작 선생님이 적은 것을 찾지 못한다.
    if (!무엇) return 답({ ok: false, 왜: '내용이 비었습니다' });
    if (무엇.length > 4000) return 답({ ok: false, 왜: '너무 깁니다' });

    const 시트 = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (시트.getLastRow() === 0) {
      시트.appendRow(머리);
      시트.getRange(1, 1, 1, 머리.length).setFontWeight('bold');
      시트.setFrozenRows(1);
    }
    시트.appendRow([
      new Date(),
      무엇,
      String(것.화면 || '').slice(0, 60),
      String(것.버전 || '').slice(0, 20),
      String(것.뜬말 || '').slice(0, 2000),
      (e && e.parameter && e.parameter.from) || ''
    ]);
    return 답({ ok: true });
  } catch (err) {
    return 답({ ok: false, 왜: String(err) });
  }
}

/** 브라우저가 주소를 그냥 열어 볼 때 — 살아 있는지만 알려 준다 */
function doGet () {
  return 답({ ok: true, 무엇: '무무 수업도우미 건의함' });
}

function 답 (것) {
  return ContentService
    .createTextOutput(JSON.stringify(것))
    .setMimeType(ContentService.MimeType.JSON);
}
