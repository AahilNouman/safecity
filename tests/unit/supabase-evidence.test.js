const test = require('node:test');
const assert = require('node:assert');
const supabaseHelper = require('../../backend/supabase');

test('Unit: Supabase Evidence Validation & Upload Helper', async (t) => {
  // 1. Rejects empty buffer
  assert.throws(() => {
    supabaseHelper.validateEvidenceImage(null, 'image/jpeg');
  }, /empty or missing/i);

  assert.throws(() => {
    supabaseHelper.validateEvidenceImage(Buffer.from([]), 'image/jpeg');
  }, /empty or missing/i);

  // 2. Rejects files larger than 5MB
  const largeBuffer = Buffer.alloc(5 * 1024 * 1024 + 1024);
  assert.throws(() => {
    supabaseHelper.validateEvidenceImage(largeBuffer, 'image/jpeg');
  }, /exceeds the 5MB maximum limit/i);

  // 3. Rejects unsupported MIME type
  const sampleBuffer = Buffer.from([0x00, 0x01, 0x02]);
  assert.throws(() => {
    supabaseHelper.validateEvidenceImage(sampleBuffer, 'application/pdf');
  }, /Unsupported image format/i);

  // 4. Rejects file with invalid header signature (magic numbers)
  const fakeJpeg = Buffer.from([0x00, 0x00, 0x00, 0x00]);
  assert.throws(() => {
    supabaseHelper.validateEvidenceImage(fakeJpeg, 'image/jpeg');
  }, /File signature does not match/i);

  // 5. Accepts valid JPEG header
  const validJpeg = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46]);
  assert.strictEqual(supabaseHelper.validateEvidenceImage(validJpeg, 'image/jpeg'), true);

  // 6. Accepts valid PNG header
  const validPng = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  assert.strictEqual(supabaseHelper.validateEvidenceImage(validPng, 'image/png'), true);

  // 7. Accepts valid WebP header
  const validWebp = Buffer.concat([
    Buffer.from('RIFF', 'ascii'),
    Buffer.alloc(4),
    Buffer.from('WEBP', 'ascii')
  ]);
  assert.strictEqual(supabaseHelper.validateEvidenceImage(validWebp, 'image/webp'), true);

  // 8. Uploads evidence with fallback resilience
  const uploadResult = await supabaseHelper.uploadEvidence(validJpeg, 'photo.jpg', 'image/jpeg');
  assert.strictEqual(uploadResult.success, true);
  assert.ok(uploadResult.filePath);
  assert.ok(uploadResult.url);
});
