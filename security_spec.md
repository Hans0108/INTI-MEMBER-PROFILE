# Security Specification - Elite Membership Portal

## Data Invariants
- A member record must have a unique `memberId` formatted as `INTI-YYYY-NNNN`.
- A member record must have a unique, non-sequential `slug`.
- A user can only be an Admin if their UID is present in the `admins` collection with the appropriate role.
- Standard members cannot modify their own status or ID.
- Public verification is read-only.

## The "Dirty Dozen" Payloads (Denial Tests)
1. **Self-Promotion**: Authenticated user trying to write to `/admins/{uid}` to set `role: 'super_admin'`.
2. **ID Hijacking**: Member trying to update their `memberId` to a different format.
3. **Status Manipulation**: Member trying to update their own `status` to 'Active' from 'Inactive'.
4. **Member Spoofing**: User A trying to create a member record for themselves with User B's `userId`.
5. **Collection Wipe**: Anonymous user trying to `delete` the `members` collection.
6. **Config Poisoning**: Member trying to reset the `memberCounter` in `/config/app`.
7. **Cross-User Read**: User A trying to `list` all members (should only see their own if not admin).
8. **Field Injection**: Admin trying to add a "verifiedBy" field that isn't in the schema.
9. **Slug Guessing**: Attacker trying to guess sequential slugs (blocked by non-sequential generation).
10. **Admin Locked-out**: Admin trying to update a terminal status without bypass (if implemented).
11. **Shadow Update**: Update with a "isDeveloper" boolean field.
12. **PII Leak**: Unauthorized user trying to `get` the full member document (name/photo public, but email/userId sensitive).

## Risk Mitigation
- `affectedKeys().hasOnly()` used in all update blocks.
- `isValidMember()` helper for all writes.
- `isAdmin()` check using server-side `exists()`.
