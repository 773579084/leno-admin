/* eslint-disable no-restricted-syntax */
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, IToolbarConfig, SlateElement } from '@wangeditor/editor';
import './index.module.scss';
import { commonUploadImgAPI } from '@/api/modules/common';

type ImageElement = SlateElement & {
  src: string;
  alt: string;
  url: string;
  href: string;
};
type InsertFnType = (url: string, alt: string, href: string) => void;

const TextEditor = (props: { editorHtml: string; imgs: string }, ref: any) => {
  const { editorHtml, imgs } = props;
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  // 编辑器内容
  const [html, setHtml] = useState(editorHtml);
  // 存储上传的图片
  const [uploadedImg, setUploadedImg] = useState<string[]>([]);

  useEffect(() => {
    setHtml(editorHtml);
  }, [editorHtml]);

  useEffect(() => {
    if (imgs) setUploadedImg(JSON.parse(imgs));
  }, [imgs]);

  // ref 上传数据
  useImperativeHandle(ref, () => ({
    editor,
    html,
    uploadedImg,
  }));

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {};
  // 此方法为查看 所有工具栏所有的配置项
  // const toolbar = DomEditor.getToolbar(editor as IDomEditor)
  // if (toolbar) {
  //   const curToolbarConfig = toolbar.getConfig()
  //   console.log(30, curToolbarConfig.toolbarKeys) // 当前菜单排序和分组
  // }
  // 过滤不需要的配置项 填写工具的key即可
  toolbarConfig.excludeKeys = ['group-video', 'insertImage'];

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {},
  };

  // 图片上传
  // 1 自定义校验图片
  function customCheckImageFn(src: string, alt: string, url: string): boolean | undefined | string {
    if (!src) {
      return;
    }
    if (src.indexOf('http') !== 0) {
      return '图片网址必须以 http/https 开头';
    }
    return true;
  }

  // 转换图片链接
  function customParseImageSrc(src: string): string {
    if (src.indexOf('http') !== 0) {
      return `http://${src}`;
    }
    return src;
  }

  // 插入图片
  if (editorConfig.MENU_CONF) {
    editorConfig.MENU_CONF.uploadImage = {
      async customUpload(file: File, insertFn: InsertFnType) {
        const fd = new FormData();
        fd.append('avatar', file);
        const {
          data: {
            result: { imgName },
          },
        } = await commonUploadImgAPI(fd);
        insertFn(imgName, '', '');
      },
    };

    editorConfig.MENU_CONF.insertImage = {
      onInsertedImage(imageNode: ImageElement | null) {
        if (imageNode == null) return;
        const { src, alt, url, href } = imageNode;
        uploadedImg.push(src.split('/')[src.split('/').length - 1]);
        setUploadedImg(uploadedImg);
      },
      checkImage: customCheckImageFn,
      parseImageSrc: customParseImageSrc,
    };

    // 编辑图片
    editorConfig.MENU_CONF.editImage = {
      onUpdatedImage(imageNode: ImageElement | null) {
        // eslint-disable-next-line no-useless-return
        if (imageNode == null) return;
      },
      checkImage: customCheckImageFn,
      parseImageSrc: customParseImageSrc,
    };
  }

  // 及时销毁 editor ，重要！
  useEffect(
    () => () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    },
    [editor],
  );

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" style={{ borderBottom: '1px solid #ccc' }} />
        <Editor defaultConfig={editorConfig} value={html} onCreated={setEditor} onChange={(editor2) => setHtml(editor2.getHtml())} mode="default" style={{ height: '400px', overflowY: 'hidden' }} />
      </div>
    </>
  );
};

export default forwardRef(TextEditor);
