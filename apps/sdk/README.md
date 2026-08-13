# DentalCore Social NodeJS SDK

This is the NodeJS SDK for [DentalCore Social](https://dentalcore.social).

You can start by installing the package:

```bash
npm install @dentalcore/node
```

## Usage
```typescript
import DentalCoreSocial from '@dentalcore/node';
const dentalcore = new DentalCoreSocial('your api key', 'your self-hosted instance (optional)');
```

The available methods are:
- `post(posts: CreatePostDto)` - Schedule a post to DentalCore Social
- `postList(filters: GetPostsDto)` - Get a list of posts
- `upload(file: Buffer, extension: string)` - Upload a file to DentalCore Social
- `integrations()` - Get a list of connected channels
- `deletePost(id: string)` - Delete a post by ID

Alternatively you can use the SDK with curl, check the [DentalCore Social API documentation](https://docs.postiz.com/public-api) for more information.