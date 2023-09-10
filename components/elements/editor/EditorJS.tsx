import React, { useEffect, useRef } from "react";
import EditorJS, { EditorConfig, OutputData } from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "./tools";

interface EditorProps {
  onChange: (data?: OutputData | undefined) => void;
  value: OutputData | undefined;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<EditorJS | null>(null);
  useEffect(() => {
    const editorConfig: EditorConfig = {
      holder: "editor-container",
      tools: EDITOR_JS_TOOLS,
      onChange: () => handleEditorChange(),
      data: value,
    };

    const editor = new EditorJS(editorConfig);
    editorRef.current = editor;

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditorChange = async () => {
    if (editorRef.current) {
      const savedData: OutputData = await editorRef.current.save();
      onChange(savedData); // Cập nhật biến description trong App tự động khi nội dung thay đổi.
    }
  };

  return (
    <div>
      <div
        id="editor-container"
        className="border rounded-md sm:max-h-[304px] max-h-[500px] overflow-auto"
      ></div>
    </div>
  );
};

export default Editor;
