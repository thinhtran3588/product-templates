import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { describe, expect, it, vi } from 'vitest';
import { BaseAggregate } from '@app/common/domain/base-aggregate';
import { Uuid } from '@app/common/domain/uuid';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';
import { saveAggregate } from '@app/common/infrastructure/save-aggregate';

const entities = pgTable('entities', {
  id: text('id').notNull(),
  version: integer('version').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

class TestAggregate extends BaseAggregate {
  toJson(): Record<string, unknown> {
    return {
      id: this.id.getValue(),
      version: this.version,
      createdAt: this.createdAt,
      ...this.getBaseJson(),
    };
  }
}

const createTx = (rowCount: number = 1) => {
  const values = vi.fn().mockResolvedValue(undefined);
  const execute = vi.fn().mockResolvedValue({ rowCount });
  const whereSelect = vi.fn().mockResolvedValue([{ version: 99 }]);

  const tx = {
    insert: vi.fn(() => ({ values })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({ execute })),
      })),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: whereSelect,
      })),
    })),
  };

  return { tx, values, execute };
};

describe('saveAggregate', () => {
  it('inserts new aggregate when version is 0', async () => {
    const { tx, values } = createTx();
    const writeDatabase = {
      transaction: vi.fn(async (cb: (t: unknown) => Promise<void>) => cb(tx)),
    };
    const aggregate = new TestAggregate({
      id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
      version: 0,
    });

    await saveAggregate({
      aggregate,
      table: entities,
      writeDatabase: writeDatabase as never,
    });

    expect(values).toHaveBeenCalledTimes(1);
  });

  it('throws when updating aggregate without prepareUpdate', async () => {
    const { tx } = createTx();
    const writeDatabase = {
      transaction: vi.fn(async (cb: (t: unknown) => Promise<void>) => cb(tx)),
    };
    const aggregate = new TestAggregate({
      id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
      version: 1,
    });

    await expect(
      saveAggregate({
        aggregate,
        table: entities,
        writeDatabase: writeDatabase as never,
      })
    ).rejects.toThrow(ValidationErrorCode.FIELD_IS_INVALID);
  });

  it('updates aggregate and executes callback after prepareUpdate', async () => {
    const { tx, execute } = createTx(1);
    const writeDatabase = {
      transaction: vi.fn(async (cb: (t: unknown) => Promise<void>) => cb(tx)),
    };
    const aggregate = new TestAggregate({
      id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
      version: 0,
    });
    aggregate.prepareUpdate(
      Uuid.create('660e8400-e29b-41d4-a716-446655440000'),
      0
    );
    const callback = vi.fn().mockResolvedValue(undefined);

    await saveAggregate({
      aggregate,
      table: entities,
      writeDatabase: writeDatabase as never,
      postSaveCallback: callback,
    });

    expect(execute).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('throws outdated version when update affects no rows', async () => {
    const { tx } = createTx(0);
    const writeDatabase = {
      transaction: vi.fn(async (cb: (t: unknown) => Promise<void>) => cb(tx)),
    };
    const aggregate = new TestAggregate({
      id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
      version: 0,
    });
    aggregate.prepareUpdate(
      Uuid.create('660e8400-e29b-41d4-a716-446655440000'),
      0
    );

    await expect(
      saveAggregate({
        aggregate,
        table: entities,
        writeDatabase: writeDatabase as never,
      })
    ).rejects.toThrow(ValidationErrorCode.OUTDATED_VERSION);
  });

  it('handles outdated version when current model is missing', async () => {
    const { tx } = createTx(0);
    tx.select = vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([]),
      })),
    }));
    const writeDatabase = {
      transaction: vi.fn(async (cb: (t: unknown) => Promise<void>) => cb(tx)),
    };
    const aggregate = new TestAggregate({
      id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
      version: 0,
    });
    aggregate.prepareUpdate(
      Uuid.create('660e8400-e29b-41d4-a716-446655440000'),
      0
    );

    await expect(
      saveAggregate({
        aggregate,
        table: entities,
        writeDatabase: writeDatabase as never,
      })
    ).rejects.toThrow(ValidationErrorCode.OUTDATED_VERSION);
  });
});
