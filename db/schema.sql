-- 在 Cloudflare D1 的 Console 里执行一次即可
CREATE TABLE IF NOT EXISTS comments (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	path TEXT NOT NULL,
	name TEXT NOT NULL,
	content TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	ip_hash TEXT,
	status TEXT NOT NULL DEFAULT 'approved'
);

CREATE INDEX IF NOT EXISTS idx_comments_path ON comments (path, status, created_at);
