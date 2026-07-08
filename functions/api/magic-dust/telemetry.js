const MAX_EVENTS = 50;
const MAX_BODY_BYTES = 128 * 1024;

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type,x-telemetry-token',
  'access-control-max-age': '86400',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function text(value, max = 256) {
  if (value == null) return null;
  const s = String(value).trim();
  return s ? s.slice(0, max) : null;
}

function intValue(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function boolValue(value) {
  if (value == null) return null;
  return value ? 1 : 0;
}

function safeJson(value) {
  try {
    return JSON.stringify(value).slice(0, 8192);
  } catch {
    return '{}';
  }
}

function normalizeEvent(raw, request) {
  if (!raw || typeof raw !== 'object') return null;
  const eventType = text(raw.eventType || raw.type, 80);
  if (!eventType) return null;

  return {
    event_id: text(raw.id || raw.eventId, 160) || crypto.randomUUID(),
    created_at: text(raw.createdAt || raw.created_at, 80),
    event_type: eventType,
    student_id: text(raw.studentId || raw.student_id, 160),
    student_name: text(raw.studentName || raw.student_name, 160),
    class_id: text(raw.classId || raw.class_id, 160),
    anon_id: text(raw.anonId || raw.anon_id, 160),
    session_id: text(raw.sessionId || raw.session_id, 160),
    course_id: text(raw.courseId || raw.course_id, 160),
    course_kind: text(raw.courseKind || raw.course_kind, 40),
    node_index: intValue(raw.nodeIndex ?? raw.node_index),
    node_title: text(raw.nodeTitle || raw.node_title, 240),
    side_island_id: text(raw.sideIslandId || raw.side_island_id, 160),
    total_cells: intValue(raw.totalCells ?? raw.total_cells),
    cell_index: intValue(raw.cellIndex ?? raw.cell_index),
    cell_kind: text(raw.cellKind || raw.cell_kind, 40),
    cell_label: text(raw.cellLabel || raw.cell_label, 240),
    duration_ms: intValue(raw.durationMs ?? raw.duration_ms),
    frontier: intValue(raw.frontier),
    version: text(raw.version, 120),
    href: text(raw.href, 1024),
    path: text(raw.path, 512),
    user_agent: text(request.headers.get('user-agent'), 512),
    payload: safeJson(raw),
  };
}

function insertStatement(db, event) {
  return db.prepare(`
    INSERT OR IGNORE INTO magic_dust_events (
      event_id, created_at, event_type, student_id, student_name, class_id,
      anon_id, session_id, course_id, course_kind, node_index, node_title,
      side_island_id, total_cells, cell_index, cell_kind, cell_label,
      duration_ms, frontier, version, href, path, user_agent, payload
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?
    )
  `).bind(
    event.event_id, event.created_at, event.event_type, event.student_id, event.student_name, event.class_id,
    event.anon_id, event.session_id, event.course_id, event.course_kind, event.node_index, event.node_title,
    event.side_island_id, event.total_cells, event.cell_index, event.cell_kind, event.cell_label,
    event.duration_ms, event.frontier, event.version, event.href, event.path, event.user_agent, event.payload,
  );
}

async function handlePost(request, env) {
  const db = env.magic_dust_telemetry;
  if (!db) return json({ ok: false, error: 'missing D1 binding' }, 500);

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) return json({ ok: false, error: 'payload too large' }, 413);

  let data;
  try {
    data = JSON.parse(rawBody || '{}');
  } catch {
    return json({ ok: false, error: 'invalid json' }, 400);
  }

  const incoming = Array.isArray(data.events) ? data.events : [data];
  const events = incoming.slice(0, MAX_EVENTS).map(item => normalizeEvent(item, request)).filter(Boolean);
  if (!events.length) return json({ ok: false, error: 'no valid events' }, 400);

  await db.batch(events.map(event => insertStatement(db, event)));
  return json({ ok: true, accepted: events.length });
}

async function handleGet(request, env) {
  const db = env.magic_dust_telemetry;
  if (!db) return json({ ok: false, error: 'missing D1 binding' }, 500);

  const url = new URL(request.url);
  const expectedToken = env.MAGIC_DUST_TELEMETRY_TOKEN;
  const token = url.searchParams.get('token') || request.headers.get('x-telemetry-token');
  if (!expectedToken || token !== expectedToken) return json({ ok: false, error: 'forbidden' }, 403);

  const classFilter = text(url.searchParams.get('class') || url.searchParams.get('class_id'), 160);
  const limit = Math.min(500, Math.max(1, intValue(url.searchParams.get('limit')) || 100));

  const students = await db.prepare(`
    SELECT
      COALESCE(class_id, '') AS class_id,
      COALESCE(student_id, '') AS student_id,
      MAX(COALESCE(student_name, '')) AS student_name,
      COUNT(*) AS event_count,
      MAX(received_at) AS last_seen,
      COUNT(DISTINCT course_id) AS courses_seen,
      COUNT(DISTINCT CASE WHEN event_type = 'course_complete' THEN course_id END) AS courses_completed,
      SUM(CASE WHEN event_type = 'cell_complete' THEN COALESCE(duration_ms, 0) ELSE 0 END) AS total_cell_ms,
      AVG(CASE WHEN event_type = 'cell_complete' THEN duration_ms END) AS avg_cell_ms
    FROM magic_dust_events
    WHERE (?1 IS NULL OR class_id = ?1)
    GROUP BY class_id, student_id
    ORDER BY last_seen DESC
    LIMIT ?2
  `).bind(classFilter, limit).all();

  const courses = await db.prepare(`
    SELECT
      COALESCE(class_id, '') AS class_id,
      COALESCE(student_id, '') AS student_id,
      MAX(COALESCE(student_name, '')) AS student_name,
      COALESCE(course_id, '') AS course_id,
      MAX(COALESCE(course_kind, '')) AS course_kind,
      MAX(COALESCE(node_title, '')) AS node_title,
      MAX(total_cells) AS total_cells,
      MAX(frontier) AS frontier,
      COUNT(DISTINCT CASE WHEN event_type = 'cell_complete' THEN cell_index END) AS cells_completed,
      MAX(CASE WHEN event_type = 'course_complete' THEN 1 ELSE 0 END) AS complete,
      SUM(CASE WHEN event_type = 'cell_complete' THEN COALESCE(duration_ms, 0) ELSE 0 END) AS active_cell_ms,
      MAX(received_at) AS last_seen
    FROM magic_dust_events
    WHERE (?1 IS NULL OR class_id = ?1)
      AND course_id IS NOT NULL
    GROUP BY class_id, student_id, course_id
    ORDER BY last_seen DESC
    LIMIT ?2
  `).bind(classFilter, limit).all();

  const recent = await db.prepare(`
    SELECT
      received_at, event_type, class_id, student_id, student_name,
      course_id, course_kind, node_title, cell_index, cell_kind,
      cell_label, duration_ms, frontier, version, path
    FROM magic_dust_events
    WHERE (?1 IS NULL OR class_id = ?1)
    ORDER BY received_at DESC
    LIMIT ?2
  `).bind(classFilter, Math.min(limit, 200)).all();

  return json({
    ok: true,
    class_id: classFilter,
    students: students.results || [],
    courses: courses.results || [],
    recent: recent.results || [],
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method === 'POST') return handlePost(request, env);
  if (request.method === 'GET') return handleGet(request, env);
  return json({ ok: false, error: 'method not allowed' }, 405);
}
