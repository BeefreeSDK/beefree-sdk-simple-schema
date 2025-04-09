# Beefree SDK - Simple Schema

**Simple Schema** is a lightweight alternative to the full [Beefree SDK JSON](https://docs.beefree.io/beefree-sdk/data-structures/simple-schema) used to structure and validate designs in emails, pages, or popups. It was created to improve workflows powered by AI, headless design, and [Custom AddOns](https://docs.beefree.io/beefree-sdk/builder-addons/addons/custom-addons) development.

Simple Schema is much smaller than Beefree's native JSON, which makes it more AI-friendly.

You can convert the Simple Schema into native Beefree JSON using the [Content Services API endpoint](https://docs.beefree.io/beefree-sdk/apis/content-services-api/content-services-api-reference):  
`POST /v1/conversion/simple-to-full-json`

## Overview

Simple Schema brings value to:

- **AI-driven design creation**
- **Headless template workflows**
- **Custom AddOns and Custom Rows development**

It consolidates various schema types into a single structure, improves maintainability, and enables global updates.

## Use Cases

- AI-generated template creation
- Headless template creation
- A/B template variation generation
- Enhanced development for Custom AddOns and Rows

## Schema Files

Each file in the following table defines a specific content block type available within Simple Schema. Below are brief descriptions and direct links to the JSON schema files in this repository:

| Schema File | Description |
|-------------|-------------|
| [definitions.schema.json](https://github.com/BeefreeSDK/blob/main/definitions.schema.json) | Contains shared definitions and reusable schema components used across all simple schema modules. |
| [simple_button.schema.json](https://github.com/BeefreeSDK/blob/main/simple_button.schema.json) | Describes the structure for a customizable button. |
| [simple_column.schema.json](https://github.com/BeefreeSDK/blob/main/simple_column.schema.json) | Defines the layout and content rules for a column. |
| [simple_divider.schema.json](https://github.com/BeefreeSDK/blob/main/simple_divider.schema.json) | Describes available Divider content block properties. |
| [simple_html.schema.json](https://github.com/BeefreeSDK/blob/main/simple_html.schema.json) | Enables the insertion of raw HTML blocks for advanced customization beyond standard modules. |
| [simple_icons.schema.json](https://github.com/BeefreeSDK/blob/main/simple_icons.schema.json) | Describes available Icon content block properties. |
| [simple_image.schema.json](https://github.com/BeefreeSDK/blob/main/simple_image.schema.json) | Describes the available Image content block properties. |
| [simple_list.schema.json](https://github.com/BeefreeSDK/blob/main/simple_list.schema.json) | Describes an unordered or ordered list with multiple items and styling options. |
| [simple_menu.schema.json](https://github.com/BeefreeSDK/blob/main/simple_menu.schema.json) | Describes available Menu content block properties. |
| [simple_paragraph.schema.json](https://github.com/BeefreeSDK/blob/main/simple_paragraph.schema.json) | Describes available Paragraph content block properties. |
| [simple_row.schema.json](https://github.com/BeefreeSDK/blob/main/simple_row.schema.json) | Manages layout rows, defining structure and grouping content. |
| [simple_template.schema.json](https://github.com/BeefreeSDK/blob/main/simple_template.schema.json) | Top-level schema representing the entire design template, including layout, metadata, and content. |
| [simple_title.schema.json](https://github.com/BeefreeSDK/blob/main/simple_title.schema.json) | Defines header or title elements with configurable properties. |


## API Endpoint

To convert a Simple Schema into full Beefree SDK JSON, you can use the following endpoint in the [Content Services API](https://docs.beefree.io/beefree-sdk/apis/content-services-api/content-services-api-reference) offering:

```http
POST /v1/conversion/simple-to-full-json
```

## Developer Notes

- All AddOns use the Simple Schema format.
- Locked properties only apply to Row AddOns.
- Default values are auto-applied where omitted.
- Use `contentDialog.addon.handler` to apply block-level styles globally.

Example handler format:
```json
{
  "contentDialogId": "addOnID",
  "value": {
    "blockStyle": {
      // Padding, hover styles, and other block-level styling
    }
  }
}
```

## Schema Validation Tips

The following code snippet shows an example schema validation.

```ts
const urlOrMergeTags = (text: string): boolean => {
  try {
    new URL(text)
    return true
  } catch {
    return /{{.*}}/.test(text)
  }
}

const noAnchorTags = (text: string): boolean =>
  !/<a[^>]*>[\s\S]*?<\/a>|<a\s*\/>/i.test(text)
```

Reference the official [Beefree SDK](https://docs.beefree.io/beefree-sdk/data-structures/simple-schema) technical documentation to learn more about how to use Simple Schema.
