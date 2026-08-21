# DevConnect — Core User Flows

## 1. Registration -> Profile -> Connect -> Endorse

```mermaid
flowchart TD
    A[Visitor lands on Home] --> B{Has account?}
    B -- No --> C[Register: email/username/password OR GitHub OAuth]
    B -- Yes --> D[Login]
    C --> E[JWT issued, stored in httpOnly cookie]
    D --> E
    E --> F[Dashboard]
    F --> G[Edit profile: bio, location, skills, avatar]
    F --> H[Discover developers: filter by skill/location]
    H --> I[View a developer's profile]
    I --> J[Send connection request]
    J --> K[Addressee sees pending request + real-time notification]
    K --> L{Accept or Reject?}
    L -- Accept --> M[Connection established, requester notified in real time]
    L -- Reject --> N[Request closed]
    M --> O[Either side can now endorse the other's skills]
    O --> P[Endorsement recorded, notification sent]
```

## 2. Project showcase flow
`Profile (own) -> Add project form -> title/description/tech stack/image -> Cloudinary upload -> Project card appears on public profile`

## 3. Blog flow
`Blog list -> Write a post -> Markdown editor -> Save draft or Publish -> Slug generated -> Post viewable at /blog/:slug with rendered Markdown`

## 4. Real-time notification flow
`Action (connection request / accept / endorsement) -> Server writes Notification row -> Server emits Socket.io event to the target user's active sockets -> Client updates in-app notification state`
