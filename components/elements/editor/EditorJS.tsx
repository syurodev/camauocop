"use client";
import React, { useEffect, useRef } from "react";
import EditorJS, { EditorConfig, OutputData } from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "./tools";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

interface EditorProps {
  setValue: UseFormSetValue<{
    productType: string;
    name: string;
    description: { time: number; blocks: unknown[]; version: string };
    price: number;
    quantity: number;
    images: [string, ...string[]];
    sellerId?: string | undefined;
    auction?: boolean | undefined;
  }>;
  getValues: UseFormGetValues<{
    productType: string;
    name: string;
    description: { time: number; blocks: unknown[]; version: string };
    price: number;
    quantity: number;
    images: [string, ...string[]];
    sellerId?: string | undefined;
    auction?: boolean | undefined;
  }>;
}

const Editor: React.FC<EditorProps> = ({ getValues, setValue }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const [editorData, setEditorData] = React.useState<OutputData>();

  useEffect(() => {
    setEditorData(getValues("description") as OutputData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const editorConfig: EditorConfig = {
      holder: "editor-container",
      tools: EDITOR_JS_TOOLS,
      onChange: () => handleEditorChange(),
      data: editorData,
    };

    const editor = new EditorJS(editorConfig);
    editorRef.current = editor;

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditorChange = async () => {
    if (editorRef.current) {
      const savedData: OutputData = await editorRef.current.save();
      setValue(
        "description",
        savedData as { time: number; blocks: unknown[]; version: string }
      );
      setEditorData(getValues("description") as OutputData);
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
