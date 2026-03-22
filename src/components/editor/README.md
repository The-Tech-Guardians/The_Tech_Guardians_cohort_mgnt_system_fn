# Rich Text Editor Integration

This directory contains two rich text editor components for your frontend:

## 1. FormattedTextEditor (Immediate Use)

**File**: `FormattedTextEditor.tsx`

**Features**:
- ✅ Bold, Italic, Underline formatting
- ✅ Bullet lists
- ✅ Text alignment (left, center, right)
- ✅ Link insertion
- ✅ ContentEditable-based
- ✅ Uses existing Lucide icons
- ✅ **No additional dependencies required**

**Usage**:
```tsx
import FormattedTextEditor from '@/components/editor/FormattedTextEditor';

<FormattedTextEditor
  content={content}
  onChange={setContent}
  placeholder="Enter your content here..."
  editable={true}
  showToolbar={true}
  minHeight="300px"
  className="w-full"
/>
```

## 2. TiptapEditor (Advanced - Requires Installation)

**File**: `TiptapEditor.tsx` and `RichTextEditor.tsx`

**Installation Required**:
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-bold @tiptap/extension-italic @tiptap/extension-underline @tiptap/extension-bullet-list @tiptap/extension-ordered-list @tiptap/extension-link @tiptap/extension-image
```

**Features**:
- ✅ Modern WYSIWYG editor
- ✅ Rich formatting (bold, italic, underline, strikethrough)
- ✅ Headings (H1, H2, H3)
- ✅ Lists (bullet, ordered)
- ✅ Links with proper handling
- ✅ Images support
- ✅ Code blocks and inline code
- ✅ Blockquotes
- ✅ Tables
- ✅ Text alignment
- ✅ Clean HTML output
- ✅ Professional toolbar

**Usage**:
```tsx
import RichTextEditor from '@/components/editor/RichTextEditor';

<RichTextEditor
  content={content}
  onChange={setContent}
  placeholder="Start typing..."
  editable={true}
  showToolbar={true}
  minHeight="200px"
/>
```

## Integration Steps

### Step 1: Install Dependencies
```bash
cd your-project-directory
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-bold @tiptap/extension-italic @tiptap/extension-underline @tiptap/extension-bullet-list @tiptap/extension-ordered-list @tiptap/extension-link @tiptap/extension-image
```

### Step 2: Update package.json
Add these dependencies to your `package.json`:
```json
{
  "dependencies": {
    "@tiptap/react": "^2.1.13",
    "@tiptap/starter-kit": "^2.1.13",
    "@tiptap/extension-bold": "^2.1.13",
    "@tiptap/extension-italic": "^2.1.13",
    "@tiptap/extension-underline": "^2.1.13",
    "@tiptap/extension-bullet-list": "^2.1.13",
    "@tiptap/extension-ordered-list": "^2.1.13",
    "@tiptap/extension-link": "^2.1.13",
    "@tiptap/extension-image": "^2.1.13"
  }
}
```

### Step 3: Use in Your Components

Replace any textarea or content input with:

```tsx
// For immediate use (no installation needed)
import FormattedTextEditor from '@/components/editor/FormattedTextEditor';

// For advanced use (after Tiptap installation)
import RichTextEditor from '@/components/editor/RichTextEditor';

// Example in assessment form
<FormField label="Assessment Description">
  <FormattedTextEditor
    content={formData.description}
    onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
    placeholder="Enter assessment description..."
    minHeight="200px"
    showToolbar={true}
  />
</FormField>

// Example in lesson content
<FormField label="Lesson Content">
  <RichTextEditor
    content={lessonContent}
    onChange={setContent}
    placeholder="Enter your lesson content here..."
    minHeight="400px"
    showToolbar={true}
  />
</FormField>
```

## Where to Use

### Assessment Forms
- Assessment descriptions
- Question content
- Feedback messages

### Lesson Content
- Lesson body content
- Lesson descriptions
- Module descriptions

### Course Descriptions
- Course overview
- Course objectives
- Course requirements

### Announcements
- Rich announcement content
- Formatted announcements

### Any Rich Text Input
Replace any basic textarea:
```tsx
// Replace this:
<textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  placeholder="Enter content..."
/>

// With this:
<FormattedTextEditor
  content={content}
  onChange={setContent}
  placeholder="Enter content..."
  showToolbar={true}
/>
```

## Benefits

### FormattedTextEditor (Immediate)
- ✅ **No installation required**
- ✅ **Works immediately**
- ✅ **Lightweight**
- ✅ **Basic formatting**
- ✅ **Cross-browser compatible**

### RichTextEditor (Tiptap)
- ✅ **Professional WYSIWYG**
- ✅ **Advanced formatting**
- ✅ **Clean HTML output**
- ✅ **Modern interface**
- ✅ **Extensible**

## Recommendation

**Start with FormattedTextEditor** for immediate functionality, then install Tiptap for advanced features when ready.
