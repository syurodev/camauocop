// tools.js
// @ts-ignore
import Embed from "@editorjs/embed";
// @ts-ignore
import Table from "@editorjs/table";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import Warning from "@editorjs/warning";
// @ts-ignore
import Header from "@editorjs/header";
// @ts-ignore
import Quote from "@editorjs/quote";
// @ts-ignore
import Marker from "@editorjs/marker";
// @ts-ignore
import CheckList from "@editorjs/checklist";
// @ts-ignore
import Delimiter from "@editorjs/delimiter";

export const EDITOR_JS_TOOLS = {
  // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
  // paragraph: Paragraph,
  embed: Embed,
  table: Table,
  list: List,
  warning: Warning,
  header: Header,
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
};
