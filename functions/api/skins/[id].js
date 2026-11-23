// DELETE /api/skins/<id>: unpublish one of your own skins.
import { unpublish } from '../../../lib/api.js';

export const onRequestDelete = ctx => unpublish(ctx, 'skins', 'Unknown skin.');
