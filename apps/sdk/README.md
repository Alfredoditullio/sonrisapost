# SonrisaPost NodeJS SDK

This is the NodeJS SDK for [SonrisaPost](https://sonrisapost.com).

You can start by installing the package:

```bash
npm install @sonrisapost/node
```

## Usage
```typescript
import DentalCoreSocial from '@sonrisapost/node';
const sonrisapost = new DentalCoreSocial('your api key', 'your self-hosted instance (optional)');
```

The available methods are:
- `post(posts: CreatePostDto)` - Schedule a post to SonrisaPost
- `postList(filters: GetPostsDto)` - Get a list of posts
- `upload(file: Buffer, extension: string)` - Upload a file to SonrisaPost
- `integrations()` - Get a list of connected channels
- `deletePost(id: string)` - Delete a post by ID

Alternatively you can use the SDK with curl, check the [SonrisaPost API documentation](https://docs.postiz.com/public-api) for more information.