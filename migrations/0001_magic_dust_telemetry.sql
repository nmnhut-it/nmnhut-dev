CREATE TABLE IF NOT EXISTS magic_dust_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL UNIQUE,
  received_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  created_at TEXT,
  event_type TEXT NOT NULL,
  student_id TEXT,
  student_name TEXT,
  class_id TEXT,
  anon_id TEXT,
  session_id TEXT,
  course_id TEXT,
  course_kind TEXT,
  node_index INTEGER,
  node_title TEXT,
  side_island_id TEXT,
  total_cells INTEGER,
  cell_index INTEGER,
  cell_kind TEXT,
  cell_label TEXT,
  duration_ms INTEGER,
  frontier INTEGER,
  version TEXT,
  href TEXT,
  path TEXT,
  user_agent TEXT,
  payload TEXT
);

CREATE INDEX IF NOT EXISTS idx_magic_dust_events_student
  ON magic_dust_events(class_id, student_id, received_at);

CREATE INDEX IF NOT EXISTS idx_magic_dust_events_course
  ON magic_dust_events(course_id, event_type, received_at);

CREATE INDEX IF NOT EXISTS idx_magic_dust_events_type
  ON magic_dust_events(event_type, received_at);
