import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

function validateEnvironmentVariables(
  environment: Record<string, string | undefined>,
) {
  const requiredVariables = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'CORS_ORIGIN',
  ];

  const missingVariables = requiredVariables.filter((key) => {
    const value = environment[key];
    return !value || value.trim().length === 0;
  });

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(', ')}`,
    );
  }

  return environment;
}

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: ['.env', '../.env', '../../.env'],
      validate: validateEnvironmentVariables,
    }),
  ],
})
export class ConfigModule {}
