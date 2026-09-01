# Social Drop Factory API v2

Base: your deployed Social Drop Factory. All `/api/v1/*` mutation/control endpoints require `Authorization: Bearer $SOCIAL_DROP_API_KEY`. The browser never receives this key.

## Agent sequence
1. `GET /api/v1/doctor`
2. `POST /api/v1/plan` for an article/blog/source, or create a canonical drop directly.
3. `POST /api/v1/validate`
4. `POST /api/v1/adapt`
5. If media is remote, `POST /api/v1/media` with an approved HTTPS URL and use the returned Postiz asset in the drop.
6. `GET /api/v1/integrations` and select explicit integration IDs when a platform has multiple accounts.
7. Human reviews exact plan and creates approval metadata.
8. `POST /api/v1/schedule`
9. Preserve the returned receipt.
10. `GET /api/v1/analytics?postId=...&days=7` or `?integrationId=...&days=7`.

## Plan request
```json
{
  "source":{"id":"article-42","type":"article","title":"Title","url":"https://example.com/article","excerpt":"Source-backed summary"},
  "distribution":{"platforms":["linkedin","x"],"scheduledAt":"2026-09-02T16:00:00Z"}
}
```

## Schedule request
```json
{
  "drop":{
    "id":"article-42",
    "type":"post",
    "message":"Source-backed summary",
    "platforms":["linkedin","x"],
    "scheduledAt":"2026-09-02T16:00:00Z",
    "targets":{"linkedin":{"integrationId":"..."},"x":{"integrationId":"..."}}
  },
  "approval":{"approved":true,"approvedBy":"owner","approvedAt":"2026-09-01T03:00:00Z"}
}
```

Postiz execution is server-side. The adapter discovers connected channels, refuses ambiguous account selection, converts variants into the provider's `integration + value[] + settings` shape, then returns a normalized receipt.
