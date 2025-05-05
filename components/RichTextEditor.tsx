import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextEditorMenuBar from "./TextEditorMenu";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { useEffect, useCallback } from "react";
import { debounce } from "lodash";

type TextEditorProps = {
  value: string;
  onChange: (content: string) => void; 
  height?: string;
};

export default function RichTextEditor({ value, onChange, height="156px" }: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-3",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-3",
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          `h-[${height}] border rounded-md py-2 px-3 overflow-y-auto`,
      },
    },
    immediatelyRender: false,
  });

  // This function is used to debounce the onChange event to avoid too many updates
  // when the user is typing. It will only call onChange after 300ms of inactivity.
  // Fixed "React Hook useCallback received a function whose dependencies are unknown"
  const debouncedOnChange = useCallback((html: string) => {
    debounce(() => {
      onChange(html);
    }, 300)();
  }, [onChange]);

  useEffect(() => {
    if (!editor) return;
    editor.on("update", () => {
      debouncedOnChange(editor.getHTML());
    });
  }, [editor, debouncedOnChange]);

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div>
      <TextEditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
