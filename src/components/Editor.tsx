import React, {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { PiTextAa } from "react-icons/pi";
import { ImagePlus, Send, Smile, XIcon } from "lucide-react";
import { Hint } from "./hint";
import { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";
import Image from "next/image";

const editorStyles = `
    .quill-editor {
      font-family: 'Inter', sans-serif;
    }

    .quill-editor .ql-toolbar {
      border-top: none;
      border-left: none;
      border-right: none;
      border-bottom: 1px solid #e2e8f0;
      padding: 8px;
    }

    .quill-editor .ql-container {
      border: none;
      font-size: 16px;
    }

    .quill-editor .ql-editor {
      padding: 16px;
    }

    .quill-editor .ql-editor p {
      margin-bottom: 12px;
    }

    .quill-editor .ql-editor::before {
      font-style: normal;
      font-size: 16px;
      color: #a0aec0;
    }

    .quill-editor .ql-snow.ql-toolbar button,
    .quill-editor .ql-snow .ql-toolbar button {
      width: 23px;
      height: 23px;
      padding: 2px;
      margin-right: 4px;
    }

    .quill-editor .ql-snow .ql-stroke {
      stroke: #4a5568;
    }

    .quill-editor .ql-snow .ql-fill {
      fill: #4a5568;
    }

    .quill-editor .ql-snow.ql-toolbar button:hover,
    .quill-editor .ql-snow .ql-toolbar button:hover,
    .quill-editor .ql-snow.ql-toolbar button.ql-active,
    .quill-editor .ql-snow .ql-toolbar button.ql-active {
      background-color: #edf2f7;
    }

    .quill-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
    .quill-editor .ql-snow .ql-toolbar button:hover .ql-stroke,
    .quill-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke,
    .quill-editor .ql-snow .ql-toolbar button.ql-active .ql-stroke {
      stroke: #2d3748;
    }

    .quill-editor .ql-snow.ql-toolbar button:hover .ql-fill,
    .quill-editor .ql-snow .ql-toolbar button:hover .ql-fill,
    .quill-editor .ql-snow.ql-toolbar button.ql-active .ql-fill,
    .quill-editor .ql-snow .ql-toolbar button.ql-active .ql-fill {
      fill: #2d3748;
    }
  `;

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  variant?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
}

const Editor = ({
  variant = "create",
  onSubmit,
  onCancel,
  defaultValue = [],
  innerRef,
  disabled = false,
  placeholder = "Write something...",
}: EditorProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setToolbarVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const defaultValueRef = useRef(defaultValue);
  const quillRef = useRef<Quill | null>(null);
  const placeholderRef = useRef(placeholder);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    defaultValueRef.current = defaultValue;
    placeholderRef.current = placeholder;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());

                submitRef.current?.({
                  body,
                  image: addedImage,
                });
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setToolbarVisible((prev) => !prev);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;

    quill?.insertText(quill.getSelection()?.index || 0, emoji.native);
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <>
      <style>{editorStyles}</style>
      <div
        className={cn(
          "flex flex-col bg-white rounded-lg shadow-md overflow-hidden",
          disabled && "opacity-50"
        )}
      >
        <input
          type="file"
          accept="image/*"
          ref={imageElementRef}
          onChange={(e) => setImage(e.target.files![0])}
          className="hidden"
        />
        <div
          ref={containerRef}
          className={cn(
            "quill-editor min-h-[130px] max-h-[300px] overflow-y-auto"
          )}
        />
        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                  className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="Image"
                fill
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex items-center justify-between p-2 bg-gray-50 border-t border-gray-200">
          <div className="flex space-x-2">
            <Hint label={isToolbarVisible ? "Hide Toolbar" : "Show Toolbar"}>
              <Button
                disabled={disabled}
                size="sm"
                variant="ghost"
                onClick={toggleToolbar}
              >
                <PiTextAa className="h-5 w-5" />
              </Button>
            </Hint>
            <EmojiPopover hint="Emoji" onEmojiSelect={onEmojiSelect}>
              <Button size="sm" variant="ghost">
                <Smile className="h-5 w-5" />
              </Button>
            </EmojiPopover>
            {variant === "create" && (
              <Hint label="Add image">
                <Button
                  disabled={disabled}
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    imageElementRef.current?.click();
                  }}
                >
                  <ImagePlus className="h-5 w-5" />
                </Button>
              </Hint>
            )}
          </div>
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                size={"sm"}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  });
                }}
                disabled={disabled || isEmpty}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Hint label="Send message">
              <Button
                disabled={isEmpty || disabled}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  });
                }}
                size="sm"
                className={cn(
                  "bg-purple-600 hover:bg-purple-700 text-white",
                  isEmpty &&
                    "bg-white hover:bg-white text-black border border-gray-300"
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </Hint>
          )}
        </div>
      </div>
      {variant === "create" && (
        <div
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-start opacity-0 transition",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong className="text-purple-600">Shift + Enter</strong> to add a
            new line
          </p>
        </div>
      )}
    </>
  );
};

export default Editor;
