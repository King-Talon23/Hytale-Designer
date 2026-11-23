// DELETE /api/anims/<id>: unpublish one of your own animations.
import { unpublish } from '../../../lib/api.js';

export const onRequestDelete = ctx => unpublish(ctx, 'anims', 'Unknown animation.');
