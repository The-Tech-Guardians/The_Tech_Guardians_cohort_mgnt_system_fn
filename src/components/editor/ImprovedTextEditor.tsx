"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, List, Link, Code, Quote, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface ImprovedTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  minHeight?: string;
  showToolbar?: boolean;
}

export default function ImprovedTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start typing...", 
  editable = true,
  className = "",
  minHeight = "200px",
  showToolbar = true
}: ImprovedTextEditorProps) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isList, setIsList] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const editorRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  // Track content changes
  const lastContentRef = useRef('');

  useEffect(() => {
    if (editorRef.current && content !== lastContentRef.current) {
      lastContentRef.current = content;
      
      // Only update if content actually changed
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content;
      }
    }
  }, [content]);

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    if (!editable) return;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      if ((e as any).nativeEvent && (e as any).nativeEvent.data) {
        e.preventDefault();
        const text = (e as any).nativeEvent.data;
        if (range) {
          range.deleteContents();
          const textNode = document.createTextNode(text);
          range.insertNode(textNode);
        }
      }
    }
    
    // Handle content change
    const newContent = editorRef.current?.innerHTML || '';
    if (newContent !== content) {
      onChange(newContent);
    }
  }, [editable, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!editable) return;
    
    // Handle common keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          setIsBold(!isBold);
          document.execCommand('bold', false);
          break;
        case 'i':
          e.preventDefault();
          setIsItalic(!isItalic);
          document.execCommand('italic', false);
          break;
        case 'u':
          e.preventDefault();
          setIsUnderline(!isUnderline);
          document.execCommand('underline', false);
          break;
        case 'l':
          e.preventDefault();
          setIsList(!isList);
          document.execCommand('insertUnorderedList', false);
          break;
        case 'e':
          e.preventDefault();
          setIsList(false);
          document.execCommand('insertOrderedList', false);
          break;
      }
    }
  }, [editable, isBold, isItalic, isUnderline, isList]);

  const applyFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    // Force content change detection
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
    }
  }, [onChange]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url && editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (range) {
          range.deleteContents();
          const link = document.createElement('a');
          link.href = url;
          link.textContent = url || 'Link';
          link.className = 'text-blue-600 underline hover:text-blue-800';
          range.insertNode(link);
        }
      }
    }
  }, []);

  const MenuButton = ({ 
    onClick, 
    isActive = false, 
    title, 
    children 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    title: string; 
    children: React.ReactNode 
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  const MenuDivider = () => (
    <div className="w-px h-6 bg-gray-300" />
  );

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      {editable && showToolbar && (
        <div className="border-b border-gray-200 bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <MenuButton
              onClick={() => setIsBold(!isBold)}
              isActive={isBold}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </MenuButton>
            
            <MenuButton
              onClick={() => setIsItalic(!isItalic)}
              isActive={isItalic}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </MenuButton>
            
            <MenuButton
              onClick={() => setIsUnderline(!isUnderline)}
              isActive={isUnderline}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </MenuButton>
          </div>
          
          <MenuDivider />
          
          {/* Lists */}
          <div className="flex items-center gap-1">
            <MenuButton
              onClick={() => setIsList(!isList)}
              isActive={isList}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </MenuButton>
          </div>
          
          <MenuDivider />
          
          {/* Alignment */}
          <div className="flex items-center gap-1">
            <MenuButton
              onClick={() => setTextAlign('left')}
              isActive={textAlign === 'left'}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </MenuButton>
            
            <MenuButton
              onClick={() => setTextAlign('center')}
              isActive={textAlign === 'center'}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </MenuButton>
            
            <MenuButton
              onClick={() => setTextAlign('right')}
              isActive={textAlign === 'right'}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </MenuButton>
          </div>
          
          <MenuDivider />
          
          {/* Insert */}
          <div className="flex items-center gap-1">
            <MenuButton
              onClick={insertLink}
              title="Add Link"
            >
              <Link className="w-4 h-4" />
            </MenuButton>
          </div>
        </div>
      )}
      
      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable={editable}
        className={`min-h-[${minHeight}] p-4 focus:outline-none prose prose-sm max-w-none ${
          editable ? 'cursor-text' : ''
        }`}
        style={{ minHeight }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handleInput}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: '' }}
      />
      
      {/* Hidden input for placeholder */}
      {editable && content === '' && (
        <div 
          className="absolute top-4 left-4 text-gray-400 pointer-events-none"
          contentEditable={false}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
}
