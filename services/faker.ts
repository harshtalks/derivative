// fake data
// Make sure to remove this once on production
//

const createRandomUser = Effect.sync(
  () =>
    ({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      githubId: faker.internet.userName(),
      username: faker.internet.userName(),
      avatar: faker.image.avatar(),
      twoFactorEnabled: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      id: crypto.randomUUID(),
    }) as typeof users.$inferInsert,
);

import { Effect } from "effect";
import { faker } from "@faker-js/faker";
import { users } from "@/database/schema";
import { ServiceLayer } from ".";

export const generateFakeUsers = (count: number = 100) => {
  return Effect.gen(function* () {
    const fakeUsers = Array.from({ length: count }, () =>
      Effect.runSync(createRandomUser),
    );

    const services = yield* ServiceLayer;
    const { session, user, db } = yield* services;

    yield* Effect.promise(() => db.insert(users).values([...fakeUsers]));

    return { sucess: true };
  });
};
