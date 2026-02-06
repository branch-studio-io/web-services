import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`states\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`code\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`fips\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`states_code_idx\` ON \`states\` (\`code\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`states_fips_idx\` ON \`states\` (\`fips\`);`)
  await db.run(sql`CREATE INDEX \`states_updated_at_idx\` ON \`states\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`states_created_at_idx\` ON \`states\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`states_id\` integer REFERENCES states(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_states_id_idx\` ON \`payload_locked_documents_rels\` (\`states_id\`);`,
  )

  // Seed US states (50 states + DC) - US Census FIPS codes
  const states = [
    { code: 'AL', name: 'Alabama', fips: '01' },
    { code: 'AK', name: 'Alaska', fips: '02' },
    { code: 'AZ', name: 'Arizona', fips: '04' },
    { code: 'AR', name: 'Arkansas', fips: '05' },
    { code: 'CA', name: 'California', fips: '06' },
    { code: 'CO', name: 'Colorado', fips: '08' },
    { code: 'CT', name: 'Connecticut', fips: '09' },
    { code: 'DE', name: 'Delaware', fips: '10' },
    { code: 'DC', name: 'District of Columbia', fips: '11' },
    { code: 'FL', name: 'Florida', fips: '12' },
    { code: 'GA', name: 'Georgia', fips: '13' },
    { code: 'HI', name: 'Hawaii', fips: '15' },
    { code: 'ID', name: 'Idaho', fips: '16' },
    { code: 'IL', name: 'Illinois', fips: '17' },
    { code: 'IN', name: 'Indiana', fips: '18' },
    { code: 'IA', name: 'Iowa', fips: '19' },
    { code: 'KS', name: 'Kansas', fips: '20' },
    { code: 'KY', name: 'Kentucky', fips: '21' },
    { code: 'LA', name: 'Louisiana', fips: '22' },
    { code: 'ME', name: 'Maine', fips: '23' },
    { code: 'MD', name: 'Maryland', fips: '24' },
    { code: 'MA', name: 'Massachusetts', fips: '25' },
    { code: 'MI', name: 'Michigan', fips: '26' },
    { code: 'MN', name: 'Minnesota', fips: '27' },
    { code: 'MS', name: 'Mississippi', fips: '28' },
    { code: 'MO', name: 'Missouri', fips: '29' },
    { code: 'MT', name: 'Montana', fips: '30' },
    { code: 'NE', name: 'Nebraska', fips: '31' },
    { code: 'NV', name: 'Nevada', fips: '32' },
    { code: 'NH', name: 'New Hampshire', fips: '33' },
    { code: 'NJ', name: 'New Jersey', fips: '34' },
    { code: 'NM', name: 'New Mexico', fips: '35' },
    { code: 'NY', name: 'New York', fips: '36' },
    { code: 'NC', name: 'North Carolina', fips: '37' },
    { code: 'ND', name: 'North Dakota', fips: '38' },
    { code: 'OH', name: 'Ohio', fips: '39' },
    { code: 'OK', name: 'Oklahoma', fips: '40' },
    { code: 'OR', name: 'Oregon', fips: '41' },
    { code: 'PA', name: 'Pennsylvania', fips: '42' },
    { code: 'RI', name: 'Rhode Island', fips: '44' },
    { code: 'SC', name: 'South Carolina', fips: '45' },
    { code: 'SD', name: 'South Dakota', fips: '46' },
    { code: 'TN', name: 'Tennessee', fips: '47' },
    { code: 'TX', name: 'Texas', fips: '48' },
    { code: 'UT', name: 'Utah', fips: '49' },
    { code: 'VT', name: 'Vermont', fips: '50' },
    { code: 'VA', name: 'Virginia', fips: '51' },
    { code: 'WA', name: 'Washington', fips: '53' },
    { code: 'WV', name: 'West Virginia', fips: '54' },
    { code: 'WI', name: 'Wisconsin', fips: '55' },
    { code: 'WY', name: 'Wyoming', fips: '56' },
  ]

  for (const state of states) {
    await payload.create({
      collection: 'states',
      data: state,
      req,
    })
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`states\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(
    sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`,
  )
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
  )
}
