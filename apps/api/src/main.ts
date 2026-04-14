import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const envCandidates = [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "../../.env"),
  resolve(__dirname, "../.env"),
  resolve(__dirname, "../../../.env"),
  resolve(__dirname, "../../../packages/database/.env"),
];

for (const envPath of envCandidates) {
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) {
        continue;
      }

      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      const key = line.slice(0, separatorIndex).trim();
      if (!key || process.env[key] !== undefined) {
        continue;
      }

      let value = line.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith("\"") && value.endsWith("\"")) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      process.env[key] = value;
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
