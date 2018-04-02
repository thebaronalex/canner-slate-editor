// @flow
/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import {Editor} from 'slate-react';
import beautify from 'js-beautify';
import {Value} from 'slate';
import {Row, Col} from 'antd';
import {AlignCenter, AlignLeft, AlignRight} from 'packages/slate-icon-align';
import Blockquote, {BlockquotePlugin} from 'packages/slate-icon-blockquote';
import Bold, {BoldPlugin} from 'packages/slate-icon-bold';
import Clean from 'packages/slate-icon-clean';
import Code, {CodePlugin} from 'packages/slate-icon-code';
import CodeBlock, {CodeBlockPlugin} from 'packages/slate-icon-codeblock';
import Emoji, {EmojiPlugin} from 'packages/slate-icon-emoji';
import FontBgColor, {FontBgColorPlugin} from 'packages/slate-icon-fontBgColor';
import FontColor, {FontColorPlugin} from 'packages/slate-icon-fontColor';
import {Header1, Header2, HeaderPlugin} from 'packages/slate-icon-header';
import Image, {ImagePlugin} from 'packages/slate-icon-image';
import {Indent, Outdent} from 'packages/slate-icon-indent';
import Italic, {ItalicPlugin} from 'packages/slate-icon-italic';
import Link, {LinkPlugin} from 'packages/slate-icon-link';
import {OlList, UlList, ListPlugin} from 'packages/slate-icon-list';
import StrikeThrough, {StrikeThroughPlugin} from 'packages/slate-icon-strikethrough';
import Underline, {UnderlinePlugin} from 'packages/slate-icon-underline';
import Undo from 'packages/slate-icon-undo';
import Redo from 'packages/slate-icon-redo';
import Video, {VideoPlugin} from 'packages/slate-icon-video';

// select
import FontSize, {FontSizePlugin} from 'packages/slate-select-fontsize';
import LetterSpacing, {LetterSpacingPlugin} from 'packages/slate-select-letterspacing';
import LineHeight from 'packages/slate-select-lineheight';

// plugins
import {DEFAULT as DEFAULTLIST} from '@canner/slate-helper-block-list';
import {DEFAULT as DEFAULTBLOCKQUOTE} from '@canner/slate-helper-block-quote';
import EditList from 'slate-edit-list';
import EditBlockquote from 'slate-edit-blockquote';
import {ParagraphPlugin} from 'packages/slate-icon-shared';

import EditPrism from 'slate-prism'
import EditCode from 'slate-edit-code'

import Prism from 'prismjs';
import "prismjs/themes/prism.css"

// rules
import Html from 'slate-html-serializer';
import {DEFAULT_RULES} from 'packages/slate-editor-html';

const html = new Html({ rules: DEFAULT_RULES})

import "./style.css";
import "./github-markdown.css";

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.',
              },
            ],
          }
        ],
      }
    ],
  },
});

const selectors = [
  FontSize,
  LetterSpacing,
  LineHeight
]

const icons = [
  AlignLeft,
  AlignCenter,
  AlignRight,
  Blockquote,
  Bold,
  Clean,
  Code,
  CodeBlock,
  Emoji,
  FontBgColor,
  FontColor,
  Header1,
  Header2,
  Image,
  Video,
  Indent,
  Outdent,
  Italic,
  Link,
  OlList,
  UlList,
  StrikeThrough,
  Underline, 
  Undo,
  Redo
];

const plugins = [
  EditPrism({
    onlyIn: node => node.type === 'code_block',
    getSyntax: node => node.data.get('syntax')
  }),
  EditCode({
    onlyIn: node => node.type === 'code_block'
  }),
  EditList(DEFAULTLIST),
  EditBlockquote(DEFAULTBLOCKQUOTE),
  ParagraphPlugin(),
  BlockquotePlugin(),
  BoldPlugin(),
  CodePlugin(),
  CodeBlockPlugin(),
  FontBgColorPlugin(),
  FontColorPlugin(),
  ItalicPlugin(),
  StrikeThroughPlugin(),
  UnderlinePlugin(),
  FontSizePlugin(),
  LetterSpacingPlugin(),
  EmojiPlugin(),
  HeaderPlugin(),
  ImagePlugin(),
  LinkPlugin(),
  ListPlugin(),
  VideoPlugin()
];

class App extends React.Component {
  // Set the initial state when the app is first constructed.
  state = {
    value: initialValue
  }

  componentDidUpdate() {
    Prism.highlightAllUnder(document.getElementById('root'));
  }

  render() {
    const {value} = this.state;
    const onChange = ({value}) => this.setState({value});
    const htmlValue = html.serialize(value);
    const dataObj = html.deserialize(htmlValue);
    const beautyHTML = beautify.html(htmlValue, { indent_size: 2, space_in_empty_paren: true })

    console.log('--------------Current Value----------------')
    console.log(value.toJSON())
    console.log('--------------Deserialize from HTML--------------')
    console.log(dataObj.toJSON())

    return (
      <Row>
        <Col span={12} style={{borderRight: '1px solid #DDD', minHeight: '100vh'}}>
          <div className="toolbar">
            <div>
              {selectors.map((Type, i) => {
                return <Type
                  change={value.change()}
                  onChange={onChange}
                  key={i}
                  className="toolbar-select"
                />
              })}
            </div>
            <div>
              {icons.map((Type, i) => {
                return <Type
                  change={value.change()}
                  onChange={onChange}
                  key={i}
                  className="toolbar-item"
                  activeClassName="toolbar-item-active"
                  disableClassName="toolbar-item-disable"
                  activeStrokeClassName="ql-stroke-active"
                  activeFillClassName="ql-fill-active"
                  activeThinClassName="ql-thin-active"
                  activeEvenClassName="ql-even-active"
                />
              })}
            </div>
          </div>
          <div className="editor markdown-body">
            <Editor
              value={value}
              onChange={onChange}
              plugins={plugins}
            />
          </div>
        </Col>
        <Col span={12} style={{padding: '5px 0 5px 10px'}}>
          <h3>Serialized HTML</h3>
          <pre>
            <code className="language-markup">
              {beautyHTML}
            </code>
          </pre>
        </Col>
      </Row>
    );
  }
}

ReactDOM.render(
  <App/>
, document.getElementById('root'));
