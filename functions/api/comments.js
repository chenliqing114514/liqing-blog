// Cloudflare Pages Function: /api/comments
// GET  ?path=/blog/xxx/   读取该页面的评论
// POST { path, name, content, website }  发表评论（website 为隐藏的蜜罐字段）

const MAX_NAME = 24;
const MAX_CONTENT = 2000;
const RATE_WINDOW_MIN = 10; // 同一 IP 10 分钟内
const RATE_MAX = 5; // 最多 5 条

function json(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': 'no-store',
		},
	});
}

async function sha256(text) {
	const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

export async function onRequestGet({ request, env }) {
	const path = new URL(request.url).searchParams.get('path') ?? '';
	if (!path.startsWith('/') || path.length > 200) {
		return json({ error: '无效的页面路径' }, 400);
	}
	const { results } = await env.DB.prepare(
		"SELECT id, name, content, created_at FROM comments WHERE path = ? AND status = 'approved' ORDER BY id DESC LIMIT 200",
	)
		.bind(path)
		.all();
	return json({ comments: results });
}

export async function onRequestPost({ request, env }) {
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: '请求格式错误' }, 400);
	}

	const path = String(body.path ?? '');
	const name = String(body.name ?? '').trim();
	const content = String(body.content ?? '').trim();
	const honeypot = String(body.website ?? '');

	if (honeypot) return json({ error: '提交失败，请稍后再试' }, 400);
	if (!path.startsWith('/') || path.length > 200) return json({ error: '无效的页面路径' }, 400);
	if (!name || name.length > MAX_NAME) return json({ error: `昵称需在 1-${MAX_NAME} 字之间` }, 400);
	if (!content || content.length > MAX_CONTENT) {
		return json({ error: `内容需在 1-${MAX_CONTENT} 字之间` }, 400);
	}

	const ip = request.headers.get('CF-Connecting-IP') ?? '';
	const ipHash = await sha256(ip);

	const recent = await env.DB.prepare(
		"SELECT COUNT(*) AS c FROM comments WHERE ip_hash = ? AND created_at > datetime('now', ?)",
	)
		.bind(ipHash, `-${RATE_WINDOW_MIN} minutes`)
		.first();

	if ((recent?.c ?? 0) >= RATE_MAX) {
		return json({ error: '评论太频繁，请稍后再试' }, 429);
	}

	const result = await env.DB.prepare(
		"INSERT INTO comments (path, name, content, ip_hash, status) VALUES (?, ?, ?, ?, 'approved') RETURNING id, name, content, created_at",
	)
		.bind(path, name, content, ipHash)
		.first();

	return json({ comment: result }, 201);
}
