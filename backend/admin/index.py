"""
Бэкенд для администратора: авторизация, управление ссылками, чатом и платежами.
"""
import json
import os
import hashlib
import hmac
import time
import bcrypt
import psycopg2
from psycopg2.extras import RealDictCursor


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
}


def get_db():
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.cursor().execute(f'SET search_path TO "{schema}"')
    return conn


def make_token(username: str) -> str:
    secret = os.environ.get('ADMIN_SECRET_KEY', 'fallback-secret')
    payload = f"{username}:{int(time.time()) + 86400}"
    sig = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    import base64
    return base64.b64encode(f"{payload}:{sig}".encode()).decode()


def verify_token(token: str) -> bool:
    if not token:
        return False
    import base64
    try:
        decoded = base64.b64decode(token.encode()).decode()
    except Exception:
        return False
    secret = os.environ.get('ADMIN_SECRET_KEY', 'fallback-secret')
    parts = decoded.split(':')
    if len(parts) != 3:
        return False
    username, exp, sig = parts
    if int(exp) < int(time.time()):
        return False
    payload = f"{username}:{exp}"
    expected = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(sig, expected)


def ok(data):
    return {'statusCode': 200, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, code=400):
    return {'statusCode': code, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    """Обработчик запросов к API администратора"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    token = event.get('headers', {}).get('X-Admin-Token', '')

    action = body.get('action', '')

    # POST /login или action=login
    if method == 'POST' and (path.endswith('/login') or action == 'login'):
        username = body.get('username', '')
        password = body.get('password', '')
        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM admin_users WHERE username = %s", (username,))
        admin = cur.fetchone()
        conn.close()

        if not admin:
            return err('Неверный логин или пароль', 401)

        stored = admin['password_hash'].encode()
        if not bcrypt.checkpw(password.encode(), stored):
            return err('Неверный логин или пароль', 401)

        return ok({'token': make_token(username), 'username': username})

    if not verify_token(token):
        return err('Нет доступа', 401)

    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # GET /links
        if method == 'GET' and path.endswith('/links'):
            cur.execute("SELECT * FROM community_links ORDER BY sort_order, created_at")
            return ok(cur.fetchall())

        # POST /links
        if method == 'POST' and path.endswith('/links'):
            cur.execute(
                "INSERT INTO community_links (title, url, description, category, sort_order) VALUES (%s, %s, %s, %s, %s) RETURNING *",
                (body['title'], body['url'], body.get('description', ''), body.get('category', 'general'), body.get('sort_order', 0))
            )
            conn.commit()
            return ok(cur.fetchone())

        # PUT /links/{id}
        if method == 'PUT' and '/links/' in path:
            link_id = path.split('/')[-1]
            cur.execute(
                "UPDATE community_links SET title=%s, url=%s, description=%s, category=%s, is_active=%s, sort_order=%s, updated_at=NOW() WHERE id=%s RETURNING *",
                (body['title'], body['url'], body.get('description', ''), body.get('category', 'general'), body.get('is_active', True), body.get('sort_order', 0), link_id)
            )
            conn.commit()
            return ok(cur.fetchone())

        # DELETE /links/{id}
        if method == 'DELETE' and '/links/' in path:
            link_id = path.split('/')[-1]
            cur.execute("UPDATE community_links SET is_active=FALSE WHERE id=%s", (link_id,))
            conn.commit()
            return ok({'success': True})

        # GET /chat
        if method == 'GET' and path.endswith('/chat'):
            cur.execute("SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 100")
            return ok(cur.fetchall())

        # POST /chat/delete/{id}
        if method == 'POST' and '/chat/delete/' in path:
            msg_id = path.split('/')[-1]
            cur.execute("UPDATE chat_messages SET is_deleted=TRUE, deleted_by_admin=TRUE WHERE id=%s", (msg_id,))
            conn.commit()
            return ok({'success': True})

        # POST /chat/block
        if method == 'POST' and path.endswith('/chat/block'):
            cur.execute(
                "INSERT INTO blocked_users (user_identifier, reason) VALUES (%s, %s) ON CONFLICT (user_identifier) DO UPDATE SET reason=%s",
                (body['user_identifier'], body.get('reason', ''), body.get('reason', ''))
            )
            conn.commit()
            return ok({'success': True})

        # GET /blocked
        if method == 'GET' and path.endswith('/blocked'):
            cur.execute("SELECT * FROM blocked_users ORDER BY blocked_at DESC")
            return ok(cur.fetchall())

        # POST /blocked/unblock/{id}
        if method == 'POST' and '/blocked/unblock/' in path:
            block_id = path.split('/')[-1]
            cur.execute("UPDATE blocked_users SET blocked_by='unblocked' WHERE id=%s", (block_id,))
            conn.commit()
            return ok({'success': True})

        # GET /payments
        if method == 'GET' and path.endswith('/payments'):
            cur.execute("SELECT * FROM payments ORDER BY payment_date DESC")
            return ok(cur.fetchall())

        # POST /payments/{id}/refund
        if method == 'POST' and '/payments/' in path and path.endswith('/refund'):
            payment_id = path.split('/')[-2]
            cur.execute("UPDATE payments SET refunded=TRUE, refund_date=NOW(), status='refunded' WHERE id=%s RETURNING *", (payment_id,))
            conn.commit()
            return ok(cur.fetchone())

        # GET /stats
        if method == 'GET' and path.endswith('/stats'):
            cur.execute("SELECT COUNT(*) as total FROM chat_messages WHERE NOT is_deleted")
            msgs = cur.fetchone()['total']
            cur.execute("SELECT COUNT(*) as total FROM community_links WHERE is_active")
            links = cur.fetchone()['total']
            cur.execute("SELECT COUNT(*) as total, COALESCE(SUM(amount), 0) as revenue FROM payments WHERE NOT refunded")
            pay = cur.fetchone()
            cur.execute("SELECT COUNT(*) as total FROM blocked_users")
            blocked = cur.fetchone()['total']
            return ok({'messages': msgs, 'links': links, 'payments': pay['total'], 'revenue': pay['revenue'], 'blocked': blocked})

        return err('Маршрут не найден', 404)

    finally:
        conn.close()