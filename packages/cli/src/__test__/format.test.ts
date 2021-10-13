import { format } from "../format";

describe("camel", () => {
  test("format", async () => {
    const before = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model version {
  id         BigInt   @id @default(autoincrement())
  version    String
  created_at DateTime @default(now()) @db.Timestamp(6)
}

model album {
  id                                              String            @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  name                                            String
  release_date                                    DateTime?         @db.Date
  track                                           track[]
}


model track {
  id                                              String            @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  name                                            String
  album                                           album             @relation(fields: [album_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
}`;

    const after = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Version {
  id        BigInt   @id @default(autoincrement())
  version   String
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamp(6)

  @@map("version")
}

model Album {
  id          String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  name        String
  releaseDate DateTime? @map("release_date") @db.Date
  track       Track[]

  @@map("album")
}

model Track {
  id    String @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  name  String
  album Album  @relation(fields: [albumId], references: [id], onDelete: Cascade, onUpdate: NoAction)

  @@map("track")
}`;
    expect(await format(before)).toBe(after);
  });
});
