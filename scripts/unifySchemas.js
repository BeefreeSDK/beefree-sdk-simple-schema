import $RefParser from "@apidevtools/json-schema-ref-parser";
import SimpleTemplateSchema from '../simple_template.schema.json' with { type: "json" }

const schema = {
    definitions: {
        $ref: 'definitions.schema.json#/definitions',
    },
    ...SimpleTemplateSchema,
}

try {
    $RefParser.bundle(schema).then((bundledSchema) => {
        const keysToRemove = ['$schema', '$id']
        // Dereferenced schema
        const cleanedSchema = JSON.parse(JSON.stringify(bundledSchema,
            (key, val) => {
                if (keysToRemove.includes(key)) {
                    return undefined
                }
                return val
            }))

        process.stdout.write(JSON.stringify({
            $schema: 'http://json-schema.org/draft-07/schema',
            $id: 'simple_template.schema.json',
            ...cleanedSchema,
        }, null, 2))
    })
} catch (err) {
    console.error(err);
}
