import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateAssetDto } from './create-asset.dto';

describe('CreateAssetDto', () => {
  it('should validate a correct payload', async () => {
    const dto = plainToInstance(CreateAssetDto, {
      name: 'Logo Principal',
      assetType: 'LOGO',
      fileUrl: 'https://cdn.letzify.dev/assets/logo.svg',
      fileKey: 'projects/project-1/logo.svg',
      mimeType: 'image/svg+xml',
      fileSizeBytes: 2048,
      checksumSha256:
        '3f786850e387550fdab836ed7e6dc881de23001b86c8e6f89b9f8f0f2c8f4f12',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should fail when required fields are missing or invalid', async () => {
    const dto = plainToInstance(CreateAssetDto, {
      name: '',
      assetType: '',
      fileUrl: 'invalid-url',
      fileKey: '',
    });

    const errors = await validate(dto);

    const properties = errors.map((error) => error.property);
    expect(properties).toContain('name');
    expect(properties).toContain('assetType');
    expect(properties).toContain('fileUrl');
    expect(properties).toContain('fileKey');
  });

  it('should fail when fileSizeBytes is below the minimum allowed value', async () => {
    const dto = plainToInstance(CreateAssetDto, {
      name: 'Manual de Marca',
      assetType: 'DOCUMENT',
      fileUrl: 'https://cdn.letzify.dev/assets/manual.pdf',
      fileKey: 'projects/project-1/manual.pdf',
      fileSizeBytes: 0,
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'fileSizeBytes')).toBe(
      true,
    );
  });

  it('should fail when checksumSha256 has invalid length', async () => {
    const dto = plainToInstance(CreateAssetDto, {
      name: 'Logo Principal',
      assetType: 'LOGO',
      fileUrl: 'https://cdn.letzify.dev/assets/logo.svg',
      fileKey: 'projects/project-1/logo.svg',
      checksumSha256: 'abc123',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'checksumSha256')).toBe(
      true,
    );
  });
});
