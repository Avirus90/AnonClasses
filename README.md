# AnonClasses

## Firestore Rules

Use `firestore.rules` in Firebase Console > Firestore Database > Rules.

### Behavior
- Admin-only access email: `bimbadharbaghel0@gmail.com`
- `students`: authenticated users can create only their own email record, read only by admin.
- `courses`: read for authenticated users, write only by admin.
- `courseNodes`: nested folders/URLs read for authenticated users, write only by admin.
