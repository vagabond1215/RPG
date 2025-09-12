import { readFile } from "fs/promises";
import Ajv from "ajv";

async function validateArray(path: string, schemaPath: string) {
  const [dataRaw, schemaRaw] = await Promise.all([
    readFile(path, "utf-8"),
    readFile(schemaPath, "utf-8"),
  ]);
  const data = JSON.parse(dataRaw);
  const schema = JSON.parse(schemaRaw);
  const ajv = new Ajv({ allErrors: true });
  const validateFn = ajv.compile(schema);
  let ok = true;
  for (const item of data) {
    const valid = validateFn(item);
    if (!valid) {
      console.error(`Validation failed for ${path}`, validateFn.errors);
      ok = false;
    }
  }
  if (ok) {
    console.log(`${path} valid`);
  } else {
    process.exitCode = 1;
  }
}

async function run() {
  await validateArray("data/animals.json", "schemas/animal.schema.json");
  await validateArray("data/plants.json", "schemas/plant.schema.json");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
