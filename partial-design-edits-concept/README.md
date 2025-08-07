# Partial Design Edits Concept

This concept demonstrates how to integrate AI-powered partial design editing with the Beefree SDK. Users can upload existing templates and use natural language to make specific edits to their email designs.

## Features

- **Combined Interface**: Chat interface (1/3 screen) and Beefree SDK editor (2/3 screen) on the same page
- **Template Upload**: Upload existing JSON templates via the "Upload Template" button
- **AI-Powered Edits**: Use natural language to describe specific changes to your design
- **Real-time Tracking**: onChange and onSave callbacks enabled for tracking design changes
- **Local Storage**: Templates are stored locally for persistence
- **Full-to-Simple Conversion**: Automatically converts full JSON to simple JSON for AI processing
- **Simple-to-Full Conversion**: Converts AI-generated simple JSON back to full JSON for the editor

## How It Works

1. **Upload Template**: Click "Upload Template" to load an existing JSON template
2. **Save Design**: Click the Save button in the Beefree editor to enable chat functionality
3. **Chat with AI**: Describe specific changes you want to make to your design
4. **AI Processing**: The system converts your template to simple JSON, sends it to AI with your request, and converts the result back to full JSON
5. **View Changes**: The updated design is automatically loaded into the editor

## Example Chat Prompts

- "Rewrite the paragraph in row 3 column 2"
- "Add another row promoting our latest blog posts at the end of the design"
- "Change the color of the main heading to blue"
- "Add a button after the first paragraph"
- "Replace the image in the header with a new logo"

## Technical Implementation

### API Endpoints

- `/api/anthropic` - Sends edit requests to Claude AI
- `/api/beefree/auth` - Authenticates with Beefree SDK
- `/api/beefree/simple-to-full` - Converts simple JSON to full JSON
- `/api/beefree/full-to-simple` - Converts full JSON to simple JSON

### Beefree SDK Configuration

The SDK is configured with:
- `trackChanges: true` - Enables onChange tracking
- `onSave` callback - Stores template and enables chat
- `onChange` callback - Logs changes to console and updates local storage

### Local Storage

- `currentTemplate` - Stores the current template JSON
- `email.autosave` - Stores autosaved versions

## Setup

1. Copy `credentials.example.js` to `credentials.js`
2. Add your API keys:
   ```javascript
   module.exports = {
     anthropic_api_key: 'your_anthropic_key_here',
     beefree_api_key: 'your_beefree_key_here'
   };
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open `http://localhost:3000` in your browser

## Testing

You can test the functionality by uploading the included `example-template.json` file:

1. Click "Upload Template" in the header
2. Select `example-template.json` from the file picker
3. Click "Save" in the Beefree editor
4. Try chat prompts like:
   - "Change the main heading to 'Welcome to Our New Platform'"
   - "Add a new row with a promotional offer"
   - "Change the button color to red"

## File Structure

```
partial-design-edits-concept/
├── index.html              # Main interface with chat and editor
├── proxy-server.js         # Backend API proxy
├── credentials.js          # API keys (create from example)
├── example-template.json   # Example template for testing
├── package.json            # Dependencies
└── README.md              # This file
```

## Usage Flow

1. **Initial State**: Chat shows "First save your design. Then, start chatting here to apply edits to parts of your design."
2. **Upload Template**: Click upload button and select a JSON file
3. **Save Design**: Click Save in the editor to enable chat
4. **Chat Enabled**: Placeholder text updates with example prompts
5. **Make Edits**: Type natural language descriptions of changes
6. **AI Processing**: Shows "AI is working on applying your edits to your design"
7. **View Results**: Updated design loads automatically in the editor

## Console Logging

The `onChange` callback logs all JSON changes to the browser console for debugging and tracking purposes.

## Error Handling

- Invalid JSON files show error messages in chat
- API errors are displayed to the user
- Network issues are handled gracefully
- Template validation ensures proper structure

## Future Enhancements

- Support for multiple template formats
- Batch edit processing
- Version history and rollback
- Collaborative editing features
- Advanced AI prompts for complex design changes 